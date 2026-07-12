import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import type { BlogTagResponse } from "./useBlogTagService";

export type { BlogTagResponse };

export const BLOG_POST_URLS = {
    BASE:         "/blog/posts",
    BY_ID:        "/blog/posts/:id",
    PUBLISH:      "/blog/posts/:id/publish",
    ARCHIVE:      "/blog/posts/:id/archive",
    COVER_UPLOAD: "/blog/posts/cover/upload",
};

export const BlogStatus = {
    DRAFT:     "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED:  "ARCHIVED",
} as const;

export type BlogStatusType = typeof BlogStatus[keyof typeof BlogStatus];

export const BlogStatusOptions = [
    { label: "Draft",     value: BlogStatus.DRAFT },
    { label: "Published", value: BlogStatus.PUBLISHED },
    { label: "Archived",  value: BlogStatus.ARCHIVED },
];

export interface BlogPostRequest {
    profileId?: number | null;
    title: string;
    slug: string;
    content?: string | null;
    excerpt?: string | null;
    status: BlogStatusType;
    readTimeMins?: number | null;
    tagIds?: number[];
}

export interface BlogPostResponse {
    id: number | null;
    profileId: number | null;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    status: BlogStatusType;
    publishedAt: string | null;
    viewCount: number;
    readTimeMins: number | null;
    coverImageUrl: string | null;
    tags: BlogTagResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface BlogPostSummary {
    id: number;
    profileId: number;
    title: string;
    slug: string;
    excerpt: string | null;
    status: BlogStatusType;
    publishedAt: string | null;
    viewCount: number;
    readTimeMins: number | null;
    coverImageUrl: string | null;
    tags: BlogTagResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface BlogPostFilterParams {
    status?: BlogStatusType | null;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export const useBlogPostService = () => {
    const { user } = useAuthenticatedUser();

    const create = (post: BlogPostRequest) =>
        request(API_METHOD.POST, BLOG_POST_URLS.BASE, user, post);

    const update = (id: number, post: BlogPostRequest) => {
        const url = replaceUrlParams(BLOG_POST_URLS.BY_ID, { id });
        return request(API_METHOD.PUT, url, user, post);
    };

    const getById = (id: number) => {
        const url = replaceUrlParams(BLOG_POST_URLS.BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const remove = (id: number) => {
        const url = replaceUrlParams(BLOG_POST_URLS.BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getAll = (params: BlogPostFilterParams) =>
        request(API_METHOD.GET, BLOG_POST_URLS.BASE, user, null, { params });

    const publish = (id: number) => {
        const url = replaceUrlParams(BLOG_POST_URLS.PUBLISH, { id });
        return request(API_METHOD.PATCH, url, user, null);
    };

    const archive = (id: number) => {
        const url = replaceUrlParams(BLOG_POST_URLS.ARCHIVE, { id });
        return request(API_METHOD.PATCH, url, user, null);
    };

    const uploadCoverImage = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(API_METHOD.POST, BLOG_POST_URLS.COVER_UPLOAD, user, formData);
    };

    return {
        create,
        update,
        getById,
        remove,
        getAll,
        publish,
        archive,
        uploadCoverImage,
    };
};

export default useBlogPostService;
