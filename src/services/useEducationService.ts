import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

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

export const useEducationService = () => {
    const { user } = useAuthenticatedUser();
    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, null, null)
    };

    const getByDegree = (degree: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_DEGREE, { degree });
        return request(API_METHOD.GET, url, user, null, null, null);
    };

    const create = (education: Education) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, education);
    };

    const update = (degree: string, education: Education) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_DEGREE, { degree });
        return request(API_METHOD.PUT, url, user, education);
    };

    return {
        getAll,
        getByDegree,
        create,
        update,
    }
};

export default useEducationService;