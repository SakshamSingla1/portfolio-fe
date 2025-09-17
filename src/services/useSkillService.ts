import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const AUTH_URLS = {
    GET_ALL: "/skill",
    GET_ALL_BY_ID: "/skill/:id",
    GET_BY_PROFILE: "/skill/profile/:profileId",
    DROPDOWN: "/skill/dropdown",
}

export interface Skill {
    id?: number;
    logoId?: number | null;
    logoName?: string | null;
    logoUrl?: string | null;
    category?: string | null;
    level: string;
    profileId?: string;
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

    const getDropdown = (params: SkillFilterParams) => {
        const url = replaceUrlParams(AUTH_URLS.DROPDOWN, {});
        return request(API_METHOD.GET, url, null, null, { params });
    };

    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null, null, null);
    };

    const create = (skill: Skill) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, skill);
    };

    const update = (id: string, skill: Skill) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, skill);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getByProfile = (params: SkillFilterParams) => {
        const url = replaceUrlParams(AUTH_URLS.GET_BY_PROFILE, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, { params });
    };

    return {
        getDropdown,
        getAll,
        getById,
        create,
        update,
        remove,
        getByProfile,
    };
};

export default useSkillService;
