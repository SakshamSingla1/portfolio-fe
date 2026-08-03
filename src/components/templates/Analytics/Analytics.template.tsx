import React from "react";
import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";
import type { IDashboardSummary, IViewStats } from "../../../services/useDashboardService";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { PageHeaderBanner, SkeletonBlock } from "../Dashboard/shared/DashboardUI";
import ViewAnalyticsTemplate from "../Dashboard/ViewAnalytics.template";

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

interface AnalyticsTemplateProps {
  dashboardData: IDashboardSummary | null;
  isLoading: boolean;
}

const AnalyticsTemplate: React.FC<AnalyticsTemplateProps> = ({ dashboardData, isLoading }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      style={{ padding: isMobile ? "12px 10px 24px" : "16px 16px 24px" }}
    >
      <PageHeaderBanner
        icon={<FiBarChart2 size={17} />}
        title="Analytics"
        subtitle="Portfolio views, visitor trends, and device breakdown"
      />

      {isLoading ? (
        <SkeletonBlock height={420} />
      ) : (
        <ViewAnalyticsTemplate viewStats={dashboardData?.viewStats ?? EMPTY_VIEW_STATS} />
      )}
    </motion.div>
  );
};

export default AnalyticsTemplate;
