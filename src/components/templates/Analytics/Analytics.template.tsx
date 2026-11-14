import React from "react";
import { FiBarChart2 } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { SkeletonBlock } from "../Dashboard/shared/DashboardUI";
import Tabs, { type ITabsSchema } from "../../atoms/Tabs/Tabs";
import type { IAnalyticsOverview, IAnalyticsRangeKey } from "../../../services/useDashboardService";
import RangeControl from "./RangeControl";
import ExportMenu from "./ExportMenu";
import OverviewPanel from "./OverviewPanel";
import VisitorsPanel from "./VisitorsPanel";
import ActivityPanel from "./ActivityPanel";

interface RangeValue {
  range: IAnalyticsRangeKey;
  startDate?: string;
  endDate?: string;
}

interface AnalyticsTemplateProps {
  overview: IAnalyticsOverview | null;
  isLoading: boolean;
  rangeValue: RangeValue;
  onRangeChange: (next: RangeValue) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AnalyticsTemplate: React.FC<AnalyticsTemplateProps> = ({
  overview, isLoading, rangeValue, onRangeChange, activeTab, onTabChange,
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  const showSkeleton = isLoading || !overview;

  // The tab strip itself doesn't depend on data -- keeping it visible and
  // swapping only the inner content avoids the whole page (nav included)
  // popping in abruptly once the fetch resolves.
  const overviewSkeleton = (
    <div className="flex flex-col gap-4">
      <SkeletonBlock height={120} />
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
        <div className={isMobile ? "" : "col-span-8"}><SkeletonBlock height={280} /></div>
        <div className={isMobile ? "" : "col-span-4"}><SkeletonBlock height={280} /></div>
      </div>
    </div>
  );
  const visitorsSkeleton = (
    <div className="flex flex-col gap-4">
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        <SkeletonBlock height={180} />
        <SkeletonBlock height={180} />
      </div>
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        <SkeletonBlock height={160} />
        <SkeletonBlock height={160} />
      </div>
      <SkeletonBlock height={300} />
    </div>
  );
  const activitySkeleton = (
    <div className="flex flex-col gap-4">
      <SkeletonBlock height={100} />
      <SkeletonBlock height={420} />
    </div>
  );

  const schema: ITabsSchema[] = [
    {
      value: "overview", label: "Overview",
      component: showSkeleton ? overviewSkeleton : <OverviewPanel overview={overview as IAnalyticsOverview} />,
    },
    {
      value: "visitors", label: "Visitors",
      component: showSkeleton ? visitorsSkeleton : <VisitorsPanel overview={overview as IAnalyticsOverview} />,
    },
    {
      value: "activity", label: "Activity",
      component: showSkeleton ? activitySkeleton : <ActivityPanel viewsHeatmap={(overview as IAnalyticsOverview).viewsHeatmap} />,
    },
  ];

  return (
    <div style={{ padding: isMobile ? "12px 10px 24px" : "16px 16px 24px" }}>
      <div
        className={`flex items-center justify-between gap-3 mb-4 ${isMobile ? "flex-col items-stretch" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 36, height: 36, background: `${colors.primary500}12`, color: colors.primary600 }}
          >
            <FiBarChart2 size={16} />
          </div>
          <div className="min-w-0">
            <h1
              className="font-black tracking-tight truncate"
              style={{ fontSize: 19, color: colors.neutral900, letterSpacing: "-0.02em", margin: 0 }}
            >
              Analytics
            </h1>
            <p className="text-xs truncate" style={{ color: colors.neutral400 }}>
              Portfolio views, visitor trends, and device breakdown
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isMobile ? "justify-between" : "shrink-0"}`}>
          <RangeControl value={rangeValue} onChange={onRangeChange} />
          <ExportMenu recentViews={overview?.recentViews ?? []} rangeLabel={overview?.range.label ?? "export"} />
        </div>
      </div>

      <Tabs schema={schema} value={activeTab} setValue={onTabChange} />
    </div>
  );
};

export default AnalyticsTemplate;
