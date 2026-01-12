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

export const WorkStatusType = {
    CURRENT: "CURRENT",
    COMPLETED: "COMPLETED"
};

export const WorkStatusOptions = [
    {label: "Current" ,value: WorkStatusType.CURRENT},
    {label: "Completed" ,value: WorkStatusType.COMPLETED}
]

export interface Project {
    profileId : string;
    projectName : string;
    projectDescription : string;
    projectLink : string;
    projectStartDate : string;
    projectEndDate : string;
    workStatus : string;
    projectImageUrl : string;
    skillIds : string[];
}

export interface ProjectResponse {
    id: string;
    projectName: string;
    projectDescription: string;
    projectLink: string;
    projectStartDate: string;
    projectEndDate: string;
    workStatus: string;
    projectImageUrl: string;
    skills: SkillDropdown[];
}

export interface ProjectFilterParams {
    page?: number;
    size?: number;
    search?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useProjectService = () => {
    const { user } = useAuthenticatedUser();

    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const create = (project: Project) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, project);
    };

    const update = (id: string | null, project: Project) => {
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
