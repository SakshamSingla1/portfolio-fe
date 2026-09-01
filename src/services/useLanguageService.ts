import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const LANGUAGE_URLS = {
    GET_ALL: "/languages",
    GET_BY_ID: "/languages/:id",
};

export interface Language {
    id?: number | null;
    languageName: string;
    proficiency: string;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface LanguageRequest {
    languageName: string;
    proficiency: string;
    sortOrder: number;
}

export interface LanguageFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
    [key: string]: unknown;
}

export const useLanguageService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const create = (language: LanguageRequest) =>
            request(API_METHOD.POST, LANGUAGE_URLS.GET_ALL, user, language);

        const update = (id: number | null, language: LanguageRequest) => {
            const url = replaceUrlParams(LANGUAGE_URLS.GET_BY_ID, { id });
            return request(API_METHOD.PUT, url, user, language);
        };

        const remove = (id: number | null) => {
            const url = replaceUrlParams(LANGUAGE_URLS.GET_BY_ID, { id });
            return request(API_METHOD.DELETE, url, user, null);
        };

        const getById = (id: number | null) => {
            const url = replaceUrlParams(LANGUAGE_URLS.GET_BY_ID, { id });
            return request(API_METHOD.GET, url, user, null);
        };

        const getAll = (params: LanguageFilterParams) =>
            request(API_METHOD.GET, LANGUAGE_URLS.GET_ALL, user, null, { params });

        return { create, update, remove, getById, getAll };
    }, [user]);
};
