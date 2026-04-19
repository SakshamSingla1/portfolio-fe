import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const ROLE_URLS = {
    CREATE: "/roles",
    UPDATE: "/roles/:id",
    GET_ROLE_PERMISSIONS: "/roles/:id",
    GET_ALL_ROLES: "/roles",
    GET_USER_ROLE_PERMISSIONS: "/roles/user/:usedId"
};

export interface ModulePermissionDTO {
    navLinkId: string;
    name: string;
    path: string;
    navGroup: string;
    index: string;
    permissions: PermissionDTO[];
}

export interface PermissionDTO {
    id: string;
    name: string;
}

export interface RoleListResponseDTO {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    createdByName: string;
    updatedByName: string;
}

export interface AuditableResponse {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    createdByName: string;
    updatedByName: string;
}

export interface RolePermissionRequestDTO {
    navLinkId: string;
    permissionId: string;
}

export interface RolePermissionResponseDTO extends AuditableResponse {
    id: string;
    name: string;
    description: string;
    status: string;
    navLinks: ModulePermissionDTO[];
}

export interface RoleRequestBodyDTO {
    name: string;
    description: string;
    status: string;
    rolePermissions: RolePermissionRequestDTO[];
}

export interface GetAllRolesParams {
    search?: string;
    roleIds?: string;
    navLinkIds?: string;
    permissionIds?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export const useRoleService = () => {
    const { user } = useAuthenticatedUser();

    const createRole = (roleData: RoleRequestBodyDTO) => {
        return request(
            API_METHOD.POST,
            ROLE_URLS.CREATE,
            user,
            roleData
        );
    };

    const updateRole = (id: string, roleData: RoleRequestBodyDTO) => {
        const url = replaceUrlParams(ROLE_URLS.UPDATE, { id });
        return request(
            API_METHOD.PUT,
            url,
            user,
            roleData
        );
    };

    const getRolePermissionsByRoleId = (id: string) => {
        const url = replaceUrlParams(ROLE_URLS.GET_ROLE_PERMISSIONS, { id });
        return request(
            API_METHOD.GET,
            url,
            user
        );
    };

    const getAllRolesByCriteria = (params?: GetAllRolesParams) => {
        return request(
            API_METHOD.GET,
            ROLE_URLS.GET_ALL_ROLES,
            user,
            null,
            params ? { params } : null
        );
    };

    const getRolePermissionsByUserId = (userId: string) => {
        const url = replaceUrlParams(ROLE_URLS.GET_USER_ROLE_PERMISSIONS, { usedId: userId });
        return request(
            API_METHOD.GET,
            url,
            user
        );
    };

    return {
        createRole,
        updateRole,
        getRolePermissionsByRoleId,
        getAllRolesByCriteria,
        getRolePermissionsByUserId
    };
};
