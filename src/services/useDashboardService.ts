import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import type { ContactUs } from "./useContactUsService";

export const DASHBOARD_URLS = {
    DASHBOARD_SUMMARY: "/dashboard"
}

export interface IProfileSummary {
    fullName: string;
    title: string;
    location: string;
    profileImageUrl: string;
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
}

export interface IViewStats {
    totalViews: number;
    viewsToday: number;
    viewsThisWeek: number;
    viewsThisMonth: number;
    uniqueVisitors: number;
    resumeDownloads: number;
    weeklyTrend: IDailyView[];
    deviceBreakdown: Record<string, number>;
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
}

export interface IProfileCompletion {
    percentage: number;
    missingSections: string[];
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

export const useDashboardService = () => {
    const { user } = useAuthenticatedUser();

    const getByProfile = () => {
        const url = DASHBOARD_URLS.DASHBOARD_SUMMARY;
        return request(API_METHOD.GET, url, user, null);
    };

    return {
        getByProfile,
    };
}

export default useDashboardService;
