import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const NAVLINK_URLS = {
    BASE: "navlinks",
    BY_ID: "navlinks/:id",
    BY_ROLE: "navlinks/role/:role",
};

export interface NavlinkFilterRequest {
    search?: string;
    sortDir: string;
    sortBy: string;
    page: string;
    size: string;
    role?: string;
    status?: string;
}

export interface NavlinkRequest {
    roles: string[];
    index: string;
    name: string;
    path: string;
    icon: string;
    status?: string;
}

export interface NavlinkResponse {
    id: string;
    roles: string[];
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
        request(
            API_METHOD.GET,
            NAVLINK_URLS.BASE,
            null,
            null,
            { params }
        );

    const getNavlinkById = (id: string) =>
        request(
            API_METHOD.GET,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            null,
            null
        );

    const getNavlinkByRole = (role: string) =>
        request(
            API_METHOD.GET,
            replaceUrlParams(NAVLINK_URLS.BY_ROLE, { role }),
            null,
            null
        );

    const createNavlink = (navlink: NavlinkRequest) =>
        request(
            API_METHOD.POST,
            NAVLINK_URLS.BASE,
            null,
            navlink
        );

    const updateNavlink = (id: string, navlink: NavlinkRequest) =>
        request(
            API_METHOD.PUT,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            null,
            navlink
        );

    const deleteNavlink = (id: string) =>
        request(
            API_METHOD.DELETE,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            null,
            null
        );

    return {
        getAllNavlinks,
        getNavlinkById,
        getNavlinkByRole,
        createNavlink,
        updateNavlink,
        deleteNavlink,
    };
};
