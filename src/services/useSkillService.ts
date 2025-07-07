import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const AUTH_URLS = {
    GET_ALL: "/skill",
    GET_ALL_BY_ID: "/skill/:id",
}

export interface Skill {
    id?: number;
    name: string;
    category: string;
    level: string;
}

export const useSkillService = () => {
    const { user } = useAuthenticatedUser();
    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, user, null, null, null)
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

    return {
        getAll,
        getById,
        create,
        update,
    }
};

export default useSkillService;