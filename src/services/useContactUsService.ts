import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { replaceUrlParams } from "../utils/helper";

export const CONTACT_US_URLS = {
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
    profileId: string | null;
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
        const url = replaceUrlParams(CONTACT_US_URLS.GET_BY_PROFILE, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, {params});
    };

    return {
        getByProfile,
    };
};

export default useContactUsService;
