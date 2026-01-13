import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const NAVLINK_URLS = {
    GET_NAVLINKS: "nav-link",
    GET_NAVLINK_BY_INDEX: "nav-link/:index",
}

export interface NavlinkFilterRequest {
    search?: string;
    sort: string;
    page: string;
    size: string;
}

export interface NavlinkRequest {
    index: string;
    name: string;
    path: string;
    status: string;
}

export interface NavlinkResponse {
    id: string;
    index: string;
    name: string;
    path: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const useNavlinkService = () => {
    const getAllNavlinks = (params: NavlinkFilterRequest) =>
        request(API_METHOD.GET, NAVLINK_URLS.GET_NAVLINKS, null, null, { params });

    const getNavlinkByIndex = async (index: string) => {
        return request(API_METHOD.GET, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_INDEX, { index }), null, null);
    }

    const createNavlink = async (navlink: NavlinkRequest) => {
        return request(API_METHOD.POST, NAVLINK_URLS.GET_NAVLINKS, null, navlink);
    }

    const updateNavlink = async (index: string, navlink: NavlinkRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_INDEX, { index }), null, navlink);
    };

    const deleteNavlink = async (index: string) => {
        return request(API_METHOD.DELETE, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_INDEX, { index }), null, null);
    };

    return {
        getAllNavlinks,
        getNavlinkByIndex,
        createNavlink,
        updateNavlink,
        deleteNavlink,
    }
}