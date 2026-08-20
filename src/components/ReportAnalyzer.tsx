import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  TbFileUpload,
  TbSparkles,
  TbAlertTriangle,
  TbStethoscope,
  TbClipboardList,
  TbX,
  TbLoader2,
  TbUserHeart,
  TbBuildingHospital,
  TbMapPin,
  TbCurrentLocation,
  TbPhone,
  TbExternalLink,
} from "react-icons/tb";
import { ALL_CITIES, findHospitals, type Hospital } from "@/data/hospitals";
import { getBrowserPosition, reverseGeocodeCity } from "@/lib/geo";

type Status = "normal" | "borderline" | "abnormal" | "unclear";
type Risk = "healthy" | "moderate" | "high";
type Urgency = "routine" | "soon" | "urgent";

interface Finding {
  label: string;
  value: string;
  status: Status;
  note: string;
}
interface OrganRisk {
  organ: string;
  level: Risk;
  reason: string;
}
interface DoctorSuggestion {
  specialty: string;
  reason: string;
  urgency: Urgency;
}
interface HospitalSuggestion {
  type: string;
  reason: string;
  departments: string[];
}
interface Analysis {
  summary: string;
  overall_risk: Risk;
  key_findings: Finding[];
  organ_risks: OrganRisk[];
  recommendations: string[];
  red_flags: string[];
  suggested_doctors: DoctorSuggestion[];
  suggested_hospitals: HospitalSuggestion[];
  disclaimer: string;
}

const RISK_CHIP: Record<Risk, string> = {
  healthy: "bg-risk-healthy/15 text-risk-healthy ring-risk-healthy/30",
  moderate: "bg-risk-moderate/15 text-risk-moderate ring-risk-moderate/30",
  high: "bg-risk-high/15 text-risk-high ring-risk-high/30",
};

const STATUS_CHIP: Record<Status, string> = {
  normal: "bg-risk-healthy/15 text-risk-healthy",
  borderline: "bg-risk-moderate/15 text-risk-moderate",
  abnormal: "bg-risk-high/15 text-risk-high",
  unclear: "bg-secondary text-muted-foreground",
};

const URGENCY_CHIP: Record<Urgency, string> = {
  routine: "bg-risk-healthy/15 text-risk-healthy ring-risk-healthy/30",
  soon: "bg-risk-moderate/15 text-risk-moderate ring-risk-moderate/30",
  urgent: "bg-risk-high/15 text-risk-high ring-risk-high/30",
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ReportAnalyzer() {
  const [text, setText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const detectLocation = async () => {
    setLocating(true);
    try {
      const pos = await getBrowserPosition();
      const detected = await reverseGeocodeCity(pos.coords.latitude, pos.coords.longitude);
      if (detected) {
        setCity(detected);
        toast.success(`Location set to ${detected}`);
      } else {
        toast.error("Couldn't detect your city. Please type it manually.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Location permission denied");
    } finally {
      setLocating(false);
    }
  };

  const nearbyHospitals: Hospital[] = useMemo(() => {
    if (!analysis || !city.trim()) return [];
    const specialties = analysis.suggested_doctors?.map((d) => d.specialty) ?? [];
    return findHospitals(city, specialties);
  }, [analysis, city]);

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image of the report (PNG/JPG).");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Image is too large (max 8 MB).");
      return;
    }
    setImageDataUrl(await fileToDataUrl(f));
  };

  const analyze = async () => {
    if (!text.trim() && !imageDataUrl) {
      toast.error("Paste report text or upload an image first.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-report", {
        body: { reportText: text, imageDataUrl },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis((data as { analysis: Analysis }).analysis);
      toast.success("Report analyzed");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Failed to analyze report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <TbStethoscope className="text-primary" /> AI Report Analyzer
        </h3>
        {analysis && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${RISK_CHIP[analysis.overall_risk]}`}
          >
            {analysis.overall_risk} overall
          </span>
        )}
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste lab results, doctor's notes, or scan summary here…"
          className="min-h-[110px] rounded-xl bg-secondary/40 ring-1 ring-border/60 focus:ring-primary/40 outline-none p-3 text-sm resize-y"
        />
        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="h-10 px-3 rounded-lg bg-secondary/60 ring-1 ring-border hover:ring-primary/40 text-sm flex items-center justify-center gap-1.5 text-muted-foreground transition-colors"
          >
            <TbFileUpload /> Upload image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={analyze}
            disabled={loading}
            className="h-10 px-4 rounded-lg bg-primary/15 text-primary ring-1 ring-primary/40 hover:bg-primary/25 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
          >
            {loading ? <TbLoader2 className="animate-spin" /> : <TbSparkles />}
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {imageDataUrl && (
        <div className="flex items-center gap-3 rounded-lg bg-secondary/40 ring-1 ring-border/60 p-2">
          <img
            src={imageDataUrl}
            alt="Report preview"
            className="h-14 w-14 rounded-md object-cover ring-1 ring-border"
          />
          <span className="text-xs text-muted-foreground flex-1">Image attached</span>
          <button
            onClick={() => setImageDataUrl(null)}
            className="h-7 w-7 rounded-md hover:bg-secondary text-muted-foreground flex items-center justify-center"
            aria-label="Remove image"
          >
            <TbX />
          </button>
        </div>
      )}

      {/* Location */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <TbMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            list="city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Your city (for nearby hospitals)"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary/40 ring-1 ring-border/60 focus:ring-primary/40 outline-none text-sm"
          />
          <datalist id="city-list">
            {ALL_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <button
          onClick={detectLocation}
          disabled={locating}
          className="h-10 px-3 rounded-lg bg-secondary/60 ring-1 ring-border hover:ring-primary/40 text-sm flex items-center justify-center gap-1.5 text-muted-foreground transition-colors disabled:opacity-60"
        >
          {locating ? <TbLoader2 className="animate-spin" /> : <TbCurrentLocation />}
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {analysis && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Summary
              </div>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            {analysis.red_flags.length > 0 && (
              <div className="rounded-xl bg-risk-high/10 ring-1 ring-risk-high/30 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-risk-high mb-1.5 flex items-center gap-1.5">
                  <TbAlertTriangle /> Red flags
                </div>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground/90">
                  {analysis.red_flags.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.key_findings.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TbClipboardList /> Key findings
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.key_findings.map((f, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card/60 ring-1 ring-border/60 p-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate">{f.label}</div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${STATUS_CHIP[f.status]}`}
                        >
                          {f.status}
                        </span>
                      </div>
                      <div className="text-sm tabular-nums text-foreground/90 mt-0.5">
                        {f.value}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {f.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.organ_risks.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Organ risk
                </div>
                <div className="space-y-2">
                  {analysis.organ_risks.map((o, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ring-1 ${RISK_CHIP[o.level]}`}
                      >
                        {o.organ}
                      </span>
                      <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
                        {o.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggested_doctors?.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TbUserHeart /> Suggested specialists
                </div>
                <div className="space-y-2">
                  {analysis.suggested_doctors.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card/60 ring-1 ring-border/60 p-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">{d.specialty}</div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ${URGENCY_CHIP[d.urgency]}`}
                        >
                          {d.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {d.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggested_hospitals?.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TbBuildingHospital /> Recommended facilities
                </div>
                <div className="space-y-2">
                  {analysis.suggested_hospitals.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card/60 ring-1 ring-border/60 p-2.5"
                    >
                      <div className="text-sm font-medium">{h.type}</div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {h.reason}
                      </p>
                      {h.departments?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {h.departments.map((dep, j) => (
                            <span
                              key={j}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
                            >
                              {dep}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nearbyHospitals.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TbBuildingHospital /> Real hospitals in {city}
                </div>
                <div className="space-y-2">
                  {nearbyHospitals.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card/60 ring-1 ring-border/60 p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium leading-snug">{h.name}</div>
                        {h.website && (
                          <a
                            href={h.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Open website"
                          >
                            <TbExternalLink />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex items-start gap-1.5">
                        <TbMapPin className="mt-0.5 shrink-0" />
                        <span>{h.address}</span>
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <a
                          href={`tel:${h.phone.replace(/\s+/g, "")}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <TbPhone /> {h.phone}
                        </a>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {h.specialties.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/80 mt-2 italic">
                  Public directory data — please verify details before visiting.
                </p>
              </div>
            )}

            {analysis && city.trim() && nearbyHospitals.length === 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3 text-xs text-muted-foreground">
                No hospitals in our directory match <span className="font-medium text-foreground">{city}</span>. Try a major nearby city like {ALL_CITIES.slice(0, 4).join(", ")}.
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Recommendations
                </div>
                <ul className="text-sm space-y-1.5 list-disc list-inside text-foreground/90">
                  {analysis.recommendations.map((r, i) => (
                    <li key={i} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
              {analysis.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
