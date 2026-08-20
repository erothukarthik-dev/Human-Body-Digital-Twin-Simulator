import { motion } from "framer-motion";
import { useStore, type DietType } from "@/store/useStore";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TbCalendarStats,
  TbScale,
  TbMoon,
  TbActivity,
  TbSmoking,
  TbGlassFull,
  TbSalad,
  TbPlayerPlay,
} from "react-icons/tb";

interface ControlRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
function ControlHeader({ icon, label, value }: ControlRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export default function ControlPanel() {
  const data = useStore((s) => s.lifestyleData);
  const set = useStore((s) => s.setLifestyle);
  const run = useStore((s) => s.runSimulation);
  const loading = useStore((s) => s.loading);

  return (
    <aside className="glass-card rounded-2xl p-5 flex flex-col gap-5 h-full overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Patient Info
        </h2>
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>

      <div className="space-y-2">
        <ControlHeader icon={<TbCalendarStats />} label="Age" value={`${data.age}`} />
        <Slider
          value={[data.age]}
          min={18}
          max={90}
          step={1}
          onValueChange={(v) => set("age", v[0])}
        />
      </div>

      <div className="space-y-2">
        <ControlHeader icon={<TbScale />} label="BMI" value={`${data.bmi}`} />
        <Slider
          value={[data.bmi]}
          min={15}
          max={45}
          step={1}
          onValueChange={(v) => set("bmi", v[0])}
        />
      </div>

      <div className="space-y-2">
        <ControlHeader icon={<TbMoon />} label="Sleep" value={`${data.sleep.toFixed(1)}h`} />
        <Slider
          value={[data.sleep]}
          min={3}
          max={10}
          step={0.5}
          onValueChange={(v) => set("sleep", v[0])}
        />
      </div>

      <div className="space-y-2">
        <ControlHeader icon={<TbActivity />} label="Activity" value={`${data.activity}/5`} />
        <Slider
          value={[data.activity]}
          min={0}
          max={5}
          step={1}
          onValueChange={(v) => set("activity", v[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-primary"><TbSalad /></span>
          <span>Diet</span>
        </div>
        <Select value={data.diet} onValueChange={(v) => set("diet", v as DietType)}>
          <SelectTrigger className="bg-secondary/60 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TbSmoking className="text-primary" />
          Smoking
        </div>
        <Switch checked={data.smoking} onCheckedChange={(v) => set("smoking", v)} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TbGlassFull className="text-primary" />
          Alcohol
        </div>
        <Switch checked={data.alcohol} onCheckedChange={(v) => set("alcohol", v)} />
      </div>

      <motion.div whileTap={{ scale: 0.97 }} className="mt-auto">
        <Button
          onClick={() => run()}
          disabled={loading}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide animate-pulse-glow"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
              Simulating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <TbPlayerPlay /> Run Simulation
            </span>
          )}
        </Button>
      </motion.div>
    </aside>
  );
}
