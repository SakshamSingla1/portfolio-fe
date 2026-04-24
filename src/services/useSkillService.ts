import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const SKILL_URLS = {
    SKILL: "/skill",
    SKILL_BY_ID: "/skill/:id",
    SKILL_BY_PROFILE_ID: "/skill",
    SKILL_STATS: "/skill/stats",
}

export const SkillLevelType = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
    EXPERT: "Expert",
} as const;

export interface Skill {
    logoId: string;
    level: string;
    category: string;
}

export interface SkillDropdown {
    id: string;
    logoName: string;
    logoUrl: string;
}

export interface SkillResponse {
    id: string;
    logoId: string;
    logoName: string;
    logoUrl: string;
    category: string;
    level: string;
}

export interface SkillFilterParams {
    page?: string;
    size?: string;
    search?: string;
    sortDir?: string;
    sortBy?: string;
}

export interface SkillStats {
    expertSkillCount: number;
    advancedSkillCount: number;
    intermediateSkillCount: number;
    beginnerSkillCount: number;
}

export const useSkillService = () => {
    const { user } = useAuthenticatedUser();

        const getAll = () => {
            const url = replaceUrlParams(SKILL_URLS.SKILL, {});
            return request(API_METHOD.GET, url, user, null, null, null);
        };

        const getById = (id: string | null) => {
            const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
            return request(API_METHOD.GET, url, user, null, null, null);
        };

        const create = (skill: Skill) => {
            const url = replaceUrlParams(SKILL_URLS.SKILL, {});
            return request(API_METHOD.POST, url, user, skill);
        };

        const update = (id: string | null, skill: Skill) => {
            const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
            return request(API_METHOD.PUT, url, user, skill);
        };

        const remove = (id: string) => {
            const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
            return request(API_METHOD.DELETE, url, user, null);
        };

        const getByProfile = (params: SkillFilterParams) => {
            const url = SKILL_URLS.SKILL_BY_PROFILE_ID;
            return request(API_METHOD.GET, url, user, null, { params });
        };

        const getStats = () => {
            const url = SKILL_URLS.SKILL_STATS;
            return request(API_METHOD.GET, url, user, null, null, null);
        };

        return {
            getAll,
            getById,
            create,
            update,
            remove,
            getByProfile,
            getStats,
        };
}
