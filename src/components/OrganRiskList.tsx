import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { ORGAN_META } from "./OrganCard";
import type { OrganScores, RiskLevel } from "@/store/useStore";

const LEVEL_LABEL: Record<RiskLevel, string> = {
  healthy: "Healthy",
  moderate: "Moderate",
  high: "High",
};
const LEVEL_TEXT: Record<RiskLevel, string> = {
  healthy: "text-risk-healthy",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
};

const ORDER: Array<keyof OrganScores> = ["brain", "heart", "liver", "kidneys"];

const DESCRIPTIONS: Record<keyof OrganScores, string> = {
  brain: "High BMI, limited exercise, and poor sleep may decrease brain performance.",
  heart: "Poor diet and limited exercise increase cardiovascular risk.",
  liver: "Fast food diet and alcohol consumption may strain liver.",
  kidneys: "Obesity and high salt intake could reduce kidney function.",
  lungs: "Smoking and air quality elevate respiratory risk.",
};

export default function OrganRiskList() {
  const scores = useStore((s) => s.organScores);
  if (!scores) return null;

  return (
    <div className="glass-card rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Organ Risk Levels
        </h3>
        <span className="text-muted-foreground/60 text-lg leading-none">···</span>
      </div>
      <div className="space-y-3">
        {ORDER.map((key, i) => {
          const meta = ORGAN_META[key];
          const data = scores[key];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5 hover:ring-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${meta.iconColor} drop-shadow-[0_0_8px_currentColor] mt-0.5`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-foreground">{meta.name}</div>
                      <div className={`text-xs font-medium ${LEVEL_TEXT[data.level]}`}>
                        {LEVEL_LABEL[data.level]}
                      </div>
                    </div>
                    <div className="text-xl font-bold tabular-nums text-foreground">{data.score}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {DESCRIPTIONS[key]}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
