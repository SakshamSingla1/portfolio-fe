import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const BLOG_TAG_URLS = {
    BASE:  "/blog/tags",
    BY_ID: "/blog/tags/:id",
};

export interface BlogTagRequest {
    name: string;
}

export interface BlogTagResponse {
    id: number;
    name: string;
}

export interface BlogTagFilterParams {
    search?: string;
    page?: number;
    size?: number;
}

export const useBlogTagService = () => {
    const { user } = useAuthenticatedUser();

    const create = (tag: BlogTagRequest) =>
        request(API_METHOD.POST, BLOG_TAG_URLS.BASE, user, tag);

    const update = (id: number, tag: BlogTagRequest) => {
        const url = replaceUrlParams(BLOG_TAG_URLS.BY_ID, { id });
        return request(API_METHOD.PUT, url, user, tag);
    };

    const getById = (id: number) => {
        const url = replaceUrlParams(BLOG_TAG_URLS.BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const remove = (id: number) => {
        const url = replaceUrlParams(BLOG_TAG_URLS.BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getAll = (params: BlogTagFilterParams) =>
        request(API_METHOD.GET, BLOG_TAG_URLS.BASE, user, null, { params });

    return { create, update, getById, remove, getAll };
};

export default useBlogTagService;
