import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import useFileService from "./useFileService";

export const SERVICE_URLS = {
    GET_ALL: "/services",
    GET_BY_ID: "/services/:id",
};

export interface ServiceOffering {
    id?: number | null;
    title: string;
    description?: string;
    icon?: string;
    priceRange?: string;
    deliveryTime?: string;
    sortOrder?: number;
    isActive?: boolean;
    bannerUrl?: string;
    bannerPublicId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceRequest {
    title: string;
    description?: string;
    icon?: string;
    priceRange?: string;
    deliveryTime?: string;
    sortOrder?: number;
    isActive?: boolean;
    bannerUrl?: string;
    bannerPublicId?: string;
}

export interface ServiceFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
    [key: string]: unknown;
}

export const useServiceService = () => {
    const { user } = useAuthenticatedUser();
    const fileService = useFileService();

    return useMemo(() => {
        const create = (req: ServiceRequest) =>
            request(API_METHOD.POST, SERVICE_URLS.GET_ALL, user, req);

        const update = (id: number | null, req: ServiceRequest) =>
            request(API_METHOD.PUT, replaceUrlParams(SERVICE_URLS.GET_BY_ID, { id }), user, req);

        const remove = (id: number | null) =>
            request(API_METHOD.DELETE, replaceUrlParams(SERVICE_URLS.GET_BY_ID, { id }), user, null);

        const getById = (id: number | null) =>
            request(API_METHOD.GET, replaceUrlParams(SERVICE_URLS.GET_BY_ID, { id }), user, null);

        const getAll = (params: ServiceFilterParams) =>
            request(API_METHOD.GET, SERVICE_URLS.GET_ALL, user, null, { params });

        const uploadBanner = (file: File) =>
            fileService.upload(file, user?.id ?? "", "SERVICE", { isPrimary: true });

        return { create, update, remove, getById, getAll, uploadBanner };
    }, [user, fileService]);
};

export default useServiceService;
