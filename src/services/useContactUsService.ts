import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const AUTH_URLS = {
    GET_ALL: "/contact-us",
    GET_ALL_BY_EMAIL: "/contact-us/:email",
}

export interface ContactUs {
    id?: string;
    name: string;
    email: string;
    message: string;
    phone: string;
    created: string;
}

export const useContactUsService = () => {
    const { user } = useAuthenticatedUser();
    const getAll = () => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, user, null, null, null)
    };

    const getByEmail = (email: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_EMAIL, { email });
        return request(API_METHOD.GET, url, user, null, null, null);
    };

    const create = (contactUs: ContactUs) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.POST, url, user, contactUs);
    };

    return {
        getAll,
        getByEmail,
        create,
    }
};

export default useContactUsService;