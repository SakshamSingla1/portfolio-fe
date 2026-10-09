import React, { useState } from "react";
import { FiGlobe, FiLink, FiClock, FiChevronDown, FiChevronUp, FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IAnalyticsOverview, IPortfolioView } from "../../../services/useDashboardService";
import { Panel } from "./shared/AnalyticsSurface";
import { FlatBreakdownBars } from "./FlatCharts";
import { BROWSER_COLORS, BROWSER_ICONS, LOC_PALETTE, getSourceColor, getSourceIcon } from "./shared/breakdownPalette";
import { countryFlag, relTime, exactTime, COUNTRY_TO_CODE } from "../../../utils/analyticsFormat";
import { DEVICE_HUES_LIGHT, DEVICE_HUES_DARK } from "../Dashboard/AnalyticsCharts";

interface VisitorsPanelProps {
  overview: IAnalyticsOverview;
}

const DEVICE_ICON: Record<string, React.ReactNode> = {
  DESKTOP: <FiMonitor size={12} />,
  MOBILE: <FiSmartphone size={12} />,
  TABLET: <FiTablet size={12} />,
};

const PeakHours: React.FC<{ views: IPortfolioView[] }> = ({ views }) => {
  const colors = useColors();
  const accent = colors.primary600;
  const hours = new Array(24).fill(0) as number[];
  views.forEach((v) => {
    if (v.timestamp) {
      const h = new Date(v.timestamp).getHours();
      if (h >= 0 && h < 24) hours[h]++;
    }
  });
  const max = Math.max(...hours, 1);
  const peakHour = hours.indexOf(Math.max(...hours));
  const fmt = (h: number) => (h === 0 ? "12AM" : h === 12 ? "12PM" : h < 12 ? `${h}AM` : `${h - 12}PM`);

  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height: 56 }}>
        {hours.map((count, h) => (
          <div
            key={h}
            className="flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max((count / max) * 100, count > 0 ? 5 : 2)}%`,
              background: count > 0 ? accent : colors.neutral100,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        {["12AM", "6AM", "12PM", "6PM", "11PM"].map((lbl) => (
          <span key={lbl} className="text-[8px] font-medium" style={{ color: colors.neutral400 }}>{lbl}</span>
        ))}
      </div>
      {max > 1 && (
        <div className="mt-2 text-[10px]" style={{ color: colors.neutral500 }}>
          Peak at <strong style={{ color: colors.neutral700 }}>{fmt(peakHour)}</strong> · {hours[peakHour]} visit{hours[peakHour] !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

const VisitorHistory: React.FC<{ views: IPortfolioView[] }> = ({ views }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  if (!views.length) return null;
  const shown = expanded ? views : views.slice(0, 8);

  return (
    <div>
      <div className="flex flex-col">
        {shown.map((v, i) => {
          const devColor = (isDark ? DEVICE_HUES_DARK : DEVICE_HUES_LIGHT)[v.device] ?? colors.neutral400;
          const flag = countryFlag(v.countryCode);
          const location = v.city && v.country ? `${v.city}, ${v.country}` : v.country ?? null;
          return (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5"
              style={{ borderTop: i > 0 ? `1px solid ${colors.neutral100}` : "none" }}
            >
              <div
                className="shrink-0 rounded-lg flex items-center justify-center mt-0.5"
                style={{ width: 26, height: 26, background: `${devColor}14`, color: devColor }}
              >
                {DEVICE_ICON[v.device] ?? <FiMonitor size={12} />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold" style={{ color: colors.neutral700 }}>
                    {v.device.charAt(0) + v.device.slice(1).toLowerCase()}
                  </span>
                  {v.browser && (
                    <span className="text-[10px]" style={{ color: colors.neutral500 }}>· {v.browser}</span>
                  )}
                </div>
                {location && (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px]">{flag}</span>
                    <span className="text-[10px]" style={{ color: colors.neutral500 }}>{location}</span>
                  </div>
                )}
                <span className="text-[10px]" style={{ color: colors.neutral400 }}>
                  {v.referrer && v.referrer !== "Direct" ? v.referrer : "Direct"}
                </span>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-medium" style={{ color: colors.neutral500 }}>{relTime(v.timestamp)}</span>
                <span className="text-[9px]" style={{ color: colors.neutral400 }}>{exactTime(v.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {views.length > 8 && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full mt-2 py-2 text-[11px] font-semibold text-center flex items-center justify-center gap-1"
          style={{ background: colors.neutral50, border: "none", borderRadius: 8, color: colors.neutral500, cursor: "pointer" }}
        >
          {expanded ? (<>Show less <FiChevronUp size={12} /></>) : (<>Show all {views.length} visits <FiChevronDown size={12} /></>)}
        </button>
      )}
    </div>
  );
};

const VisitorsPanel: React.FC<VisitorsPanelProps> = ({ overview }) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const { browserBreakdown, locationBreakdown, referrerBreakdown, recentViews } = overview;

  const hasBrowser = Object.keys(browserBreakdown).length > 0;
  const hasLocation = Object.keys(locationBreakdown).length > 0;
  const hasReferrer = Object.keys(referrerBreakdown).length > 0;

  const browserItems = Object.entries(browserBreakdown)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([key]) => ({ key, label: key, color: BROWSER_COLORS[key] ?? BROWSER_COLORS.Other, icon: BROWSER_ICONS[key] }));

  const locationItems = Object.entries(locationBreakdown)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([key], i) => {
      const cc = COUNTRY_TO_CODE[key];
      return { key, label: key, color: LOC_PALETTE[i % LOC_PALETTE.length], icon: <span>{cc ? countryFlag(cc) : "🌐"}</span> };
    });

  const referrerItems = Object.entries(referrerBreakdown)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([key]) => ({ key, label: key, color: getSourceColor(key), icon: getSourceIcon(key) ?? undefined }));

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        {hasBrowser && (
          <Panel title="Browsers">
            <FlatBreakdownBars items={browserItems} breakdown={browserBreakdown} />
          </Panel>
        )}
        {hasLocation && (
          <Panel title="Top countries" icon={<FiGlobe size={11} />}>
            <FlatBreakdownBars items={locationItems} breakdown={locationBreakdown} />
          </Panel>
        )}
      </div>

      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        {hasReferrer && (
          <Panel title="Traffic sources" icon={<FiLink size={11} />}>
            <FlatBreakdownBars items={referrerItems} breakdown={referrerBreakdown} />
          </Panel>
        )}
        <Panel title="Peak hours" icon={<FiClock size={11} />}>
          <PeakHours views={recentViews} />
        </Panel>
      </div>

      <Panel
        title="Visitor history"
        right={
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: colors.neutral100, color: colors.neutral600 }}
          >
            {recentViews.length}
          </span>
        }
      >
        <VisitorHistory views={recentViews} />
      </Panel>
    </div>
  );
};

export default VisitorsPanel;
