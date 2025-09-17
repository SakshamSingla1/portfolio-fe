import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PROFILE_URLS = {
    GET: "/profile",
    GET_BY_ID: "/profile/:id",
};

export interface ProfileRequest {
    fullName: string;
    title: string;
    aboutMe: string;
    email: string;
    phone: string;
    location: string;
    githubUrl: string;
    linkedinUrl: string;
    websiteUrl: string;
    profileImageUrl: string;
}

export const useProfileService = () => {
    const { user } = useAuthenticatedUser();

    const get = () => {
        const url = replaceUrlParams(PROFILE_URLS.GET_BY_ID, { id: user?.id });
        return request(API_METHOD.GET, url, user, null, null, null);
    };

    const update = (profile: ProfileRequest) => {
        const url = replaceUrlParams(PROFILE_URLS.GET_BY_ID, { id: user?.id });
        return request(API_METHOD.PUT, url, user, profile);
    };

    return { get, update };
};

export default useProfileService;
