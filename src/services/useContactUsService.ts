import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { replaceUrlParams } from "../utils/helper";

export const CONTACT_US_URLS = {
    GET_BY_PROFILE: "/contact-us",
    MARK_AS_READ: "/contact-us/:id/mark-read",
    REPLY: "/contact-us/:id/reply",
};

export interface ContactUs {
    id?: number | null;
    name: string;
    email: string;
    message: string;
    phone: string;
    status: string;
    createdAt: string;
    replyMessage?: string | null;
    repliedAt?: string | null;
}

export interface ContactUsRequest {
    name: string;
    email: string;
    message: string;
    phone: string;
}

export interface ContactUsFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useContactUsService = () => {
    const { user } = useAuthenticatedUser();

    const getByProfile = (params: ContactUsFilterParams) => {
        const url = CONTACT_US_URLS.GET_BY_PROFILE;
        return request(API_METHOD.GET, url, user, null, {params});
    };

    const markAsRead = (id: number | null) => {
        const url = replaceUrlParams(CONTACT_US_URLS.MARK_AS_READ, { id });
        return request(API_METHOD.PATCH, url, user);
    };

    const reply = (id: number, message: string) => {
        const url = replaceUrlParams(CONTACT_US_URLS.REPLY, { id });
        return request(API_METHOD.POST, url, user, { message });
    };

    return {
        getByProfile,
        markAsRead,
        reply,
    };
};

export default useContactUsService;
