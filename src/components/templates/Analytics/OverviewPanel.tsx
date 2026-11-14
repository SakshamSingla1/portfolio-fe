import React from "react";
import { motion } from "framer-motion";
import { FiEye, FiUsers, FiDownload, FiBarChart2 } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IAnalyticsOverview } from "../../../services/useDashboardService";
import { Panel, MetricTile } from "./shared/AnalyticsSurface";
import { FlatTrendChart, FlatDeviceBreakdown } from "./FlatCharts";
import { DeviceDonutChart } from "../Dashboard/AnalyticsCharts";
import { EmptyState } from "../Dashboard/shared/DashboardUI";

interface OverviewPanelProps {
  overview: IAnalyticsOverview;
}

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
