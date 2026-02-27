"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  formatValue?: (v: number) => string;
  color?: string;
}

export function BarChart({
  data,
  maxValue,
  formatValue = (v) => String(v),
  color = "from-rose-400/80 to-purple-400/80",
}: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted">{item.label}</span>
              <span className="font-medium text-foreground">
                {formatValue(item.value)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
