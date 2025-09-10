import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { SkillDropdown } from "./useSkillService";

export const AUTH_URLS = {
    GET_ALL: "/project",
    GET_ALL_BY_ID: "/project/:id",
}

export interface Project {
    id?: number;
    projectName: string;
    projectDescription: string;
    projectLink: string;
    technologiesUsed: number[];
    projectStartDate: Date;
    projectEndDate: Date;
    currentlyWorking: boolean;
    projectImageUrl: string;
}

export interface ProjectResponse {
    id: number;
    projectName: string;
    projectDescription: string;
    projectLink: string;
    technologiesUsed: SkillDropdown[];
    projectStartDate: Date;
    projectEndDate: Date;
    currentlyWorking: boolean;
    projectImageUrl: string;
}

export const useProjectService = () => {
    const { user } = useAuthenticatedUser();
    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, null, null)
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null, null, null);
    };

    const create = (project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, project);
    };

    const update = (id: string, project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, project);
    };

    return {
        getAll,
        getById,
        create,
        update,
    }
};

export default useProjectService;