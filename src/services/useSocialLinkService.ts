import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const SOCIAL_LINK_URLS = {
    SOCIAL_LINK : "/social-links",
    SOCIAL_LINK_BY_ID : "/social-links/:id"
}

export interface SocialLink {
    profileId: string;
    platform: string;
    url: string;
    order: string;
    status: string;
}

export interface SocialLinkResponse {
    id: string;
    platform: string;
    url: string;
    order: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SocialLinkFilterParams {
    profileId?: string;
    page?: string;
    size?: string;
    search?: string;
    sortDir?: string;
    sortBy?: string;
    status?: string;
}

export const useSocialLinkService = () => {
    const { user } = useAuthenticatedUser();

    const getAll = (params: SocialLinkFilterParams) => {
        const url = replaceUrlParams(SOCIAL_LINK_URLS.SOCIAL_LINK, {});
        return request(API_METHOD.GET, url, null, null, { params: { ...params, profileId: user?.id } }, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(SOCIAL_LINK_URLS.SOCIAL_LINK_BY_ID, { id });
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const create = (socialLink: SocialLink) => {
        const url = replaceUrlParams(SOCIAL_LINK_URLS.SOCIAL_LINK, {});
        return request(API_METHOD.POST, url, user, socialLink);
    };

    const update = (id: string | null, socialLink: SocialLink) => {
        const url = replaceUrlParams(SOCIAL_LINK_URLS.SOCIAL_LINK_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, socialLink);
    };

    const deleteSocialLink = (id: string) => {
        const url = replaceUrlParams(SOCIAL_LINK_URLS.SOCIAL_LINK_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    return {
        getAll,
        getById,
        create,
        update,
        deleteSocialLink,
    };
}
        