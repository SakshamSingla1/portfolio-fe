import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const AUTH_URLS = {
    GET_ALL: "/education",
    GET_ALL_BY_DEGREE: "/education/:degree",
}

export interface Education {
    id?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    description: string;
    location: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
}

export const useEducationService = () => {
    const getAll = () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ALL);
    };

    const getByDegree = (degree: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_DEGREE, { degree });
        return request(API_METHOD.GET, url);
    };

    const create = (education: Education) => {
        return request(API_METHOD.POST, AUTH_URLS.GET_ALL, education);
    };

    const update = (degree: string, education: Education) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_DEGREE, { degree });
        return request(API_METHOD.PUT, url, education);
    };

    return {
        getAll,
        getByDegree,
        create,
        update,
    }
};

export default useEducationService;