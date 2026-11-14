import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useCountUp } from "../../../hooks/useCountUp";
import type { IViewStats } from "../../../services/useDashboardService";
import { FiArrowUpRight, FiArrowDownRight, FiArrowRight, FiDownload, FiUsers, FiEye, FiMonitor, FiSmartphone, FiTablet, FiClock, FiBarChart2, FiCalendar } from "react-icons/fi";
import { EmptyState, ShimmerTopline } from "./shared/DashboardUI";
import { useGlassSurface } from "./shared/dashboardMotion";
import { TrendAreaChart, DeviceDonutChart } from "./AnalyticsCharts";
import { DEVICE_HUES_LIGHT, DEVICE_HUES_DARK, DEVICE_LABEL } from "./deviceColors";

interface ViewAnalyticsProps {
  viewStats: IViewStats | null | undefined;
}

const EMPTY_VIEW_STATS: IViewStats = {
  totalViews: 0,
  viewsToday: 0,
  viewsThisWeek: 0,
  viewsLastWeek: 0,
  viewsThisMonth: 0,
  uniqueVisitors: 0,
  resumeDownloads: 0,
  weeklyTrend: [],
  deviceBreakdown: {},
  browserBreakdown: {},
  locationBreakdown: {},
  referrerBreakdown: {},
  recentViews: [],
};


/** Bare-bones inline sparkline (no axes/grid) for filling the wide, otherwise-empty
 * "Views Today" hero slot with the same 7-day trend data shown in full elsewhere —
 * a tiny recap rather than dead space next to the headline number. */
const MiniSparkline: React.FC<{ data: { count: number }[]; color: string }> = ({ data, color }) => {
  if (data.length < 2) return null;
  const width = 120;
  const height = 40;
  const pad = 2;

  const max = Math.max(...data.map((d) => d.count), 1);
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (width - pad * 2),
    y: height - pad - (d.count / max) * (height - pad * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height - pad} L ${points[0].x.toFixed(2)} ${height - pad} Z`;
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="mini-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#mini-spark-fill)" stroke="none" />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <circle cx={last.x} cy={last.y} r={3} fill={color} />
    </svg>
  );
};

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


const MetricCell: React.FC<{
  label: string;
  value: number;
  delay?: number;
  accent?: string;
  trend?: number | null;
  hero?: boolean;
  icon?: React.ReactNode;
}> = ({ label, value, delay = 0, accent, trend, hero, icon }) => {
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
        className="flex items-center gap-1 font-black uppercase"
        style={{ fontSize: 9, letterSpacing: "0.1em", color: colors.neutral400 }}
      >
        {icon && <span style={{ display: "inline-flex", fontSize: 10 }}>{icon}</span>}
        {label}
      </span>
    </div>
  );
};


const DEVICE_ICON: Record<string, React.ReactNode> = {
  DESKTOP: <FiMonitor size={12} />,
  MOBILE:  <FiSmartphone size={12} />,
  TABLET:  <FiTablet size={12} />,
};
// Single source of truth for device colors (also used by the Devices donut
// chart) so the same device always reads as the same color everywhere on
// this card — previously this list had its own arbitrary blue/purple/amber
// trio that didn't match the donut's colorblind-validated hues.
const deviceColorFor = (device: string, isDark: boolean): string =>
  (isDark ? DEVICE_HUES_DARK : DEVICE_HUES_LIGHT)[device] ?? "#94a3b8";

const DeviceBreakdownList: React.FC<{ breakdown: Record<string, number>; activeKey: string | null; onHover: (key: string | null) => void }> = ({
  breakdown, activeKey, onHover,
}) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const sorted = Object.entries(breakdown).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return null;

  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;
  const [topKey, topCount] = sorted[0];
  const topPct = Math.round((topCount / total) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {sorted.map(([key, count]) => {
          const pct = Math.round((count / total) * 100);
          const color = deviceColorFor(key, isDark);
          const dimmed = activeKey !== null && activeKey !== key;
          return (
            <div
              key={key}
              onMouseEnter={() => onHover(key)}
              onMouseLeave={() => onHover(null)}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 -mx-1.5 transition-opacity duration-150"
              style={{ opacity: dimmed ? 0.45 : 1, cursor: "default" }}
            >
              <span
                className="shrink-0 rounded-md flex items-center justify-center"
                style={{ width: 20, height: 20, background: `${color}18`, color }}
              >
                {DEVICE_ICON[key] ?? <FiMonitor size={12} />}
              </span>
              <span className="text-[11px] font-semibold flex-1" style={{ color: colors.neutral600 }}>
                {DEVICE_LABEL[key] ?? key}
              </span>
              <span className="text-[11px] font-black tabular-nums" style={{ color }}>
                {pct}%
              </span>
              <span className="text-[9px] w-8 text-right" style={{ color: colors.neutral400 }}>
                ({count})
              </span>
            </div>
          );
        })}
      </div>
      {sorted.length > 1 && (
        <div className="text-[10px] pt-1" style={{ color: colors.neutral500, borderTop: `1px solid ${colors.neutral100}` }}>
          <strong style={{ color: colors.neutral700 }}>{DEVICE_LABEL[topKey] ?? topKey}</strong> leads with {topPct}% of sessions
        </div>
      )}
    </div>
  );
};



const ViewAnalyticsTemplate: React.FC<ViewAnalyticsProps> = ({ viewStats: rawStats }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const viewStats = rawStats ?? EMPTY_VIEW_STATS;

  const {
    totalViews,
    viewsToday,
    viewsThisWeek,
    viewsLastWeek = 0,
    viewsThisMonth,
    uniqueVisitors,
    resumeDownloads,
    weeklyTrend = [],
    deviceBreakdown = {},
    recentViews = [],
  } = viewStats;

  
  const wowDelta: number | null =
    viewsLastWeek > 0
      ? Math.round(((viewsThisWeek - viewsLastWeek) / viewsLastWeek) * 100)
      : viewsThisWeek > 0
      ? null  
      : null;

  const ACCENT = colors.primary600;
  const glass = useGlassSurface(ACCENT);

  const cardStyle: React.CSSProperties = {
    ...glass,
    borderRadius: 20,
    overflow: "hidden",
  };

  // A plain nested panel (no blur/translucency): the outer card is already an
  // opaque, calm surface, so a "glass" inner panel had nothing colorful behind
  // it to blur -- it just looked like a slightly different flat panel anyway.
  const panelStyle: React.CSSProperties = {
    background: colors.neutral50,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: 12,
    padding: 20,
  };

  const panelLabel = (text: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-1.5 mb-3">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
        {text}
      </span>
    </div>
  );

  const hasDeviceData = Object.values(deviceBreakdown).some((c) => c > 0);

  const [activeDeviceKey, setActiveDeviceKey] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const hasAnyData = totalViews > 0 || recentViews.length > 0;

  if (!hasAnyData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={cardStyle}
      >
        <ShimmerTopline color={ACCENT} color2={colors.primary400} />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <LivePulse active={false} />
            <span className="text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: colors.primary700 }}>
              Analytics · Portfolio Views
            </span>
          </div>
          <EmptyState
            icon={<FiBarChart2 size={20} />}
            title="No traffic yet"
            subtitle="Once people start viewing your portfolio, visits, devices, and traffic sources will show up here."
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={cardStyle}
    >
      {}
      <ShimmerTopline color={ACCENT} color2={colors.primary400} />

      <div className="p-5 sm:p-6">

        {}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
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
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-1 text-[10px] font-bold"
              style={{ color: ACCENT, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              Full analytics <FiArrowRight size={10} />
            </button>
          </div>
        </div>

        {}
        <div className={`grid gap-5 sm:gap-6 ${isMobile || !hasDeviceData ? "grid-cols-1" : "grid-cols-12"}`}>

          {}
          <div className={isMobile || !hasDeviceData ? "" : "col-span-7"}>
            <div className="flex flex-col gap-5">

              {}
              <div
                className="rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ background: isDark ? `${ACCENT}15` : `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
              >
                <MetricCell label="Views Today" value={viewsToday} delay={0} accent={ACCENT} hero />
                {!isMobile && weeklyTrend.length > 1 && (
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <MiniSparkline data={weeklyTrend} color={ACCENT} />
                    <span className="text-[8.5px] font-bold uppercase tracking-wider" style={{ color: colors.neutral400 }}>
                      7-day trend
                    </span>
                  </div>
                )}
              </div>

              {}
              <div className="grid gap-4 grid-cols-3">
                {}
                <div className="rounded-xl p-3" style={panelStyle}>
                  <div className="flex items-start justify-between gap-1">
                    <MetricCell label="This Week" value={viewsThisWeek} delay={80} icon={<FiCalendar />} />
                    {wowDelta !== null && <TrendChip value={wowDelta} />}
                  </div>
                </div>
                {[
                  { label: "This Month", value: viewsThisMonth, delay: 140, icon: <FiClock /> },
                  { label: "All Time",   value: totalViews,     delay: 200, icon: <FiBarChart2 /> },
                ].map(({ label, value, delay, icon }) => (
                  <div key={label} className="rounded-xl p-3" style={panelStyle}>
                    <MetricCell label={label} value={value} delay={delay} icon={icon} />
                  </div>
                ))}
              </div>

              {}
              {weeklyTrend.length > 0 && (
                <div className="rounded-xl p-4" style={panelStyle}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
                      7-Day Trend
                    </span>
                    <FiEye size={11} style={{ color: colors.neutral400 }} />
                  </div>
                  <TrendAreaChart data={weeklyTrend} color={ACCENT} height={isMobile ? 140 : 180} />
                </div>
              )}
            </div>
          </div>

          {}
          {hasDeviceData && (
            <div className={isMobile ? "" : "col-span-5"}>
              <div style={panelStyle}>
                {panelLabel("Devices")}
                <div className="flex flex-col gap-3">
                  <DeviceDonutChart breakdown={deviceBreakdown} activeKey={activeDeviceKey} onSliceHover={setActiveDeviceKey} />
                  <DeviceBreakdownList breakdown={deviceBreakdown} activeKey={activeDeviceKey} onHover={setActiveDeviceKey} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ViewAnalyticsTemplate;
