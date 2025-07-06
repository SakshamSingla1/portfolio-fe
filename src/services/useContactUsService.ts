import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

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
    const getAll = () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ALL);
    };

    const getByEmail = (email: string) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_EMAIL, { email });
        return request(API_METHOD.GET, url);
    };

    const create = (contactUs: ContactUs) => {
        return request(API_METHOD.POST, AUTH_URLS.GET_ALL, contactUs);
    };

    return {
        getAll,
        getByEmail,
        create,
    }
};

export default useContactUsService;