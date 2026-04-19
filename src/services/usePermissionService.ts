import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PERMISSION_URLS = {
    CREATE: "/permission",
    UPDATE: "/permission/:id",
    DELETE: "/permission/:id",
    GET_BY_ID: "/permission/:id",
    GET_ALL_PAGINATED: "/permission",
    GET_ALL_LEGACY: "/permission/all"
};

export interface PermissionRequestDTO {
    name: string;
}

export interface PermissionResponseDTO {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    createdByName: string;
    updatedByName: string;
}

export interface Permission {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface GetPermissionsParams {
    page?: number;
    size?: number;
    search?: string;
    sortBy?: string;
    sortDir?: string;
}

export const usePermissionService = () => {
    const { user } = useAuthenticatedUser();


    const createPermission = (permissionData: PermissionRequestDTO) => {
        return request(
            API_METHOD.POST,
            PERMISSION_URLS.CREATE,
            user,
            permissionData
        );
    };

    const updatePermission = (id: string, permissionData: PermissionRequestDTO) => {
        const url = replaceUrlParams(PERMISSION_URLS.UPDATE, { id });
        return request(
            API_METHOD.PUT,
            url,
            user,
            permissionData
        );
    };

    const deletePermission = (id: string) => {
        const url = replaceUrlParams(PERMISSION_URLS.DELETE, { id });
        return request(
            API_METHOD.DELETE,
            url,
            user
        );
    };

    const getPermissionById = (id: string) => {
        const url = replaceUrlParams(PERMISSION_URLS.GET_BY_ID, { id });
        return request(
            API_METHOD.GET,
            url,
            user
        );
    };

    const getAllPermissionsPaginated = (params?: GetPermissionsParams) => {
        return request(
            API_METHOD.GET,
            PERMISSION_URLS.GET_ALL_PAGINATED,
            user,
            null,
            params ? { params } : null
        );
    };

    const getAllPermissions = () => {
        return request(
            API_METHOD.GET,
            PERMISSION_URLS.GET_ALL_LEGACY,
            user
        );
    };

    return {
        createPermission,
        updatePermission,
        deletePermission,
        getPermissionById,
        getAllPermissionsPaginated,
        getAllPermissions
    };
};
