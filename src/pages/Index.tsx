import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "@/components/ControlPanel";
import HealthDataCard from "@/components/HealthDataCard";
import ChartPanel from "@/components/ChartPanel";
import OrganRiskList from "@/components/OrganRiskList";
import ProfileCard from "@/components/ProfileCard";
import ReportAnalyzer from "@/components/ReportAnalyzer";
import { useStore } from "@/store/useStore";
import {
  TbActivityHeartbeat,
  TbBell,
  TbDownload,
  TbDeviceFloppy,
  TbChevronDown,
  TbSparkles,
} from "react-icons/tb";

const Index = () => {
  const [tab, setTab] = useState<"organ" | "trends">("organ");
  const narrative = useStore((s) => s.narrative);
  const loading = useStore((s) => s.loading);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center text-primary text-xl shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
            <TbActivityHeartbeat />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Health Digital <span className="neon-text">Twin</span> Simulator
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-full bg-secondary/60 ring-1 ring-border hover:ring-primary/40 flex items-center justify-center text-muted-foreground transition-colors">
            <TbBell />
          </button>
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary/60 ring-1 ring-border">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/40 to-organ-lungs/40 flex items-center justify-center text-xs font-bold">
              ER
            </div>
            <span className="text-sm font-medium">Ethan Richards</span>
            <TbChevronDown className="text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4 p-4 lg:p-6 min-h-0">
        {/* LEFT */}
        <ControlPanel />

        {/* CENTER */}
        <section className="flex flex-col gap-4 min-w-0">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Health Dashboard</h2>
            <div className="flex items-center gap-2">
              <button className="h-9 px-3 rounded-lg bg-secondary/60 ring-1 ring-border hover:ring-primary/40 text-sm flex items-center gap-1.5 text-muted-foreground transition-colors">
                <TbDownload /> Export <TbChevronDown className="text-muted-foreground" />
              </button>
              <button className="h-9 px-3 rounded-lg bg-secondary/60 ring-1 ring-border hover:ring-primary/40 text-sm flex items-center gap-1.5 text-muted-foreground transition-colors">
                <TbDeviceFloppy /> Save
              </button>
            </div>
          </div>

          {/* Top: Health Data + Organ Risk Levels */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
            <div className="flex flex-col gap-4">
              <HealthDataCard />
              {/* Charts with tabs */}
              <div className="glass-card rounded-2xl p-5 flex flex-col min-h-[340px]">
                <div className="h-[260px]">
                  <ChartPanel />
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-3">
                  {(["organ", "trends"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        tab === t
                          ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "organ" ? "Organ Risks" : "Health Trends"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <OrganRiskList />
          </div>

          {/* Bottom: secondary chart + analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
            <div className="glass-card rounded-2xl p-5 flex flex-col min-h-[280px]">
              <div className="h-[200px]">
                <ChartPanel
                  title="Risks Over Time"
                  subtitle="Last 12 months"
                  showLegend={false}
                  organs={["heart", "liver", "lungs"]}
                />
              </div>
              <div className="mt-4 border-t border-border/50 pt-4">
                <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                  <TbSparkles className="text-primary" /> Simulation Analysis
                </h4>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={narrative}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {loading ? "Generating projection…" : narrative}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <TbSparkles className="text-primary" /> Simulation Analysis
              </h4>
              <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Heart Health</div>
                    <div className="text-xs text-risk-moderate font-medium">Moderate Risk</div>
                  </div>
                  <div className="text-xl font-bold tabular-nums">
                    {useStore.getState().organScores?.heart.score ?? 60}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your BMI and limited exercise increase cardiovascular risk. Aim for at least 2 days per week with 30 minutes of moderate exercise and consider eating less fast food.
                </p>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <div className="font-semibold text-foreground mb-1">General Recommendations</div>
                Exercise 2 days per week with 30 minutes of moderate activity.
              </div>
            </div>
          </div>

          {/* AI Report Analyzer */}
          <ReportAnalyzer />
        </section>

        {/* RIGHT */}
        <ProfileCard />
      </main>
    </div>
  );
};

export default Index;
