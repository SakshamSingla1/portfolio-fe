import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const AUTH_URLS = {
    GET_ALL: "/api/v1/logo",
}

export interface Logo{
    id?: number | null;
    name: string;
    url: string;
}

export interface LogoFilterParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}

export const useLogoService = () => {
    const getAll = (params: LogoFilterParams) => {
        const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
        return request(API_METHOD.GET, url, null, null, {params})
    };

    return {
        getAll,
    }
};

export default useLogoService;