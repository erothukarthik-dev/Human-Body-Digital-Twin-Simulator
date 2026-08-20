import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { TbHeartbeat, TbBulb } from "react-icons/tb";

export default function ProfileCard() {
  const data = useStore((s) => s.lifestyleData);
  const scores = useStore((s) => s.organScores);
  const heart = scores?.heart;

  const initials = "ER";

  return (
    <div className="flex flex-col gap-4">
      {/* Profile */}
      <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/40 to-organ-lungs/40 flex items-center justify-center text-2xl font-bold text-foreground ring-2 ring-primary/30 shadow-[0_0_24px_hsl(var(--primary)/0.4)]">
            {initials}
          </div>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-risk-healthy ring-2 ring-card" />
        </div>
        <h3 className="mt-3 text-lg font-semibold text-foreground">Ethan Richards</h3>

        <div className="w-full mt-4 space-y-2 text-sm">
          {[
            ["Age", `${data.age} years`],
            ["BMI", `${data.bmi}`],
            ["Smoking", data.smoking ? "Yes" : "No"],
            ["Alcohol", data.alcohol ? "Yes" : "No"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs uppercase tracking-wide">{k}</span>
              <span className="font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlight risk */}
      {heart && (
        <motion.div
          key={heart.score}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Organ Risk Levels
            </h3>
            <span className="text-muted-foreground/60 text-lg leading-none">···</span>
          </div>
          <div className="rounded-xl bg-secondary/40 ring-1 ring-border/60 p-3.5">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-organ-heart drop-shadow-[0_0_8px_currentColor] mt-0.5">
                <TbHeartbeat />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Heart Health</div>
                    <div className="text-xs text-risk-moderate font-medium">Moderate Risk</div>
                  </div>
                  <div className="text-xl font-bold tabular-nums">{heart.score}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your BMI of {data.bmi} and limited exercise increase cardiovascular risk.
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Aim for at least 2 days per week with 30 minutes of moderate exercise and consider eating less fast food.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Personalized recommendations preview */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TbBulb className="text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Personalized Recommendations
          </h3>
        </div>
        <div className="rounded-xl bg-secondary/30 ring-1 ring-border/50 p-3.5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-xl text-organ-lungs drop-shadow-[0_0_6px_currentColor]">
              <TbHeartbeat />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Lung Health</div>
                  <div className="text-xs text-risk-high font-medium">High Risk</div>
                </div>
                <div className="text-lg font-bold tabular-nums text-risk-high">
                  {scores?.lungs.score ?? 50}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Smoking severely increases the risk of lung disease. Reducing or quitting will substantially lower this risk.
              </p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-3">
            <div className="text-sm font-semibold mb-1">Quitting</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Avoid fast food and increase intake of fruits and vegetables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
