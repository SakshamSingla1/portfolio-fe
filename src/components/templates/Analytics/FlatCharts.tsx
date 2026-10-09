import React, { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { DEVICE_HUES_LIGHT, DEVICE_HUES_DARK, DEVICE_LABEL } from "../Dashboard/AnalyticsCharts";
import type { IDailyView } from "../../../services/useDashboardService";

// Flat restyle of Dashboard/AnalyticsCharts.tsx's TrendAreaChart/DeviceDonutChart for the
// "clean & minimal" Analytics page rebuild — same underlying data shapes and the same
// colorblind-validated device hues, but no gradient fill/glow/shimmer. Per the dataviz
// skill: a single-series line needs no legend (the panel title names it), and the
// 3-category device breakdown reuses already-validated categorical hues rather than
// inventing a new palette.

interface FlatTrendChartProps {
  data: IDailyView[];
  color: string;
  height?: number;
}

export const FlatTrendChart: React.FC<FlatTrendChartProps> = ({ data, color, height = 220 }) => {
  const colors = useColors();
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={colors.neutral200} strokeDasharray="3 5" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          minTickGap={24}
          tick={{ fill: colors.neutral400, fontSize: 10, fontWeight: 600 }}
        />
        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          width={28}
          tick={{ fill: colors.neutral400, fontSize: 10 }}
        />
        <Tooltip
          cursor={{ stroke: colors.neutral300, strokeWidth: 1, strokeDasharray: "3 3" }}
          content={({ active, payload, label }) => {
            if (!active) return null;
            const value = Number(payload?.[0]?.value ?? 0);
            return (
              <div
                className="rounded-lg px-3 py-2 text-xs"
                style={{ background: colors.neutral0, border: `1px solid ${colors.neutral300}`, color: colors.neutral700 }}
              >
                <div className="font-semibold mb-0.5" style={{ color: colors.neutral500, fontSize: 10 }}>{String(label)}</div>
                <div className="font-black tabular-nums" style={{ color }}>{value} view{value === 1 ? "" : "s"}</div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          fill={color}
          fillOpacity={0.06}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: colors.neutral0, strokeWidth: 2 }}
          isAnimationActive
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface FlatDeviceBreakdownProps {
  breakdown: Record<string, number>;
}

export const FlatDeviceBreakdown: React.FC<FlatDeviceBreakdownProps> = ({ breakdown }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const hues = isDark ? DEVICE_HUES_DARK : DEVICE_HUES_LIGHT;

  const sorted = useMemo(
    () => Object.entries(breakdown).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]),
    [breakdown]
  );
  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;

  if (!sorted.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex rounded-full overflow-hidden" style={{ height: 8, background: colors.neutral100 }}>
        {sorted.map(([key, count]) => (
          <div key={key} style={{ width: `${(count / total) * 100}%`, background: hues[key] ?? colors.neutral400 }} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map(([key, count]) => {
          const pct = Math.round((count / total) * 100);
          const color = hues[key] ?? colors.neutral400;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[11px] font-semibold flex-1" style={{ color: colors.neutral600 }}>
                {DEVICE_LABEL[key] ?? key}
              </span>
              <span className="text-[11px] font-black tabular-nums" style={{ color }}>{pct}%</span>
              <span className="text-[9px] w-8 text-right" style={{ color: colors.neutral400 }}>({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Flat restyle of ViewAnalytics.template.tsx's BreakdownBars (same data shape) — a solid
// fill instead of a glow/box-shadow gradient bar.
export const FlatBreakdownBars: React.FC<{
  items: { key: string; label: string; color: string; icon?: React.ReactNode }[];
  breakdown: Record<string, number>;
}> = ({ items, breakdown }) => {
  const colors = useColors();
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ key, label, color, icon }) => {
        const count = breakdown[key] ?? 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                {icon
                  ? <span style={{ color, flexShrink: 0, fontSize: 12 }}>{icon}</span>
                  : <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />}
                <span className="text-[11px] font-semibold truncate max-w-[140px]" style={{ color: colors.neutral600 }}>
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-black tabular-nums" style={{ color }}>{pct}%</span>
                {count > 0 && (
                  <span className="text-[9px]" style={{ color: colors.neutral400 }}>({count})</span>
                )}
              </div>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: colors.neutral100 }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
