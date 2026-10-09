import React from "react";
import { FiEye } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import type { IDailyView } from "../../../services/useDashboardService";
import { Panel } from "./shared/AnalyticsSurface";
import ViewsHeatmap from "../Dashboard/ViewsHeatmap";

interface ActivityPanelProps {
  viewsHeatmap: IDailyView[];
}

// Wraps the existing ViewsHeatmap.tsx unchanged — it already has its own flat,
// minimal look and an independent 30D/90D toggle. Always reflects the trailing
// 90 days, decoupled from the page's range picker (see OverviewPanel/VisitorsPanel).
const ActivityPanel: React.FC<ActivityPanelProps> = ({ viewsHeatmap }) => {
  const colors = useColors();
  return (
    <Panel title="90-day activity" icon={<FiEye size={11} />}>
      <p className="text-[10px] mb-3" style={{ color: colors.neutral400 }}>
        Always shows the trailing 90 days, independent of the range filter above.
      </p>
      {viewsHeatmap.length > 0 ? (
        <ViewsHeatmap data={viewsHeatmap} />
      ) : (
        <span className="text-[11px]" style={{ color: colors.neutral400 }}>No activity recorded yet.</span>
      )}
    </Panel>
  );
};

export default ActivityPanel;
