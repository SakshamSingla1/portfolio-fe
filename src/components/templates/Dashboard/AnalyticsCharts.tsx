import React, { useMemo } from "react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import type { IDailyView } from "../../../services/useDashboardService";

// Device-mix hues below are picked from the design system's validated
// categorical order (see dataviz skill palette.md, slots 1/2/3) — the
// previous ad-hoc blue/purple/amber trio failed the colorblind-separation
// check (deutan ΔE 1.3, normal-vision ΔE 12 — below the 15 floor).
const DEVICE_HUES_LIGHT: Record<string, string> = {
    DESKTOP: "#2a78d6",
    MOBILE: "#eb6834",
    TABLET: "#1baf7a",
};
const DEVICE_HUES_DARK: Record<string, string> = {
    DESKTOP: "#3987e5",
    MOBILE: "#d95926",
    TABLET: "#199e70",
};

interface TooltipBoxProps {
    active?: boolean;
    label?: string;
    value?: React.ReactNode;
    accent?: string;
}

const TooltipBox: React.FC<TooltipBoxProps> = ({ active, label, value, accent }) => {
    const colors = useColors();
    if (!active) return null;
    return (
        <div
            className="rounded-lg px-3 py-2 text-xs shadow-lg"
            style={{
                background: colors.neutral0,
                border: `1.5px solid ${colors.neutral300}`,
                color: colors.neutral700,
            }}
        >
            <div className="font-semibold mb-0.5" style={{ color: colors.neutral500, fontSize: 10 }}>{label}</div>
            <div className="font-black tabular-nums flex items-center gap-1.5" style={{ color: accent ?? colors.neutral900 }}>
                {accent && <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: accent }} />}
                {value}
            </div>
        </div>
    );
};

interface TrendAreaChartProps {
    data: IDailyView[];
    color: string;
    height?: number;
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({ data, color, height = 220 }) => {
    const colors = useColors();

    if (!data.length) return null;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={colors.neutral200} strokeDasharray="3 5" />
                <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
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
                    content={({ active, payload, label }) => (
                        <TooltipBox
                            active={active}
                            label={String(label)}
                            value={`${payload?.[0]?.value ?? 0} view${payload?.[0]?.value === 1 ? "" : "s"}`}
                            accent={color}
                        />
                    )}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke={color}
                    strokeWidth={2.5}
                    fill="url(#trendFill)"
                    dot={{ r: 3, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: color, stroke: colors.neutral0, strokeWidth: 2 }}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

interface DeviceDonutChartProps {
    breakdown: Record<string, number>;
    height?: number;
}

const DEVICE_LABEL: Record<string, string> = { DESKTOP: "Desktop", MOBILE: "Mobile", TABLET: "Tablet" };

export const DeviceDonutChart: React.FC<DeviceDonutChartProps> = ({ breakdown, height = 180 }) => {
    const colors = useColors();
    const { isDark } = useTheme();
    const hues = isDark ? DEVICE_HUES_DARK : DEVICE_HUES_LIGHT;

    const slices = useMemo(() => {
        return Object.entries(breakdown)
            .filter(([, count]) => count > 0)
            .map(([key, count]) => ({
                key,
                name: DEVICE_LABEL[key] ?? key,
                value: count,
                color: hues[key] ?? colors.neutral400,
            }));
    }, [breakdown, hues, colors.neutral400]);

    const total = slices.reduce((sum, s) => sum + s.value, 0);
    if (!slices.length) return null;

    return (
        <div className="relative">
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={slices}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="90%"
                        paddingAngle={2}
                        stroke={colors.neutral0}
                        strokeWidth={2}
                        isAnimationActive
                        animationDuration={800}
                    >
                        {slices.map((s) => <Cell key={s.key} fill={s.color} />)}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            const p = payload?.[0];
                            if (!active || !p) return null;
                            const pct = Math.round((Number(p.value) / total) * 100);
                            return (
                                <TooltipBox active={active} label={String(p.name)} value={`${p.value} · ${pct}%`} accent={p.payload?.color} />
                            );
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ color: colors.neutral600, fontSize: 11, fontWeight: 600 }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div
                className="absolute flex flex-col items-center justify-center pointer-events-none"
                style={{ top: 0, left: 0, right: 0, height: height - 28 }}
            >
                <span className="font-black tabular-nums" style={{ fontSize: 22, color: colors.neutral900, letterSpacing: "-0.03em" }}>
                    {total.toLocaleString()}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
                    Sessions
                </span>
            </div>
        </div>
    );
};
