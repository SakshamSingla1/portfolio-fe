import React, { useEffect, useState } from "react";
import { type IDashboardSummary } from "../../../services/useDashboardService";
import { useColors } from "../../../utils/types";

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

    const [isMobile, setIsMobile] = useState<boolean>(
        window.innerWidth < 1024
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cardStyle = {
        background: `linear-gradient(160deg, ${colors.neutral50}, ${colors.primary50})`,
        border: `1px solid ${colors.primary200}`,
        boxShadow: `0 8px 30px ${colors.primary100}40`,
    };

    const SkeletonBlock = ({ height }: { height: string }) => (
        <div
            className="rounded-xl animate-pulse"
            style={{
                height,
                background: colors.neutral200,
            }}
        />
    );

    const DashboardSkeleton = () => (
        <div className={`grid gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`} >
            <div className={`${isMobile ? "" : "col-span-8"} space-y-10`}>
                <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
                    <SkeletonBlock height="28px" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonBlock key={i} height="120px" />
                        ))}
                    </div>
                </div>
                <div className={`flex gap-8 ${isMobile ? "flex-col" : "flex-row items-start"}`}>
                    <div className={`${isMobile ? "w-full" : "w-1/2"} rounded-[28px] p-6 lg:p-8`} style={cardStyle}>
                        <SkeletonBlock height="220px" />
                    </div>
                    <div className={`${isMobile ? "w-full" : "w-1/2"} rounded-[28px] p-6 lg:p-8`} style={cardStyle}>
                        <SkeletonBlock height="220px" />
                    </div>
                </div>
            </div>
            <div className={`${isMobile ? "" : "col-span-4"} space-y-10`}>
                <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
                    <SkeletonBlock height="260px" />
                </div>
                <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
                    <SkeletonBlock height="320px" />
                </div>
            </div>
        </div>
    );

    return (
        <div >
            <div className={`mx-auto max-w-[1600px] ${isMobile ? "px-4 py-6" : "px-8 py-10"}`}>
                {!dashboardData ? (<DashboardSkeleton />) : (
                    <div className={`grid gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`} >
                        <div className={`space-y-10 ${isMobile ? "" : "col-span-8"}`}>
                            <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
                                <div className="mb-6">
                                    <div className="text-lg lg:text-xl font-semibold" style={{ color: colors.primary800 }}>
                                        Dashboard Overview
                                    </div>
                                    <div className="h-px mt-3" style={{ background: colors.neutral200 }} />
                                </div>
                                <StatsTemplate stats={dashboardData.stats} />
                            </div>
                            <div className={`flex gap-8 ${isMobile ? "flex-col" : "flex-row items-start"}`}>
                                <div className={`${isMobile ? "w-full" : "w-1/2"} rounded-[28px] p-6 lg:p-8`} style={cardStyle}>
                                    <RecentMessagesTemplate messages={dashboardData.recentMessages} />
                                </div>
                                <div className={`${isMobile ? "w-full" : "w-1/2"} rounded-[28px] p-6 lg:p-8`} style={cardStyle}>
                                    <QuickActionsTemplate />
                                </div>
                            </div>
                        </div>
                        <div className={`space-y-10 ${isMobile ? "" : "col-span-4"}`}>
                            <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
                                <ProfileCompletionTemplate profileCompletion={dashboardData.profileCompletion} />
                            </div>
                            <div className="rounded-[28px] p-6 lg:p-8" style={cardStyle}>
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
