import React from "react";
import { motion } from "framer-motion";
import { FiEye, FiUsers, FiDownload, FiBarChart2, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IAnalyticsOverview, IMetricComparison } from "../../../services/useDashboardService";
import { Panel, MetricTile } from "./shared/AnalyticsSurface";
import { FlatTrendChart, FlatDeviceBreakdown } from "./FlatCharts";
import { DeviceDonutChart } from "../Dashboard/AnalyticsCharts";
import { EmptyState } from "../Dashboard/shared/DashboardUI";

interface OverviewPanelProps {
  overview: IAnalyticsOverview;
}

// Turns the three comparison numbers into one plain-language takeaway instead
// of leaving the reader to mentally combine three separate delta chips.
const buildInsight = (
  comparison: { views: IMetricComparison; uniqueVisitors: IMetricComparison; resumeDownloads: IMetricComparison },
  rangeLabel: string
): { text: string; tone: "up" | "down" | "flat" | "none" } => {
  const { views, uniqueVisitors, resumeDownloads } = comparison;
  if (views.percentChange === null) {
    return { text: `No prior period to compare against yet for ${rangeLabel.toLowerCase()}.`, tone: "none" };
  }
  const deltas = [views.percentChange, uniqueVisitors.percentChange, resumeDownloads.percentChange].filter(
    (d): d is number => d !== null
  );
  const allUp = deltas.every((d) => d > 0);
  const allDown = deltas.every((d) => d < 0);

  if (allUp) {
    return { text: `Every metric improved vs. the prior period — views led at +${views.percentChange}%.`, tone: "up" };
  }
  if (allDown) {
    return { text: `Views, visitors, and downloads all dipped vs. the prior period.`, tone: "down" };
  }
  const sign = views.percentChange >= 0 ? "up" : "down";
  return { text: `Views are ${sign} ${Math.abs(views.percentChange)}% vs. the prior period, a mixed picture across metrics.`, tone: "flat" };
};

const WAVE_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const WAVE_ITEM = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const OverviewPanel: React.FC<OverviewPanelProps> = ({ overview }) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const { comparison, trend, deviceBreakdown, range } = overview;
  const hasDeviceData = Object.values(deviceBreakdown).some((c) => c > 0);
  const insight = buildInsight(comparison, range.label);
  const insightColor = insight.tone === "up" ? colors.success600 : insight.tone === "down" ? colors.error600 : colors.neutral500;
  const InsightIcon = insight.tone === "up" ? FiTrendingUp : insight.tone === "down" ? FiTrendingDown : FiMinus;

  return (
    <motion.div className="flex flex-col gap-4" variants={WAVE_CONTAINER} initial="hidden" animate="visible">
      <motion.div variants={WAVE_ITEM}>
        <Panel noPadding accent={colors.primary600}>
          <div className={`grid gap-6 p-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            <MetricTile
              label="Views"
              icon={<FiEye size={16} />}
              accent={colors.primary600}
              current={comparison.views.current}
              percentChange={comparison.views.percentChange}
            />
            <MetricTile
              label="Unique Visitors"
              icon={<FiUsers size={16} />}
              accent="#8b5cf6"
              current={comparison.uniqueVisitors.current}
              percentChange={comparison.uniqueVisitors.percentChange}
            />
            <MetricTile
              label="CV Downloads"
              icon={<FiDownload size={16} />}
              accent="#10b981"
              current={comparison.resumeDownloads.current}
              percentChange={comparison.resumeDownloads.percentChange}
            />
          </div>
          <div
            className="flex items-center gap-1.5 px-4 py-2.5"
            style={{ borderTop: `1px solid ${colors.neutral100}` }}
          >
            <InsightIcon size={11} style={{ color: insightColor, flexShrink: 0 }} />
            <span className="text-[11px] font-medium" style={{ color: colors.neutral500 }}>
              {insight.text}
            </span>
          </div>
        </Panel>
      </motion.div>

      <motion.div variants={WAVE_ITEM} className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
        <div className={isMobile ? "" : "col-span-8"}>
          <Panel
            title="Views trend"
            right={<span className="text-[10px]" style={{ color: colors.neutral400 }}>{range.label}</span>}
          >
            {trend.length > 0 ? (
              <FlatTrendChart data={trend} color={colors.primary600} height={240} />
            ) : (
              <EmptyState icon={<FiBarChart2 />} title="No data in this range" subtitle="Try a wider date range." />
            )}
          </Panel>
        </div>
        <div className={isMobile ? "" : "col-span-4"}>
          <Panel title="Devices">
            {hasDeviceData ? (
              <div className="flex flex-col gap-4 items-center">
                <DeviceDonutChart breakdown={deviceBreakdown} height={160} />
                <div className="w-full">
                  <FlatDeviceBreakdown breakdown={deviceBreakdown} showBar={false} />
                </div>
              </div>
            ) : (
              <EmptyState icon={<FiUsers />} title="No device data" subtitle="Device breakdown appears once visits come in." />
            )}
          </Panel>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewPanel;
