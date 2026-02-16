import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { replaceUrlParams } from "../utils/helper";
import type { ContactUs } from "./useContactUsService";

export const DASHBOARD_URLS = {
    DASHBOARD_SUMMARY : "/dashboard/:profileId"
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
}

export interface IProfileCompletion {
    percentage: number;
    missingSections: string[];
}

export interface IActivity {
    type: string;
    description: string;
    timestamp: string;
}

export interface IDashboardSummary {
    stats: IStats;
    profileCompletion: IProfileCompletion;
    recentMessages: ContactUs[];
    recentActivities: IActivity[];
}

export const useDashboardService = () => {
    const { user } = useAuthenticatedUser();

    const getByProfile = () => {
        const url = replaceUrlParams(DASHBOARD_URLS.DASHBOARD_SUMMARY, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null);
    };

    return {
        getByProfile,
    };
}

export default useDashboardService;