import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const NAVLINK_URLS = {
    GET_NAVLINKS: "navlinks",
    GET_NAVLINK_BY_ROLE_INDEX: "navlinks/:role/:index",
    GET_NAVLINK_BY_ROLE: "navlinks/role/:role",
}

export interface NavlinkFilterRequest {
    search?: string;
    sortDir: string;
    sortBy: string;
    page: string;
    size: string;
    role?: string;
    status? : string;
}

export interface NavlinkRequest {
    role: string;
    index: string;
    name: string;
    path: string;
    icon: string;
    status?: string;
}

export interface NavlinkResponse {
    id: string;
    role: string;
    index: string;
    name: string;
    path: string;
    icon: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const useNavlinkService = () => {
    const getAllNavlinks = (params: NavlinkFilterRequest) =>
        request(API_METHOD.GET, NAVLINK_URLS.GET_NAVLINKS, null, null, { params });

    const getNavlinkByRoleIndex = async (role: string, index: string) => {
        return request(API_METHOD.GET, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_ROLE_INDEX, { role, index }), null, null);
    }

    const createNavlink = async (navlink: NavlinkRequest) => {
        return request(API_METHOD.POST, NAVLINK_URLS.GET_NAVLINKS, null, navlink);
    }

    const updateNavlink = async (role: string, index: string, navlink: NavlinkRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_ROLE_INDEX, { role, index }), null, navlink);
    };

    const deleteNavlink = async (role: string, index: string) => {
        return request(API_METHOD.DELETE, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_ROLE_INDEX, { role, index }), null, null);
    };

    const getNavlinkByRole = async (role: string) => {
        return request(API_METHOD.GET, replaceUrlParams(NAVLINK_URLS.GET_NAVLINK_BY_ROLE, { role }), null, null);
    };

    return {
        getAllNavlinks,
        getNavlinkByRoleIndex,
        getNavlinkByRole,
        createNavlink,
        updateNavlink,
        deleteNavlink,
    }
}