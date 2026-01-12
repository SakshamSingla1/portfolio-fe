import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { replaceUrlParams } from "../utils/helper";

export const CONTACT_US_URLS = {
    CREATE: "/contact-us",
    GET_BY_PROFILE: "/contact-us/profile/:profileId",
};

export interface ContactUs {
    id?: string;
    name: string;
    email: string;
    message: string;
    phone: string;
    createdAt: string;
}

export interface ContactUsRequest {
    name: string;
    email: string;
    message: string;
    phone: string;
    profileid: number | null;
}

export interface ContactUsFilterParams {
    search?: string;
    page?: number;
    size?: number;
    sortDir?: string;
    sortBy?: string;
}

export const useContactUsService = () => {
    const { user } = useAuthenticatedUser();

    const create = (contactUs: ContactUsRequest) =>
        request(API_METHOD.POST, CONTACT_US_URLS.CREATE, null, contactUs);

    const getByProfile = (params: ContactUsFilterParams) => {
        const url = replaceUrlParams(CONTACT_US_URLS.GET_BY_PROFILE, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, {params});
    };

    return {
        create,
        getByProfile,
    };
};

export default useContactUsService;
