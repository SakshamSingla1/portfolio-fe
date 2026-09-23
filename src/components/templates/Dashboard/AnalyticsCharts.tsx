import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { glowTextShadow } from "./shared/DashboardUI";
import type { IDailyView } from "../../../services/useDashboardService";

// Device-mix hues below are picked from the design system's validated
// categorical order (see dataviz skill palette.md, slots 1/2/3) — the
// previous ad-hoc blue/purple/amber trio failed the colorblind-separation
// check (deutan ΔE 1.3, normal-vision ΔE 12 — below the 15 floor).
export const DEVICE_HUES_LIGHT: Record<string, string> = {
    DESKTOP: "#2a78d6",
    MOBILE: "#eb6834",
    TABLET: "#1baf7a",
};
export const DEVICE_HUES_DARK: Record<string, string> = {
    DESKTOP: "#3987e5",
    MOBILE: "#d95926",
    TABLET: "#199e70",
};
export const DEVICE_LABEL: Record<string, string> = { DESKTOP: "Desktop", MOBILE: "Mobile", TABLET: "Tablet" };

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
    /** Synced with an external breakdown list so hovering a row (or the chart
     * itself) highlights the same device in both places. */
    activeKey?: string | null;
    onSliceHover?: (key: string | null) => void;
}

/** A segmented, glowing radial gauge — one arc band per device, rounded caps,
 * a soft SVG glow filter per segment, and a faint full-circle track behind
 * them (the "dial" a gauge reads against). Built from plain SVG circles with
 * stroke-dasharray/rotate (the same ring technique as MiniRing/ProfileCompletion's
 * gauge elsewhere in this file's siblings) rather than a recharts Pie, so the
 * glow filters and gap/cap styling are fully under our control. */
export const DeviceDonutChart: React.FC<DeviceDonutChartProps> = ({ breakdown, height = 170, activeKey, onSliceHover }) => {
    const colors = useColors();
    const { isDark } = useTheme();
    const hues = isDark ? DEVICE_HUES_DARK : DEVICE_HUES_LIGHT;
    const uid = useId();
    const [hovered, setHovered] = React.useState<string | null>(null);

    const slices = useMemo(() => {
        return Object.entries(breakdown)
            .filter(([, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => ({
                key,
                name: DEVICE_LABEL[key] ?? key,
                value: count,
                color: hues[key] ?? colors.neutral400,
            }));
    }, [breakdown, hues, colors.neutral400]);

    const total = slices.reduce((sum, s) => sum + s.value, 0);

    const SIZE = 200;
    const CENTER = SIZE / 2;
    const R = 76;
    const STROKE = 26;
    const CIRC = 2 * Math.PI * R;
    const GAP_DEG = slices.length > 1 ? 7 : 0;

    const segments = useMemo(() => {
        let cursor = 0;
        return slices.map((s) => {
            const pct = total > 0 ? s.value / total : 0;
            const rawDeg = pct * 360;
            const arcDeg = Math.max(rawDeg - GAP_DEG, rawDeg > 0 ? 3 : 0);
            const arcLen = (arcDeg / 360) * CIRC;
            const startDeg = cursor;
            cursor += rawDeg;
            return { ...s, pct, startDeg, arcLen };
        });
    }, [slices, total, GAP_DEG, CIRC]);

    if (!slices.length) return null;
    const effectiveActive = activeKey ?? hovered;
    const activeSeg = segments.find((s) => s.key === effectiveActive);

    return (
        <div className="relative" style={{ width: "100%", maxWidth: height, margin: "0 auto" }}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height={height} style={{ overflow: "visible" }}>
                <defs>
                    {segments.map((s) => (
                        <filter key={s.key} id={`${uid}-glow-${s.key}`} x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation={effectiveActive === s.key ? 9 : 4.6} result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    ))}
                </defs>

                {/* Base dial track */}
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={R}
                    fill="none"
                    stroke={isDark ? colors.neutral200 : colors.neutral200}
                    strokeWidth={STROKE}
                    opacity={isDark ? 0.35 : 0.5}
                />

                {/* Quarter tick marks for the gauge-dial feel */}
                {[0, 90, 180, 270].map((deg) => (
                    <line
                        key={deg}
                        x1={CENTER}
                        y1={CENTER - R - STROKE / 2 - 3}
                        x2={CENTER}
                        y2={CENTER - R - STROKE / 2 + 4}
                        stroke={colors.neutral300}
                        strokeWidth={2}
                        strokeLinecap="round"
                        transform={`rotate(${deg - 90} ${CENTER} ${CENTER})`}
                        opacity={0.6}
                    />
                ))}

                {segments.map((s, i) => {
                    const dimmed = effectiveActive !== null && effectiveActive !== s.key;
                    const active = effectiveActive === s.key;
                    return (
                        <motion.circle
                            key={s.key}
                            cx={CENTER}
                            cy={CENTER}
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeLinecap="round"
                            strokeDasharray={`${s.arcLen} ${CIRC}`}
                            transform={`rotate(${s.startDeg - 90} ${CENTER} ${CENTER})`}
                            filter={`url(#${uid}-glow-${s.key})`}
                            style={{
                                cursor: onSliceHover ? "pointer" : "default",
                                opacity: dimmed ? 0.32 : 1,
                                transition: "opacity 0.2s",
                            }}
                            initial={{ strokeDashoffset: s.arcLen, strokeWidth: STROKE }}
                            animate={{
                                strokeDashoffset: 0,
                                strokeWidth: active ? STROKE + 6 : dimmed ? STROKE : [STROKE, STROKE + 3, STROKE],
                            }}
                            transition={{
                                strokeDashoffset: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
                                strokeWidth: (active || dimmed)
                                    ? { duration: 0.25 }
                                    : { duration: 3.2 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
                            }}
                            onMouseEnter={() => { setHovered(s.key); onSliceHover?.(s.key); }}
                            onMouseLeave={() => { setHovered(null); onSliceHover?.(null); }}
                        />
                    );
                })}
            </svg>

            <div
                className="absolute flex flex-col items-center justify-center pointer-events-none"
                style={{ inset: 0 }}
            >
                {activeSeg ? (
                    <>
                        <span
                            className="font-black tabular-nums"
                            style={{ fontSize: 26, color: activeSeg.color, letterSpacing: "-0.03em", textShadow: glowTextShadow(activeSeg.color, isDark) }}
                        >
                            {Math.round(activeSeg.pct * 100)}%
                        </span>
                        <span className="text-[9.5px] font-black uppercase tracking-widest" style={{ color: colors.neutral500 }}>
                            {activeSeg.name}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-black tabular-nums" style={{ fontSize: 24, color: colors.neutral900, letterSpacing: "-0.03em" }}>
                            {total.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
                            Sessions
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};
