import { motion } from "framer-motion";
import type { OrganScores, RiskLevel } from "@/store/useStore";
import {
  TbHeartbeat,
  TbLungs,
  TbBrain,
  TbDroplet,
  TbBowlSpoon,
} from "react-icons/tb";

const RISK_LABEL: Record<RiskLevel, string> = {
  healthy: "Healthy",
  moderate: "Moderate Risk",
  high: "High Risk",
};

const RISK_CLASS: Record<RiskLevel, string> = {
  healthy: "text-risk-healthy",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
};

const RISK_BG: Record<RiskLevel, string> = {
  healthy: "bg-risk-healthy/10 ring-risk-healthy/30",
  moderate: "bg-risk-moderate/10 ring-risk-moderate/30",
  high: "bg-risk-high/10 ring-risk-high/30",
};

export const ORGAN_META: Record<
  keyof OrganScores,
  { name: string; icon: React.ReactNode; iconColor: string; description: string }
> = {
  brain: {
    name: "Brain",
    icon: <TbBrain />,
    iconColor: "text-organ-brain",
    description: "Cognitive function and sleep recovery indicators.",
  },
  heart: {
    name: "Heart",
    icon: <TbHeartbeat />,
    iconColor: "text-organ-heart",
    description: "Cardiovascular load based on activity, diet and lifestyle.",
  },
  lungs: {
    name: "Lungs",
    icon: <TbLungs />,
    iconColor: "text-organ-lungs",
    description: "Respiratory health and oxygen exchange capacity.",
  },
  liver: {
    name: "Liver",
    icon: <TbBowlSpoon />,
    iconColor: "text-organ-liver",
    description: "Detoxification load from diet and alcohol intake.",
  },
  kidneys: {
    name: "Kidneys",
    icon: <TbDroplet />,
    iconColor: "text-organ-kidneys",
    description: "Filtration efficiency and metabolic stress indicators.",
  },
};

interface Props {
  organKey: keyof OrganScores;
  score: number;
  level: RiskLevel;
  index?: number;
  compact?: boolean;
}

export default function OrganCard({ organKey, score, level, index = 0, compact }: Props) {
  const meta = ORGAN_META[organKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`glass-card rounded-xl p-4 ring-1 ${RISK_BG[level]} hover:scale-[1.01] transition-transform`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`text-2xl ${meta.iconColor} drop-shadow-[0_0_8px_currentColor]`}>
            {meta.icon}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground">{meta.name}</div>
            <div className={`text-xs font-medium ${RISK_CLASS[level]}`}>
              {RISK_LABEL[level]}
            </div>
          </div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${RISK_CLASS[level]}`}>
          {score}
        </div>
      </div>
      {!compact && (
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {meta.description}
        </p>
      )}
    </motion.div>
  );
}
