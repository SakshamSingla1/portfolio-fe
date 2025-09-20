import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const SKILL_URLS = {
    SKILL : "/skill",
    SKILL_BY_ID : "/skill/:id",
    SKILL_BY_PROFILE_ID : "/skill/profile/:profileId",
}

export interface Skill {
    id?: number;
    logoId?: number | null;
    logoName?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    level: string;
    profileId?: string | null;
}

export interface SkillDropdown {
    id: number;
    logoName: string;
    logoUrl: string;
    category?: string | null;
}

export interface SkillResponse {
    id: number;
    logoName?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    level: string;
}

export interface SkillFilterParams {
    page?: number;
    size?: number;
    search?: string;
}

export const useSkillService = () => {
    const { user } = useAuthenticatedUser();

    const getAll = () => {
        const url = replaceUrlParams(SKILL_URLS.SKILL, {});
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const create = (skill: Skill) => {
        const url = replaceUrlParams(SKILL_URLS.SKILL, {});
        return request(API_METHOD.POST, url, user, skill);
    };

    const update = (id: string, skill: Skill) => {
        const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, skill);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(SKILL_URLS.SKILL_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getByProfile = (params: SkillFilterParams) => {
        const url = replaceUrlParams(SKILL_URLS.SKILL_BY_PROFILE_ID, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, { params });
    };

    return {
        getAll,
        getById,
        create,
        update,
        remove,
        getByProfile,
    };
}
        