import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PROFILE_URLS = {
    GET_BY_ID: "/profile/:id",
    UPLOAD_PROFILE_IMAGE: "/profile/:id/upload/profile-image",
    UPLOAD_LOGO: "/profile/:id/upload/logo",
}

export const VerificationStatus = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
}

export interface ImageUploadResponse {
    url: string;
    publicId: string;
}

export interface ProfileRequest {
    fullName: string;
    userName: string;
    title: string;
    aboutMe: string;
    email: string;
    phone: string;
    location: string;
    githubUrl: string;
    linkedinUrl: string;
    websiteUrl: string;
    profileImageUrl?: string;
    profileImagePublicId?: string;
    logoUrl?: string;
    logoPublicId?: string;
}

export const useProfileService = () => {
    const { user } = useAuthenticatedUser();

    const get = () => {
        const url = replaceUrlParams(PROFILE_URLS.GET_BY_ID, { id: user?.id });
        return request(API_METHOD.GET, url, null, null, null, null);
    };

    const update = (profile: ProfileRequest) => {
        const url = replaceUrlParams(PROFILE_URLS.GET_BY_ID, { id: user?.id });
        return request(API_METHOD.PUT, url, user, profile);
    };

    const uploadProfileImage = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.UPLOAD_PROFILE_IMAGE, { id: user?.id }),
            user,
            formData
        );
    };

    const uploadLogo = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.UPLOAD_LOGO, { id: user?.id }),
            user,
            formData
        );
    };

    return {
        get,
        update,
        uploadProfileImage,
        uploadLogo
    }
}
