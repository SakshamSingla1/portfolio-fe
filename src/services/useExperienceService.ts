import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const AUTH_URLS = {
    GET_ALL: "/experience",
    GET_ALL_BY_ID: "/experience/:id",
}

export interface Experience {
    id?: number;
    companyName: string;
    jobTitle: string;
    location: string;
    startDate: string;
    endDate?: string;  // This is optional
    currentlyWorking: boolean;
    description: string;
    technologiesUsed: string[];
}

export const useExperienceService = () => {
    const getAll = () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ALL);
    };

    const getById = (id: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.GET, url);
    };

    const create = (experience: Experience) => {
        return request(API_METHOD.POST, AUTH_URLS.GET_ALL, experience);
    };

    const update = (id: string, experience: Experience) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
        return request(API_METHOD.PUT, url, experience);
    };

    return {
        getAll,
        getById,
        create,
        update,
    }
};

export default useExperienceService;