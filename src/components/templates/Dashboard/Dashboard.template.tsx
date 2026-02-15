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

    const SectionHeading = ({ title, rightContent }: {
        title: string;
        rightContent?: React.ReactNode;
    }) => (
        <div className="mb-6">
            <div className="flex justify-between items-center">
                <div className="text-sm font-semibold tracking-wide uppercase" style={{ color: colors.primary800 }}>
                    {title}
                </div>
                {rightContent}
            </div>
            <div className="h-px mt-3" style={{ background: colors.neutral300 }} />
        </div>
    );

    const SkeletonBlock = ({ height }: { height: string }) => (
        <div className="rounded-xl" style={{ height, background: colors.neutral200 }} />
    );

    const DashboardSkeleton = () => (
        <div className={`grid gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
            <div className={`${isMobile ? "" : "col-span-8"} space-y-10`}>
                <div className="rounded-2xl p-6" style={cardStyle}>
                    <SkeletonBlock height="200px" />
                </div>
                <div className={`flex gap-8 ${isMobile ? "flex-col" : ""}`}>
                    <div className="w-full rounded-2xl p-6" style={cardStyle}>
                        <SkeletonBlock height="200px" />
                    </div>
                    <div className="w-full rounded-2xl p-6" style={cardStyle}>
                        <SkeletonBlock height="200px" />
                    </div>
                </div>
            </div>
            <div className={`${isMobile ? "" : "col-span-4"} space-y-10`}>
                <div className="rounded-2xl p-6" style={cardStyle}>
                    <SkeletonBlock height="250px" />
                </div>
                <div className="rounded-2xl p-6" style={cardStyle}>
                    <SkeletonBlock height="300px" />
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className={`mx-auto ${isMobile ? "px-4 py-6" : "px-8 py-10"}`}>
                <div className="mb-12">
                    <div className="text-2xl font-bold tracking-tight" style={{ color: colors.primary900 }}>
                        Dashboard Overview
                    </div>
                </div>
                {!dashboardData ? (
                    <DashboardSkeleton />
                ) : (
                    <div className={`grid gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
                        <div className={`space-y-10 ${isMobile ? "" : "col-span-8"}`}>
                            <div className="rounded-2xl p-8" style={cardStyle}>
                                <SectionHeading title="Statistics Summary" />
                                <StatsTemplate stats={dashboardData.stats} />
                            </div>
                            <div className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                                <div className="rounded-2xl p-8" style={cardStyle}>
                                    <SectionHeading title="Recent Messages" rightContent={
                                        <div className="px-3 py-1 text-xs font-semibold rounded-full" style={{
                                            background: colors.primary100,
                                            color: colors.primary700,
                                        }}>
                                            {dashboardData.recentMessages.length} Message
                                            {dashboardData.recentMessages.length !== 1 ? "s" : ""}
                                        </div>
                                    }
                                    />
                                    <RecentMessagesTemplate messages={dashboardData.recentMessages} />
                                </div>
                                <div className="rounded-2xl p-8" style={cardStyle}>
                                    <SectionHeading title="Quick Actions" />
                                    <QuickActionsTemplate />
                                </div>
                            </div>
                        </div>
                        <div className={`space-y-10 ${isMobile ? "" : "col-span-4"}`}>
                            <div className="rounded-2xl p-8" style={cardStyle}>
                                <SectionHeading title="Profile Completion" />
                                <ProfileCompletionTemplate profileCompletion={dashboardData.profileCompletion} />
                            </div>
                            <div className="rounded-2xl p-8" style={cardStyle}>
                                <SectionHeading title="Recent Activities" rightContent={
                                    <div className="px-3 py-1 text-xs font-semibold rounded-full" style={{ background: colors.primary100, color: colors.primary700, }}>
                                        {dashboardData.recentActivities.length} Update
                                        {dashboardData.recentActivities.length !== 1 ? "s" : ""}
                                    </div>
                                } />
                                <RecentActivitiesTemplate activities={dashboardData.recentActivities} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardTemplate;
