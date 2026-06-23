import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export type PageKey = "HOME" | "EDUCATION";

export interface SeoMetaDTO {
    id?: number;
    pageKey: PageKey;
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    canonicalUrl?: string;
    indexable?: boolean;
    followLinks?: boolean;
}

const SEO_URLS = {
    BASE: "seo-meta",
    BY_PAGE_KEY: (key: PageKey) => `seo-meta/${key}`,
};

export const useSeoMetaService = () => {
    const { user } = useAuthenticatedUser();

    const getAll = () => request(API_METHOD.GET, SEO_URLS.BASE, user);

    const getByPageKey = (key: PageKey) => request(API_METHOD.GET, SEO_URLS.BY_PAGE_KEY(key), user);

    const upsert = (dto: SeoMetaDTO) => request(API_METHOD.PUT, SEO_URLS.BASE, user, dto);

    return { getAll, getByPageKey, upsert };
};
