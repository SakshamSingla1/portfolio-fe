import React, { useId } from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useCountUp } from "../../../hooks/useCountUp";
import type { IViewStats, IDailyView, IPortfolioView } from "../../../services/useDashboardService";
import { FiArrowUpRight, FiArrowDownRight, FiDownload, FiUsers, FiEye, FiMonitor, FiSmartphone, FiTablet, FiChevronDown, FiChevronUp, FiClock, FiLink, FiGlobe } from "react-icons/fi";

interface ViewAnalyticsProps {
  viewStats: IViewStats | null | undefined;
}

const EMPTY_VIEW_STATS: IViewStats = {
  totalViews: 0,
  viewsToday: 0,
  viewsThisWeek: 0,
  viewsThisMonth: 0,
  uniqueVisitors: 0,
  resumeDownloads: 0,
  weeklyTrend: [],
  deviceBreakdown: {},
  browserBreakdown: {},
  locationBreakdown: {},
  recentViews: [],
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const countryFlag = (cc?: string): string => {
  if (!cc || cc.length !== 2) return "🌐";
  return cc.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
};

// Timestamp comes from backend as "2026-06-25T07:00:00Z" (UTC).
// new Date() parses the Z suffix and converts to local time automatically.
const relTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 60)  return "just now";
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (d === 1) return "yesterday";
  if (d < 30)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const exactTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    "  " + d.toLocaleDateString([], { month: "short", day: "numeric" });
};

/* ─── Sparkline ─────────────────────────────────────────────────── */
const Sparkline: React.FC<{ data: IDailyView[]; color: string; height?: number }> = ({
  data, color, height = 56,
}) => {
  const gradId = useId();
  const W = 320;
  const counts = data.map((d) => d.count);
  const max = Math.max(...counts, 1);
  const toY = (v: number) => height - 6 - ((v / max) * (height - 14));

  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * W,
    y: toY(d.count),
  }));

  let linePath = "";
  let fillPath = "";

  if (pts.length > 1) {
    linePath = pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const cx = ((prev.x + p.x) / 2).toFixed(1);
      return `${acc} C ${cx} ${prev.y.toFixed(1)}, ${cx} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }, "");
    fillPath = `${linePath} L ${W} ${height} L 0 ${height} Z`;
  }

  const peakIdx = counts.indexOf(max);
  const peak = pts[peakIdx];

  return (
    <div className="w-full relative">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {fillPath && <path d={fillPath} fill={`url(#${gradId})`} />}
        {linePath && (
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        )}
        {peak && (
          <motion.circle
            cx={peak.x}
            cy={peak.y}
            r={4}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 400 }}
          />
        )}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        {data.map((d, i) => (
          <span
            key={i}
            className="text-[9px] font-medium"
            style={{ color: "#94a3b8", letterSpacing: "0.03em", textAlign: "center", flex: 1 }}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Live pulse dot ────────────────────────────────────────────── */
const LivePulse: React.FC<{ active?: boolean }> = ({ active = true }) => (
  <span className="relative inline-flex h-2.5 w-2.5">
    {active && (
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ background: "#10b981" }}
      />
    )}
    <span
      className="relative inline-flex rounded-full h-2.5 w-2.5"
      style={{ background: active ? "#10b981" : "#94a3b8" }}
    />
  </span>
);

/* ─── Trend chip ────────────────────────────────────────────────── */
const TrendChip: React.FC<{ value: number | null }> = ({ value }) => {
  if (value === null || value === undefined) return null;
  const up = value >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{
        background: up ? "#dcfce7" : "#fee2e2",
        color: up ? "#15803d" : "#b91c1c",
      }}
    >
      {up ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
      {Math.abs(value)}%
    </span>
  );
};

/* ─── Big metric cell ───────────────────────────────────────────── */
const MetricCell: React.FC<{
  label: string;
  value: number;
  delay?: number;
  accent?: string;
  trend?: number | null;
  hero?: boolean;
}> = ({ label, value, delay = 0, accent, trend, hero }) => {
  const colors = useColors();
  const animated = useCountUp(value, delay);

  return (
    <div className={`flex flex-col ${hero ? "gap-1" : "gap-0.5"}`}>
      <div className="flex items-start gap-2">
        <span
          className="font-black tabular-nums leading-none"
          style={{
            fontSize: hero ? "clamp(28px, 4vw, 42px)" : "clamp(18px, 2.5vw, 26px)",
            color: accent ?? colors.neutral900,
            letterSpacing: "-0.04em",
          }}
        >
          {animated.toLocaleString()}
        </span>
        {trend !== undefined && <TrendChip value={trend ?? null} />}
      </div>
      <span
        className="font-black uppercase"
        style={{ fontSize: 9, letterSpacing: "0.1em", color: colors.neutral400 }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Generic horizontal bar breakdown ─────────────────────────── */
const BreakdownBars: React.FC<{
  items: { key: string; label: string; color: string; icon?: React.ReactNode }[];
  breakdown: Record<string, number>;
}> = ({ items, breakdown }) => {
  const colors = useColors();
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-2.5">
      {items.map(({ key, label, color, icon }) => {
        const count = breakdown[key] ?? 0;
        const pct = Math.round((count / total) * 100);
        return (
          <div key={key} className="flex items-center gap-2">
            {icon
              ? <span style={{ color, flexShrink: 0, fontSize: 11 }}>{icon}</span>
              : <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            }
            <span className="text-[10px] font-semibold w-14 truncate" style={{ color: colors.neutral500 }}>
              {label}
            </span>
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: 5, background: colors.neutral100 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <span
              className="text-[10px] font-bold tabular-nums w-7 text-right"
              style={{ color: colors.neutral600 }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Device breakdown ──────────────────────────────────────────── */
const DeviceBreakdown: React.FC<{ breakdown: Record<string, number> }> = ({ breakdown }) => (
  <BreakdownBars
    breakdown={breakdown}
    items={[
      { key: "DESKTOP", label: "Desktop", color: "#3b82f6", icon: <FiMonitor size={11} /> },
      { key: "MOBILE",  label: "Mobile",  color: "#8b5cf6", icon: <FiSmartphone size={11} /> },
      { key: "TABLET",  label: "Tablet",  color: "#f59e0b", icon: <FiTablet size={11} /> },
    ]}
  />
);

/* ─── Browser breakdown ─────────────────────────────────────────── */
const BROWSER_COLORS: Record<string, string> = {
  Chrome:  "#4285f4",
  Firefox: "#ff6611",
  Safari:  "#0070c9",
  Edge:    "#0078d7",
  Opera:   "#ff1b2d",
  Other:   "#94a3b8",
};

const BrowserBreakdown: React.FC<{ breakdown: Record<string, number> }> = ({ breakdown }) => {
  const sorted = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  if (!sorted.length) return null;

  return (
    <BreakdownBars
      breakdown={breakdown}
      items={sorted.map(([key]) => ({
        key,
        label: key,
        color: BROWSER_COLORS[key] ?? BROWSER_COLORS.Other,
      }))}
    />
  );
};

/* ─── Location breakdown (top countries) ───────────────────────── */
const LocationBreakdown: React.FC<{ breakdown: Record<string, number> }> = ({ breakdown }) => {
  const colors = useColors();
  const sorted = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (!sorted.length) return null;

  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;
  const PALETTE = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map(([country, count], i) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={country} className="flex items-center gap-2">
            <span className="text-sm shrink-0" style={{ lineHeight: 1 }}>
              {countryFlag(undefined)}
            </span>
            <span className="text-[10px] font-semibold flex-1 truncate" style={{ color: colors.neutral500 }}>
              {country}
            </span>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: 5, width: 60, background: colors.neutral100 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: PALETTE[i] }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 + i * 0.05 }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums w-7 text-right" style={{ color: colors.neutral600 }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Traffic Sources ───────────────────────────────────────────── */
const SOURCE_COLORS: Record<string, string> = {
  direct:    "#94a3b8",
  google:    "#4285f4",
  linkedin:  "#0a66c2",
  github:    "#24292e",
  twitter:   "#1d9bf0",
  facebook:  "#1877f2",
  instagram: "#e1306c",
  youtube:   "#ff0000",
  reddit:    "#ff4500",
  bing:      "#00809d",
};

const getSourceColor = (src: string): string => {
  if (src === "Direct") return SOURCE_COLORS.direct;
  const lower = src.toLowerCase();
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "#8b5cf6";
};

const TrafficSources: React.FC<{ views: IPortfolioView[] }> = ({ views }) => {
  const colors = useColors();
  if (!views?.length) return null;

  const counts: Record<string, number> = {};
  views.forEach((v) => {
    const src = v.referrer && v.referrer !== "Direct" ? v.referrer : "Direct";
    counts[src] = (counts[src] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map(([src, count]) => {
        const pct = Math.round((count / total) * 100);
        const color = getSourceColor(src);
        return (
          <div key={src} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[10px] font-semibold w-16 truncate" style={{ color: colors.neutral500 }}>
              {src}
            </span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: colors.neutral100 }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums w-7 text-right" style={{ color: colors.neutral600 }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Peak Visit Hours ───────────────────────────────────────────── */
const PeakHours: React.FC<{ views: IPortfolioView[] }> = ({ views }) => {
  const colors = useColors();
  const ACCENT = colors.primary600;

  const hours = new Array(24).fill(0) as number[];
  views?.forEach((v) => {
    if (v.timestamp) {
      const h = new Date(v.timestamp).getHours();
      if (h >= 0 && h < 24) hours[h]++;
    }
  });

  const max = Math.max(...hours, 1);
  const peakHour = hours.indexOf(Math.max(...hours));

  const fmt = (h: number): string => {
    if (h === 0) return "12AM";
    if (h === 12) return "12PM";
    return h < 12 ? `${h}AM` : `${h - 12}PM`;
  };

  return (
    <div>
      <div className="flex items-end gap-[1.5px]" style={{ height: 36 }}>
        {hours.map((count, h) => {
          const hp = (count / max) * 100;
          const isPeak = h === peakHour && count > 0;
          return (
            <motion.div
              key={h}
              className="flex-1 rounded-[1px]"
              style={{
                height: `${Math.max(hp, 4)}%`,
                background: isPeak ? ACCENT : count > 0 ? `${ACCENT}55` : colors.neutral100,
                transformOrigin: "bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.35, delay: h * 0.012, ease: "easeOut" }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {["12AM", "6AM", "12PM", "6PM"].map((lbl) => (
          <span key={lbl} className="text-[8px]" style={{ color: colors.neutral400 }}>
            {lbl}
          </span>
        ))}
      </div>
      {max > 1 && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
          <span className="text-[10px]" style={{ color: colors.neutral500 }}>
            Peak at <strong style={{ color: colors.neutral700 }}>{fmt(peakHour)}</strong>
            {" · "}{hours[peakHour]} visit{hours[peakHour] !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── View History ──────────────────────────────────────────────── */
const DEVICE_ICON: Record<string, React.ReactNode> = {
  DESKTOP: <FiMonitor size={12} />,
  MOBILE:  <FiSmartphone size={12} />,
  TABLET:  <FiTablet size={12} />,
};
const DEVICE_COLOR: Record<string, string> = {
  DESKTOP: "#3b82f6",
  MOBILE:  "#8b5cf6",
  TABLET:  "#f59e0b",
};

const ViewHistorySection: React.FC<{ views: IPortfolioView[] }> = ({ views }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  if (!views?.length) return null;

  const shown = expanded ? views : views.slice(0, 8);

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{ border: `1.5px solid ${colors.neutral300}` }}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{
          background: isDark ? colors.neutral100 : colors.neutral50,
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <div className="flex items-center gap-2">
          <FiClock size={11} style={{ color: colors.neutral400 }} />
          <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: colors.neutral500 }}>
            Visitor History
          </span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: colors.neutral200, color: colors.neutral600 }}
          >
            {views.length}
          </span>
        </div>
        {expanded
          ? <FiChevronUp size={13} style={{ color: colors.neutral400 }} />
          : <FiChevronDown size={13} style={{ color: colors.neutral400 }} />}
      </button>

      {expanded && (
        <div className="overflow-y-auto" style={{ maxHeight: 360, background: colors.neutral0 }}>
          {shown.map((v, i) => {
            const devColor = DEVICE_COLOR[v.device] ?? "#94a3b8";
            const devIcon  = DEVICE_ICON[v.device] ?? <FiMonitor size={12} />;
            const flag     = countryFlag(v.countryCode);
            const location = v.city && v.country
              ? `${v.city}, ${v.country}`
              : v.country ?? null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? `1px solid ${colors.neutral100}` : "none" }}
              >
                {/* Device icon */}
                <div
                  className="shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ width: 28, height: 28, background: `${devColor}14`, color: devColor }}
                >
                  {devIcon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  {/* Row 1: device + browser/OS */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold" style={{ color: colors.neutral700 }}>
                      {v.device.charAt(0) + v.device.slice(1).toLowerCase()}
                    </span>
                    {v.browser && (
                      <>
                        <span style={{ color: colors.neutral300, fontSize: 10 }}>·</span>
                        <span className="text-[10px]" style={{ color: colors.neutral500 }}>{v.browser}</span>
                      </>
                    )}
                    {v.os && (
                      <>
                        <span style={{ color: colors.neutral300, fontSize: 10 }}>·</span>
                        <span className="text-[10px]" style={{ color: colors.neutral500 }}>{v.os}</span>
                      </>
                    )}
                  </div>

                  {/* Row 2: location */}
                  {location && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px]">{flag}</span>
                      <span className="text-[10px]" style={{ color: colors.neutral500 }}>{location}</span>
                      {v.language && (
                        <>
                          <span style={{ color: colors.neutral300, fontSize: 10 }}>·</span>
                          <span className="text-[10px]" style={{ color: colors.neutral400 }}>{v.language}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Row 3: referrer */}
                  {v.referrer && v.referrer !== "Direct" ? (
                    <div className="flex items-center gap-0.5">
                      <FiLink size={9} style={{ color: colors.neutral400 }} />
                      <span className="text-[10px] truncate max-w-[160px]" style={{ color: colors.neutral400 }}>
                        {v.referrer}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px]" style={{ color: colors.neutral400 }}>Direct</span>
                  )}
                </div>

                {/* Right: time + session */}
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <span className="text-[10px] font-medium" style={{ color: colors.neutral500 }}>
                    {relTime(v.timestamp)}
                  </span>
                  <span className="text-[9px]" style={{ color: colors.neutral400 }}>
                    {exactTime(v.timestamp)}
                  </span>
                  {v.sessionId && (
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: colors.neutral100, color: colors.neutral500 }}
                    >
                      {v.sessionId}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {views.length > 8 && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-full py-2.5 text-[11px] font-semibold text-center"
              style={{
                background: colors.neutral50,
                color: colors.neutral500,
                border: "none",
                borderTop: `1px solid ${colors.neutral100}`,
                cursor: "pointer",
              }}
            >
              {expanded ? "Show less" : `Show all ${views.length} visits`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────── */
const ViewAnalyticsTemplate: React.FC<ViewAnalyticsProps> = ({ viewStats: rawStats }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const viewStats = rawStats ?? EMPTY_VIEW_STATS;

  const {
    totalViews,
    viewsToday,
    viewsThisWeek,
    viewsThisMonth,
    uniqueVisitors,
    resumeDownloads,
    weeklyTrend = [],
    deviceBreakdown = {},
    browserBreakdown = {},
    locationBreakdown = {},
    recentViews = [],
  } = viewStats;

  const ACCENT = colors.primary600;

  const cardStyle: React.CSSProperties = {
    background: isDark
      ? `linear-gradient(135deg, ${colors.neutral50} 0%, ${colors.neutral0} 100%)`
      : `linear-gradient(135deg, #fafbff 0%, #ffffff 100%)`,
    border: `1.5px solid ${colors.neutral300}`,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.4)"
      : `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)`,
  };

  const panelStyle: React.CSSProperties = {
    background: isDark ? colors.neutral100 : colors.neutral50,
    border: `1.5px solid ${colors.neutral300}`,
    borderRadius: 12,
    padding: 16,
  };

  const panelLabel = (text: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-1.5 mb-3">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
        {text}
      </span>
    </div>
  );

  const hasBrowserData = Object.keys(browserBreakdown).length > 0;
  const hasLocationData = Object.keys(locationBreakdown).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={cardStyle}
    >
      {/* ── Top accent line ─────────────────────────── */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${colors.primary400})` }} />

      <div className="p-4 sm:p-5">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <LivePulse active={viewsToday > 0} />
            <span className="text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: colors.primary700 }}>
              {viewsToday > 0 ? "Live" : "Analytics"} · Portfolio Views
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-medium" style={{ color: colors.neutral400 }}>
              <FiUsers size={10} /> {uniqueVisitors.toLocaleString()} unique
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: colors.neutral400 }}>
              <FiDownload size={10} /> {resumeDownloads} CV
            </span>
          </div>
        </div>

        {/* ── Main grid ───────────────────────────────── */}
        <div className={`grid gap-4 sm:gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>

          {/* Left: metrics ──────────────────────────── */}
          <div className={isMobile ? "" : "col-span-7"}>
            <div className="flex flex-col gap-4">

              {/* Today hero */}
              <div
                className="rounded-2xl p-4"
                style={{ background: isDark ? `${ACCENT}15` : `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
              >
                <div className="flex items-end justify-between gap-4">
                  <MetricCell label="Views Today" value={viewsToday} delay={0} accent={ACCENT} hero />
                  <div className="flex-1 min-w-0 hidden sm:block">
                    {weeklyTrend.length > 0 && <Sparkline data={weeklyTrend} color={ACCENT} height={52} />}
                  </div>
                </div>
              </div>

              {/* Secondary metrics */}
              <div className="grid gap-3 grid-cols-3">
                {[
                  { label: "This Week",  value: viewsThisWeek,  delay: 80 },
                  { label: "This Month", value: viewsThisMonth, delay: 140 },
                  { label: "All Time",   value: totalViews,     delay: 200 },
                ].map(({ label, value, delay }) => (
                  <div key={label} className="rounded-xl p-3" style={panelStyle}>
                    <MetricCell label={label} value={value} delay={delay} />
                  </div>
                ))}
              </div>

              {/* Mobile sparkline */}
              {isMobile && weeklyTrend.length > 0 && (
                <div className="rounded-xl p-3" style={panelStyle}>
                  <span className="text-[9px] font-black uppercase tracking-widest block mb-2" style={{ color: colors.neutral400 }}>
                    7-Day Trend
                  </span>
                  <Sparkline data={weeklyTrend} color={ACCENT} height={48} />
                </div>
              )}

              {/* Browser + Location row (below metrics on left) */}
              {!isMobile && (hasBrowserData || hasLocationData) && (
                <div className="grid gap-4 grid-cols-2">
                  {hasBrowserData && (
                    <div style={panelStyle}>
                      {panelLabel("Browsers")}
                      <BrowserBreakdown breakdown={browserBreakdown} />
                    </div>
                  )}
                  {hasLocationData && (
                    <div style={panelStyle}>
                      {panelLabel("Top Countries", <FiGlobe size={10} style={{ color: colors.neutral400 }} />)}
                      <LocationBreakdown breakdown={locationBreakdown} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column ───────────────────────────── */}
          <div className={`flex flex-col gap-4 ${isMobile ? "" : "col-span-5"}`}>

            {/* Desktop sparkline */}
            {!isMobile && weeklyTrend.length > 0 && (
              <div className="rounded-xl p-4 flex flex-col" style={{ ...panelStyle, flex: 1 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
                    7-Day Trend
                  </span>
                  <FiEye size={11} style={{ color: colors.neutral400 }} />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <Sparkline data={weeklyTrend} color={ACCENT} height={64} />
                </div>
              </div>
            )}

            {/* Device breakdown */}
            <div style={panelStyle}>
              {panelLabel("Devices")}
              <DeviceBreakdown breakdown={deviceBreakdown} />
            </div>

            {/* Mobile: browser + location stacked */}
            {isMobile && hasBrowserData && (
              <div style={panelStyle}>
                {panelLabel("Browsers")}
                <BrowserBreakdown breakdown={browserBreakdown} />
              </div>
            )}
            {isMobile && hasLocationData && (
              <div style={panelStyle}>
                {panelLabel("Top Countries", <FiGlobe size={10} style={{ color: colors.neutral400 }} />)}
                <LocationBreakdown breakdown={locationBreakdown} />
              </div>
            )}
          </div>
        </div>

        {/* ── Traffic Sources + Peak Hours ────────────── */}
        {recentViews.length > 0 && (
          <div className={`mt-4 grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <div style={panelStyle}>
              {panelLabel("Traffic Sources", <FiLink size={10} style={{ color: colors.neutral400 }} />)}
              <TrafficSources views={recentViews} />
            </div>
            <div style={panelStyle}>
              {panelLabel("Peak Hours", <FiClock size={10} style={{ color: colors.neutral400 }} />)}
              <PeakHours views={recentViews} />
            </div>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────── */}
        <div
          className="flex items-center justify-between mt-4 pt-4"
          style={{ borderTop: `1.5px solid ${colors.neutral300}` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FiUsers size={11} style={{ color: colors.neutral400 }} />
              <span className="text-[11px] font-semibold" style={{ color: colors.neutral600 }}>
                <span className="font-black" style={{ color: colors.neutral800 }}>
                  {uniqueVisitors.toLocaleString()}
                </span>{" "}
                unique visitors
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiDownload size={11} style={{ color: colors.neutral400 }} />
              <span className="text-[11px] font-semibold" style={{ color: colors.neutral600 }}>
                <span className="font-black" style={{ color: colors.neutral800 }}>
                  {resumeDownloads}
                </span>{" "}
                CV downloads
              </span>
            </div>
          </div>
          <span className="text-[10px]" style={{ color: colors.neutral400 }}>
            Updates every 30s
          </span>
        </div>

        {/* ── View History ────────────────────────────── */}
        <ViewHistorySection views={recentViews} />
      </div>
    </motion.div>
  );
};

export default ViewAnalyticsTemplate;
