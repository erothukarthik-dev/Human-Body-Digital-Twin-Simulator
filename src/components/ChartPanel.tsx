import { useStore } from "@/store/useStore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const ORGAN_COLORS: Record<string, string> = {
  brain: "#00FFA3",
  heart: "#EF4444",
  liver: "#F97316",
  kidneys: "#A855F7",
  lungs: "#0EA5E9",
};

interface Props {
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  height?: number | string;
  organs?: Array<keyof typeof ORGAN_COLORS>;
}

export default function ChartPanel({
  title = "Risks Over Time",
  subtitle = "Last 6 months",
  showLegend = true,
  organs,
}: Props) {
  const trends = useStore((s) => s.trends);
  const keys = organs ?? (Object.keys(ORGAN_COLORS) as Array<keyof typeof ORGAN_COLORS>);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      {showLegend && (
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {keys.map((k) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-muted-foreground capitalize">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: ORGAN_COLORS[k], boxShadow: `0 0 6px ${ORGAN_COLORS[k]}` }}
              />
              {k}
            </span>
          ))}
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            {keys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={ORGAN_COLORS[key]}
                strokeWidth={2}
                dot={{ r: 2.5, strokeWidth: 0, fill: ORGAN_COLORS[key] }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={900}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
