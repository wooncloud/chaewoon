"use client";

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const radius = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <svg width={size} height={size} className="shrink-0">
        {data.map((item) => {
          const pct = item.value / total;
          const dashLength = pct * circumference;
          const offset = accumulatedOffset;
          accumulatedOffset += dashLength;

          return (
            <circle
              key={item.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-500"
            />
          );
        })}
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
          style={{ fontSize: "16px" }}
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-muted"
          style={{ fontSize: "10px" }}
        >
          총 주문
        </text>
      </svg>

      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted">{item.label}</span>
            <span className="ml-auto font-medium text-foreground">
              {item.value}건
            </span>
            <span className="text-muted">
              ({((item.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
