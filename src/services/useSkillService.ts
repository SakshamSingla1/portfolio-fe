import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

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
    const getAll = () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ALL);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url);
    };
    const create = (skill: Skill) => {
        return request(API_METHOD.POST, AUTH_URLS.GET_ALL, skill);
    };

    const update = (id: string, skill: Skill) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, skill);
    };

    return {
        getAll,
        getById,
        create,
        update,
    }
};

export default useSkillService;