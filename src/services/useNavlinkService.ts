import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const NAVLINK_URLS = {
    BASE: "navlinks",
    BY_ID: "navlinks/:id",
    BY_ROLE: "navlinks/role/:role",
    ALL: "navlinks/all"
};

export interface NavlinkFilterRequest {
    search?: string;
    sortDir: string;
    sortBy: string;
    page: string;
    size: string;
    status?: string;
}

export interface NavlinkRequest {
    index: string;
    name: string;
    path: string;
    icon: string;
    navGroup: string;
    status?: string;
}

export interface NavlinkResponse {
    id: string;
    index: string;
    name: string;
    path: string;
    icon: string;
    navGroup: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface GroupedNavlinkResponse {
    group: string;
    navlinks: NavlinkResponse[];
}

export const useNavlinkService = () => {
    const { user } = useAuthenticatedUser();

    const getAllNavlinks = (params: NavlinkFilterRequest) =>
        request(
            API_METHOD.GET,
            NAVLINK_URLS.ALL,
            user,
            null,
            { params }
        );

    const getNavlinkById = (id: string) =>
        request(
            API_METHOD.GET,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            user,
            null
        );

    const getNavlinkByRole = (role: string) =>
        request(
            API_METHOD.GET,
            replaceUrlParams(NAVLINK_URLS.BY_ROLE, { role }),
            user,
            null
        );

    const createNavlink = (navlink: NavlinkRequest) =>
        request(
            API_METHOD.POST,
            NAVLINK_URLS.BASE,
            user,
            navlink
        );

    const updateNavlink = (id: string, navlink: NavlinkRequest) =>
        request(
            API_METHOD.PUT,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            user,
            navlink
        );

    const deleteNavlink = (id: string) =>
        request(
            API_METHOD.DELETE,
            replaceUrlParams(NAVLINK_URLS.BY_ID, { id }),
            user,
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
