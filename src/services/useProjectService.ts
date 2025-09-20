import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { type SkillDropdown } from "./useSkillService";

export const AUTH_URLS = {
    GET_ALL: "/project",
    GET_ALL_BY_ID: "/project/:id",
    GET_BY_PROFILE: "/project/profile/:profileId",
};

export interface Project {
    id?: number;
    projectName: string;
    projectDescription: string;
    projectLink: string;
    technologiesUsed: number[];
    projectStartDate: string;
    projectEndDate: string;
    currentlyWorking: boolean;
    projectImageUrl: string;
    profileId?: number;
}

export interface ProjectResponse {
    id: number;
    projectName: string;
    projectDescription: string;
    projectLink: string;
    technologiesUsed: SkillDropdown[];
    projectStartDate: string;
    projectEndDate: string;
    currentlyWorking: boolean;
    projectImageUrl: string;
}

export interface ProjectFilterParams {
    page?: number;
    size?: number;
    search?: string;
}

export const useProjectService = () => {
    const { user } = useAuthenticatedUser();

    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const create = (project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, project);
    };

    const update = (id: string, project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, project);
    };

    const deleteProject = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getByProfile = (params: ProjectFilterParams) => {
        const url = replaceUrlParams(AUTH_URLS.GET_BY_PROFILE, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, { params });
    };

    return {
        getAll,
        getById,
        create,
        update,
        deleteProject,
        getByProfile,
    };
};

export default useProjectService;
