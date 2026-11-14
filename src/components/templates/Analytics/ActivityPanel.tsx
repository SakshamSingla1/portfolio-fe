import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiEye, FiZap, FiTrendingUp } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IDailyView } from "../../../services/useDashboardService";
import { Panel, MetricTile } from "./shared/AnalyticsSurface";
import { EmptyState } from "../Dashboard/shared/DashboardUI";
import ViewsHeatmap from "../Dashboard/ViewsHeatmap";

interface ActivityPanelProps {
  viewsHeatmap: IDailyView[];
}

const WAVE_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const WAVE_ITEM = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// Wraps the existing ViewsHeatmap.tsx unchanged — it already has its own flat,
// minimal look, its own streak/total-views readout, and an independent 30D/90D
// toggle. Always reflects the trailing 90 days, decoupled from the page's range
// picker (see OverviewPanel/VisitorsPanel).
const ActivityPanel: React.FC<ActivityPanelProps> = ({ viewsHeatmap }) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  // Complementary to the heatmap's own streak/total readout -- best single day
  // and the daily average aren't shown anywhere else on this tab.
  const { bestDay, avgPerDay } = useMemo(() => {
    if (!viewsHeatmap.length) return { bestDay: null as IDailyView | null, avgPerDay: 0 };
    const best = viewsHeatmap.reduce((a, b) => (b.count > a.count ? b : a), viewsHeatmap[0]);
    const total = viewsHeatmap.reduce((s, d) => s + d.count, 0);
    return { bestDay: best.count > 0 ? best : null, avgPerDay: Math.round(total / viewsHeatmap.length) };
  }, [viewsHeatmap]);

  if (!viewsHeatmap.length) {
    return (
      <Panel title="90-day activity" icon={<FiEye size={11} />}>
        <EmptyState icon={<FiEye />} title="No activity recorded yet" subtitle="Daily views will build up a 90-day history here." />
      </Panel>
    );
  }

  return (
    <motion.div className="flex flex-col gap-4" variants={WAVE_CONTAINER} initial="hidden" animate="visible">
      <motion.div variants={WAVE_ITEM}>
        <Panel noPadding accent={colors.primary600}>
          <div className={`grid gap-6 p-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <MetricTile
              label="Avg Views / Day"
              icon={<FiTrendingUp size={16} />}
              accent={colors.primary600}
              current={avgPerDay}
            />
            {bestDay && (
              <MetricTile
                label={`Best Day · ${bestDay.date}`}
                icon={<FiZap size={16} />}
                accent="#f59e0b"
                current={bestDay.count}
              />
            )}
          </div>
        </Panel>
      </motion.div>

      <motion.div variants={WAVE_ITEM}>
        <Panel title="90-day activity" icon={<FiEye size={11} />}>
          <p className="text-[10px] mb-3" style={{ color: colors.neutral400 }}>
            Always shows the trailing 90 days, independent of the range filter above.
          </p>
          <ViewsHeatmap data={viewsHeatmap} />
        </Panel>
      </motion.div>
    </motion.div>
  );
};

export default ActivityPanel;
