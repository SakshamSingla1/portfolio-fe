import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PUBLICATION_URLS = {
    GET_ALL: "/publications",
    GET_BY_ID: "/publications/:id",
};

export interface Publication {
    id?: number | null;
    profileId?: number;
    title: string;
    type: string;
    url?: string;
    publisher?: string;
    publishedDate?: string;
    description?: string;
    coAuthors?: string;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PublicationRequest {
    title: string;
    type: string;
    url?: string;
    publisher?: string;
    publishedDate?: string;
    description?: string;
    coAuthors?: string;
    sortOrder?: number;
}

export interface PublicationFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const usePublicationService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const create = (publication: PublicationRequest) =>
            request(API_METHOD.POST, PUBLICATION_URLS.GET_ALL, user, publication);

        const update = (id: number | null, publication: PublicationRequest) => {
            const url = replaceUrlParams(PUBLICATION_URLS.GET_BY_ID, { id });
            return request(API_METHOD.PUT, url, user, publication);
        };

        const remove = (id: number | null) => {
            const url = replaceUrlParams(PUBLICATION_URLS.GET_BY_ID, { id });
            return request(API_METHOD.DELETE, url, user, null);
        };

        const getById = (id: number | null) => {
            const url = replaceUrlParams(PUBLICATION_URLS.GET_BY_ID, { id });
            return request(API_METHOD.GET, url, user, null);
        };

        const getAll = (params: PublicationFilterParams) => {
            const url = PUBLICATION_URLS.GET_ALL;
            return request(API_METHOD.GET, url, user, null, { params: params });
        };

        return {
            create,
            update,
            remove,
            getById,
            getAll,
        };
    }, [user]);
};

export default usePublicationService;
