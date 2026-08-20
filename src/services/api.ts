import axios from "axios";
import type { LifestyleData, HealthReport } from "@/store/useStore";

const API_BASE = "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// Deterministic mock generator — used as fallback when backend isn't reachable.
function generateMockReport(data: LifestyleData): HealthReport {
  const { age, bmi, sleep, activity, smoking, alcohol, diet } = data;

  const dietPenalty = diet === "poor" ? 18 : diet === "average" ? 8 : 0;
  const smokePenalty = smoking ? 25 : 0;
  const alcoholPenalty = alcohol ? 12 : 0;

  const bmiPenalty = Math.max(0, Math.abs(bmi - 22) * 2);
  const sleepPenalty = Math.max(0, (7.5 - sleep) * 6);
  const activityBonus = activity * 4;
  const agePenalty = Math.max(0, (age - 30) * 0.6);

  const base = 35 + bmiPenalty + sleepPenalty + agePenalty - activityBonus;

  const score = (extra = 0) => {
    const s = Math.round(Math.min(95, Math.max(20, base + extra)));
    return s;
  };
  const level = (s: number): "healthy" | "moderate" | "high" =>
    s >= 70 ? "high" : s >= 45 ? "moderate" : "healthy";

  const heart = score(smokePenalty + alcoholPenalty * 0.5 + dietPenalty);
  const lungs = score(smokePenalty * 1.4);
  const liver = score(alcoholPenalty * 1.6 + dietPenalty * 0.8);
  const kidneys = score(bmiPenalty * 0.6 + dietPenalty * 0.5 + alcoholPenalty * 0.4);
  const brain = score(sleepPenalty * 0.8 + smokePenalty * 0.4);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trends = months.map((m, i) => {
    const drift = (i - 2.5) * 3;
    return {
      month: m,
      heart: Math.max(15, Math.min(95, heart + drift + (Math.sin(i) * 4))),
      lungs: Math.max(15, Math.min(95, lungs + drift * 0.8 + Math.cos(i) * 5)),
      liver: Math.max(15, Math.min(95, liver + drift * 0.6)),
      kidneys: Math.max(15, Math.min(95, kidneys + drift * 0.5)),
      brain: Math.max(15, Math.min(95, brain - drift * 0.3)),
    };
  });

  const issues: string[] = [];
  if (smoking) issues.push("smoking severely elevates lung and cardiovascular risk");
  if (alcohol) issues.push("regular alcohol intake stresses your liver");
  if (bmi > 25) issues.push("BMI above optimal range increases metabolic load");
  if (sleep < 7) issues.push("insufficient sleep impairs cognitive recovery");
  if (activity < 3) issues.push("low activity reduces cardiovascular resilience");
  if (diet === "poor") issues.push("poor diet weakens organ function over time");

  const narrative =
    issues.length === 0
      ? "Your current lifestyle profile is well balanced. Maintain your habits to preserve long-term organ health."
      : `Your simulation indicates elevated risks: ${issues.join(", ")}. Adjusting these factors can significantly improve your projected organ trajectory.`;

  return {
    organs: {
      heart: { score: heart, level: level(heart) },
      lungs: { score: lungs, level: level(lungs) },
      liver: { score: liver, level: level(liver) },
      kidneys: { score: kidneys, level: level(kidneys) },
      brain: { score: brain, level: level(brain) },
    },
    narrative,
    trends,
  };
}

export async function fetchHealthReport(data: LifestyleData): Promise<HealthReport> {
  try {
    const res = await client.post<HealthReport>("/v1/health-report", data);
    return res.data;
  } catch {
    // Graceful fallback for local-only development without backend
    await new Promise((r) => setTimeout(r, 900));
    return generateMockReport(data);
  }
}
