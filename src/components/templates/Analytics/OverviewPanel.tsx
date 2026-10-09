import React from "react";
import { FiEye, FiUsers, FiDownload } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useCountUp } from "../../../hooks/useCountUp";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IAnalyticsOverview } from "../../../services/useDashboardService";
import { Panel, DeltaChip } from "./shared/AnalyticsSurface";
import { FlatTrendChart, FlatDeviceBreakdown } from "./FlatCharts";

interface OverviewPanelProps {
  overview: IAnalyticsOverview;
}

const StatTile: React.FC<{ label: string; icon: React.ReactNode; current: number; percentChange: number | null }> = ({
  label, icon, current, percentChange,
}) => {
  const colors = useColors();
  const animated = useCountUp(current, 0);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5" style={{ color: colors.neutral400 }}>
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="font-black tabular-nums leading-none"
          style={{ fontSize: "clamp(22px, 3vw, 28px)", color: colors.neutral900, letterSpacing: "-0.03em" }}
        >
          {animated.toLocaleString()}
        </span>
        <DeltaChip percentChange={percentChange} />
      </div>
    </div>
  );
};

const OverviewPanel: React.FC<OverviewPanelProps> = ({ overview }) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const { comparison, trend, deviceBreakdown, range } = overview;
  const hasDeviceData = Object.values(deviceBreakdown).some((c) => c > 0);

  return (
    <div className="flex flex-col gap-4">
      <Panel noPadding>
        <div className={`grid gap-6 p-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          <StatTile
            label="Views"
            icon={<FiEye size={11} />}
            current={comparison.views.current}
            percentChange={comparison.views.percentChange}
          />
          <StatTile
            label="Unique Visitors"
            icon={<FiUsers size={11} />}
            current={comparison.uniqueVisitors.current}
            percentChange={comparison.uniqueVisitors.percentChange}
          />
          <StatTile
            label="CV Downloads"
            icon={<FiDownload size={11} />}
            current={comparison.resumeDownloads.current}
            percentChange={comparison.resumeDownloads.percentChange}
          />
        </div>
      </Panel>

      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
        <div className={isMobile ? "" : "col-span-8"}>
          <Panel
            title="Views trend"
            right={<span className="text-[10px]" style={{ color: colors.neutral400 }}>{range.label}</span>}
          >
            {trend.length > 0 ? (
              <FlatTrendChart data={trend} color={colors.primary600} height={240} />
            ) : (
              <span className="text-[11px]" style={{ color: colors.neutral400 }}>No data in this range.</span>
            )}
          </Panel>
        </div>
        <div className={isMobile ? "" : "col-span-4"}>
          <Panel title="Devices">
            {hasDeviceData ? (
              <FlatDeviceBreakdown breakdown={deviceBreakdown} />
            ) : (
              <span className="text-[11px]" style={{ color: colors.neutral400 }}>No device data.</span>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
