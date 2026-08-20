import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { TbBrain, TbHeartbeat, TbLungs, TbCalendar, TbAlertTriangle, TbAlertOctagon } from "react-icons/tb";

const RISK_TONE = {
  healthy: { ring: "ring-risk-healthy/30", text: "text-risk-healthy", chip: "bg-risk-healthy/15", icon: <TbCalendar /> , label: "Stable" },
  moderate: { ring: "ring-risk-moderate/30", text: "text-risk-moderate", chip: "bg-risk-moderate/15", icon: <TbAlertTriangle />, label: "Moderate" },
  high: { ring: "ring-risk-high/30", text: "text-risk-high", chip: "bg-risk-high/15", icon: <TbAlertOctagon />, label: "Danger" },
} as const;

interface MetricProps {
  icon: React.ReactNode;
  iconColor: string;
  name: string;
  score: number;
  level: "healthy" | "moderate" | "high";
  subValue: string;
  subLabel: string;
  delay?: number;
}

function MetricCard({ icon, iconColor, name, score, level, subValue, subLabel, delay = 0 }: MetricProps) {
  const tone = RISK_TONE[level];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl bg-secondary/40 ring-1 ring-border/60 p-4 hover:ring-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span className={`text-lg ${iconColor} drop-shadow-[0_0_6px_currentColor]`}>{icon}</span>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-2xl font-bold tabular-nums text-foreground">{score}</span>
      </div>
      <div className={`inline-flex items-center gap-1.5 mt-3 px-2 py-0.5 rounded-md text-xs font-medium ${tone.chip} ${tone.text} ring-1 ${tone.ring}`}>
        <span className="text-[11px]">{tone.icon}</span>
        {tone.label}
      </div>
      <div className="mt-2 text-xs">
        <span className={`font-semibold tabular-nums ${tone.text}`}>{subValue}</span>{" "}
        <span className="text-muted-foreground">{subLabel}</span>
      </div>
    </motion.div>
  );
}

export default function HealthDataCard() {
  const scores = useStore((s) => s.organScores);
  if (!scores) return null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Health Data
        </h3>
        <span className="text-muted-foreground/60 text-lg leading-none">···</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={<TbBrain />}
          iconColor="text-organ-brain"
          name="Brain"
          score={scores.brain.score}
          level={scores.brain.level}
          subValue={`${Math.round(scores.brain.score * 0.5)}`}
          subLabel="cognitive index"
          delay={0}
        />
        <MetricCard
          icon={<TbHeartbeat />}
          iconColor="text-organ-heart"
          name="Heart Risk"
          score={scores.heart.score}
          level={scores.heart.level}
          subValue={`${Math.round(scores.heart.score)}`}
          subLabel="bpm load"
          delay={0.05}
        />
        <MetricCard
          icon={<TbLungs />}
          iconColor="text-organ-lungs"
          name="Lungs"
          score={scores.lungs.score}
          level={scores.lungs.level}
          subValue={`${Math.round(scores.lungs.score)}`}
          subLabel="capacity index"
          delay={0.1}
        />
      </div>
    </div>
  );
}
