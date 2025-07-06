import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const AUTH_URLS = {
    GET_ALL: "/project",
    GET_ALL_BY_ID: "/project/:id",
}

export interface Project {
    id?: number;
    projectName: string;
    projectDescription: string;
    projectDuration: string;
    projectLink: string;
    technologiesUsed: string;
    createdAt?: string;
    updatedAt?: string;
}

export const useProjectService = () => {
    const getAll = () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ALL);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url);
    };

    const create = (project: Project) => {
        return request(API_METHOD.POST, AUTH_URLS.GET_ALL, project);
    };

    const update = (id: string, project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, project);
    };

    return {
        getAll,
        getById,
        create,
        update,
    }
};

export default useProjectService;