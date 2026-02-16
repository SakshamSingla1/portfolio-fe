import React from "react";
import { type IDashboardSummary } from "../../../services/useDashboardService";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";

import StatsTemplate from "./Stats.template";
import ProfileCompletionTemplate from "./ProfileCompletion.template";
import RecentMessagesTemplate from "./RecentMessages.template";
import RecentActivitiesTemplate from "./RecentActivities.template";
import QuickActionsTemplate from "./QuickActions.template";

interface DashboardTemplateProps {
  dashboardData: IDashboardSummary | null;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  dashboardData,
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  const cardStyle = {
    background: `linear-gradient(to bottom, ${colors.neutral100}, ${colors.primary100})`,
    border: `1px solid ${colors.primary300}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  };

  /* =========================
     Section Heading Component
  ========================== */
  const SectionHeading = ({
    title,
    rightContent,
  }: {
    title: string;
    rightContent?: React.ReactNode;
  }) => (
    <div className={isMobile ? "mb-4" : "mb-6"}>
      <div className="flex justify-between items-center">
        <div
          className={`font-semibold tracking-wide uppercase ${
            isMobile ? "text-xs" : "text-sm"
          }`}
          style={{ color: colors.primary800 }}
        >
          {title}
        </div>
        {rightContent}
      </div>
      <div
        className="h-px mt-3"
        style={{ background: colors.neutral300 }}
      />
    </div>
  );

  /* =========================
     Skeleton Block
  ========================== */
  const SkeletonBlock = ({ height }: { height: string }) => (
    <div
      className="rounded-xl animate-pulse"
      style={{
        height,
        background: colors.neutral200,
      }}
    />
  );

  /* =========================
     Dashboard Skeleton
  ========================== */
  const DashboardSkeleton = () => (
    <div
      className={`grid ${
        isMobile ? "grid-cols-1 gap-5" : "grid-cols-12 gap-10"
      }`}
    >
      {/* Left */}
      <div className={isMobile ? "space-y-5" : "col-span-8 space-y-10"}>
        <div
          className={`rounded-2xl ${isMobile ? "p-4" : "p-8"}`}
          style={cardStyle}
        >
          <SkeletonBlock height={isMobile ? "150px" : "200px"} />
        </div>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1 gap-5" : "grid-cols-2 gap-8"
          }`}
        >
          <div
            className={`rounded-2xl ${isMobile ? "p-4" : "p-8"}`}
            style={cardStyle}
          >
            <SkeletonBlock height="180px" />
          </div>
          <div
            className={`rounded-2xl ${isMobile ? "p-4" : "p-8"}`}
            style={cardStyle}
          >
            <SkeletonBlock height="180px" />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className={isMobile ? "space-y-5" : "col-span-4 space-y-10"}>
        <div
          className={`rounded-2xl ${isMobile ? "p-4" : "p-8"}`}
          style={cardStyle}
        >
          <SkeletonBlock height="220px" />
        </div>

        <div
          className={`rounded-2xl ${isMobile ? "p-4" : "p-8"}`}
          style={cardStyle}
        >
          <SkeletonBlock height="260px" />
        </div>
      </div>
    </div>
  );

  /* =========================
     Main Render
  ========================== */
  return (
    <div>
      <div
        className={`mx-auto ${
          isMobile ? "px-1 py-2" : "px-8 py-10"
        }`}
      >
        {/* Page Title */}
        <div className={isMobile ? "mb-6" : "mb-12"}>
          <div
            className={`font-bold tracking-tight ${
              isMobile ? "text-xl" : "text-3xl"
            }`}
            style={{ color: colors.primary900 }}
          >
            Dashboard Overview
          </div>
        </div>

        {!dashboardData ? (
          <DashboardSkeleton />
        ) : (
          <div
            className={`grid ${
              isMobile ? "grid-cols-1 gap-5" : "grid-cols-12 gap-10"
            }`}
          >
            {/* LEFT SECTION */}
            <div
              className={
                isMobile
                  ? "space-y-5"
                  : "col-span-8 space-y-10"
              }
            >
              {/* Stats */}
              <div
                className={`rounded-2xl ${
                  isMobile ? "p-4" : "p-8"
                }`}
                style={cardStyle}
              >
                <SectionHeading title="Statistics Summary" />
                <StatsTemplate stats={dashboardData.stats} />
              </div>

              {/* Messages + Quick Actions */}
              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-1 gap-5"
                    : "grid-cols-2 gap-8"
                }`}
              >
                {/* Recent Messages */}
                <div
                  className={`rounded-2xl ${
                    isMobile ? "p-4" : "p-8"
                  }`}
                  style={cardStyle}
                >
                  <SectionHeading
                    title="Recent Messages"
                    rightContent={
                      <div
                        className={`rounded-full font-semibold ${
                          isMobile
                            ? "px-2 py-1 text-[10px]"
                            : "px-3 py-1 text-xs"
                        }`}
                        style={{
                          background: colors.primary100,
                          color: colors.primary700,
                        }}
                      >
                        {dashboardData.recentMessages.length} Message
                        {dashboardData.recentMessages.length !== 1
                          ? "s"
                          : ""}
                      </div>
                    }
                  />
                  <RecentMessagesTemplate
                    messages={dashboardData.recentMessages}
                  />
                </div>

                {/* Quick Actions */}
                <div
                  className={`rounded-2xl ${
                    isMobile ? "p-4" : "p-8"
                  }`}
                  style={cardStyle}
                >
                  <SectionHeading title="Quick Actions" />
                  <QuickActionsTemplate />
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div
              className={
                isMobile
                  ? "space-y-5"
                  : "col-span-4 space-y-10"
              }
            >
              {/* Profile Completion */}
              <div
                className={`rounded-2xl ${
                  isMobile ? "p-4" : "p-8"
                }`}
                style={cardStyle}
              >
                <SectionHeading title="Profile Completion" />
                <ProfileCompletionTemplate
                  profileCompletion={
                    dashboardData.profileCompletion
                  }
                />
              </div>

              {/* Recent Activities */}
              <div
                className={`rounded-2xl ${
                  isMobile ? "p-4" : "p-8"
                }`}
                style={cardStyle}
              >
                <SectionHeading
                  title="Recent Activities"
                  rightContent={
                    <div
                      className={`rounded-full font-semibold ${
                        isMobile
                          ? "px-2 py-1 text-[10px]"
                          : "px-3 py-1 text-xs"
                      }`}
                      style={{
                        background: colors.primary100,
                        color: colors.primary700,
                      }}
                    >
                      {dashboardData.recentActivities.length} Update
                      {dashboardData.recentActivities.length !== 1
                        ? "s"
                        : ""}
                    </div>
                  }
                />
                <RecentActivitiesTemplate
                  activities={dashboardData.recentActivities}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTemplate;
