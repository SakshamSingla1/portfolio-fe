import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import type { ContactUs } from "./useContactUsService";

export const DASHBOARD_URLS = {
    DASHBOARD_SUMMARY: "/dashboard",
    VIEW_STATS: "/dashboard/view-stats"
}

export interface IProfileSummary {
    fullName: string;
    title: string;
    location: string;
    profileImageUrl: string;
    portfolioUrl?: string | null;
}

export interface IDailyView {
    day: string;    // Mon, Tue …
    date: string;   // Jun 18
    count: number;
}

export interface IPortfolioView {
    device: string;
    referrer: string;
    timestamp: string;
    sessionId: string;
    browser?: string;
    os?: string;
    language?: string;
    timezone?: string;
    country?: string;
    city?: string;
    countryCode?: string;
}

export interface IViewStats {
    totalViews: number;
    viewsToday: number;
    viewsThisWeek: number;
    viewsLastWeek: number;
    viewsThisMonth: number;
    uniqueVisitors: number;
    resumeDownloads: number;
    weeklyTrend: IDailyView[];
    viewsHeatmap?: IDailyView[];
    deviceBreakdown: Record<string, number>;
    browserBreakdown: Record<string, number>;
    locationBreakdown: Record<string, number>;
    referrerBreakdown: Record<string, number>;
    recentViews: IPortfolioView[];
}

export interface IStats {
    totalSkills: number;
    totalEducation: number;
    totalExperience: number;
    totalProjects: number;
    totalAchievements: number;
    totalTestimonials: number;
    totalCertification: number;
    totalMessages: number;
    unreadMessages: number;
    totalSocialLinks: number;
    /** Keyed by totalProjects/totalSkills/totalExperience/totalMessages: count created this week minus count created the week before. */
    weeklyDelta?: Record<string, number>;
}

export interface ICompletionSnapshot {
    date: string;
    percentage: number;
}

export interface IProfileCompletion {
    percentage: number;
    missingSections: string[];
    /** Last 30 days of daily snapshots, oldest first. */
    trend?: ICompletionSnapshot[];
}

export interface IActivity {
    type: string;
    description: string;
    timestamp: string;
    entityId?: string;
}

export interface IDashboardSummary {
    profileSummary: IProfileSummary;
    viewStats: IViewStats;
    stats: IStats;
    profileCompletion: IProfileCompletion;
    recentMessages: ContactUs[];
    recentActivities: IActivity[];
}

// ── Analytics Dashboard (dedicated /analytics page): date-range + comparison ──
// Separate from IViewStats/IDashboardSummary above (which still power the home
// Dashboard's fixed-window widget, unchanged) so the two can evolve independently.

export type IAnalyticsRangeKey = "7d" | "30d" | "90d" | "custom";

export interface IAnalyticsRangeParams {
    range: IAnalyticsRangeKey;
    startDate?: string; // yyyy-MM-dd, only used when range === "custom"
    endDate?: string;
}

export interface IAnalyticsRange {
    key: IAnalyticsRangeKey;
    startDate: string;
    endDate: string;
    label: string;
}

export interface IMetricComparison {
    current: number;
    previous: number;
    percentChange: number | null;
}

export interface IAnalyticsComparison {
    views: IMetricComparison;
    uniqueVisitors: IMetricComparison;
    resumeDownloads: IMetricComparison;
}

export interface IAnalyticsOverview {
    range: IAnalyticsRange;
    comparison: IAnalyticsComparison;
    trend: IDailyView[];
    deviceBreakdown: Record<string, number>;
    browserBreakdown: Record<string, number>;
    locationBreakdown: Record<string, number>;
    referrerBreakdown: Record<string, number>;
    recentViews: IPortfolioView[];
    // Always the trailing 90 days, independent of the selected range.
    viewsHeatmap: IDailyView[];
}

export const useDashboardService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getByProfile = () => {
            const url = DASHBOARD_URLS.DASHBOARD_SUMMARY;
            return request(API_METHOD.GET, url, user, null);
        };

        const getViewStats = (params: IAnalyticsRangeParams) => {
            const url = DASHBOARD_URLS.VIEW_STATS;
            return request(API_METHOD.GET, url, user, null, { params });
        };

        return {
            getByProfile,
            getViewStats,
        };
    }, [user]);
}

export default useDashboardService;
