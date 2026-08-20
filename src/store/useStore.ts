import { create } from "zustand";
import { fetchHealthReport } from "@/services/api";

export type RiskLevel = "healthy" | "moderate" | "high";
export type DietType = "balanced" | "average" | "poor";

export interface LifestyleData {
  age: number;
  bmi: number;
  sleep: number;
  activity: number;
  smoking: boolean;
  alcohol: boolean;
  diet: DietType;
}

export interface OrganScore {
  score: number;
  level: RiskLevel;
}

export interface OrganScores {
  heart: OrganScore;
  lungs: OrganScore;
  liver: OrganScore;
  kidneys: OrganScore;
  brain: OrganScore;
}

export interface TrendPoint {
  month: string;
  heart: number;
  lungs: number;
  liver: number;
  kidneys: number;
  brain: number;
}

export interface HealthReport {
  organs: OrganScores;
  narrative: string;
  trends: TrendPoint[];
}

interface StoreState {
  lifestyleData: LifestyleData;
  organScores: OrganScores | null;
  trends: TrendPoint[];
  narrative: string;
  loading: boolean;
  hoveredOrgan: keyof OrganScores | null;
  setLifestyle: <K extends keyof LifestyleData>(k: K, v: LifestyleData[K]) => void;
  setHoveredOrgan: (o: keyof OrganScores | null) => void;
  runSimulation: () => Promise<void>;
}

const defaultScores: OrganScores = {
  heart: { score: 60, level: "moderate" },
  lungs: { score: 90, level: "high" },
  liver: { score: 52, level: "moderate" },
  kidneys: { score: 55, level: "moderate" },
  brain: { score: 78, level: "high" },
};

const defaultTrends: TrendPoint[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
  month: m,
  heart: 55 + i * 2,
  lungs: 70 + i * 3,
  liver: 48 + i,
  kidneys: 50 + i * 1.5,
  brain: 72 + i * 0.8,
}));

export const useStore = create<StoreState>((set, get) => ({
  lifestyleData: {
    age: 32,
    bmi: 27,
    sleep: 5.5,
    activity: 2,
    smoking: false,
    alcohol: true,
    diet: "average",
  },
  organScores: defaultScores,
  trends: defaultTrends,
  narrative:
    "Initial baseline projection. Run a simulation to generate a personalized health forecast based on your current lifestyle profile.",
  loading: false,
  hoveredOrgan: null,
  setLifestyle: (k, v) =>
    set((s) => ({ lifestyleData: { ...s.lifestyleData, [k]: v } })),
  setHoveredOrgan: (o) => set({ hoveredOrgan: o }),
  runSimulation: async () => {
    set({ loading: true });
    try {
      const report = await fetchHealthReport(get().lifestyleData);
      set({
        organScores: report.organs,
        trends: report.trends,
        narrative: report.narrative,
        loading: false,
      });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },
}));
