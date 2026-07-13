import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const TESTIMONIAL_LINK_URLS = {
    BASE: "/testimonial-links/",
    BY_ID: "/testimonial-links/:id",
};

export interface TestimonialLink {
    id: number;
    requesterName?: string;
    requesterEmail?: string;
    token: string;
    shareUrl: string;
    expiresAt: string;
    usedAt?: string | null;
    createdAt: string;
}

export interface CreateTestimonialLinkRequest {
    requesterName?: string;
    requesterEmail?: string;
    expiryDays?: number;
}

export const useTestimonialLinkService = () => {
    const { user } = useAuthenticatedUser();

    const createLink = (req: CreateTestimonialLinkRequest) =>
        request(API_METHOD.POST, TESTIMONIAL_LINK_URLS.BASE, user, req);

    const getLinks = () =>
        request(API_METHOD.GET, TESTIMONIAL_LINK_URLS.BASE, user, null);

    const revokeLink = (id: number) => {
        const url = replaceUrlParams(TESTIMONIAL_LINK_URLS.BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    return {
        createLink,
        getLinks,
        revokeLink,
    };
};

export default useTestimonialLinkService;
