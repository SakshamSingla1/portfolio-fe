import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

// =========================
// URLS
// =========================
export const PROFILE_URLS = {
    GET_BY_ID: "/profile",
    GET_ALL: "/profile",

    // Uploads
    UPLOAD_PROFILE_IMAGE: "/profile/:id/upload/profile-image",
    UPLOAD_LOGO: "/profile/:id/upload/logo",
    UPLOAD_ABOUT_ME_IMAGE: "/profile/:id/upload/about-me-image",

    // Admin
    ADMIN_GET_ALL_USERS: "/profile/users",
    ADMIN_GET_USER_BY_ID: "/profile/users/:id",
    ADMIN_UPDATE_STATUS: "/profile/users/:id/status",
    ADMIN_UPDATE_ROLE: "/profile/users/:id/role",
    ADMIN_TOGGLE_VERIFY: "/profile/users/:id/verify",
    ADMIN_DELETE_USER: "/profile/users/:id"
};

// =========================
// ENUMS
// =========================
export const VerificationStatus = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
};

// =========================
// TYPES
// =========================
export interface ImageUploadResponse {
    url: string;
    publicId: string;
}

export interface DocumentUploadResponse {
    id: number;
    fileName: string;
    fileUrl: string;
    status: string;
    uploadedAt: string;
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
    aboutMeImageUrl?: string;
    aboutMeImagePublicId?: string;
    logoUrl?: string;
    logoPublicId?: string;
}

export interface UserResponse {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    status: string;
    roleId: string;
    roleName: string;
    profileImageUrl: string;
    emailVerified: string;
    phoneVerified: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    createdByName: string;
    updatedByName: string;
}

export interface StatusUpdateRequest {
    status: string;
}

export interface RoleUpdateRequest {
    roleId: string;
}

export interface GetProfilesParams {
    page: number;
    size: number;
    search?: string;
    status?: string;
    roleId?: string;
    sortBy?: string;
    sortDir?: string;
}

// =========================
// SERVICE
// =========================
export const useProfileService = () => {
    const { user } = useAuthenticatedUser();

    // =========================
    // PROFILE
    // =========================
    const get = () => {
        return request(API_METHOD.GET, PROFILE_URLS.GET_BY_ID, user);
    };

    const update = (profile: ProfileRequest) => {
        return request(API_METHOD.PUT, PROFILE_URLS.GET_BY_ID, user, profile);
    };

    // =========================
    // IMAGE UPLOADS
    // =========================
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

    const uploadAboutMeImage = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.UPLOAD_ABOUT_ME_IMAGE, { id: user?.id }),
            user,
            formData
        );
    };

    // =========================
    // ADMIN APIs
    // =========================
    const getAllUsers = (params?: GetProfilesParams) => {
        return request(API_METHOD.GET, PROFILE_URLS.ADMIN_GET_ALL_USERS, user, null, params ? { params } : null);
    };

    const getUserById = (id: string) => {
        return request(
            API_METHOD.GET,
            replaceUrlParams(PROFILE_URLS.ADMIN_GET_USER_BY_ID, { id }),
            user
        );
    };

    const updateUserStatus = (id: string, body: StatusUpdateRequest) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_UPDATE_STATUS, { id }),
            user,
            body
        );
    };

    const updateUserRole = (id: string, body: RoleUpdateRequest) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_UPDATE_ROLE, { id }),
            user,
            body
        );
    };

    const toggleUserVerification = (id: string) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_TOGGLE_VERIFY, { id }),
            user
        );
    };

    return {
        get,
        update,
        uploadProfileImage,
        uploadLogo,
        uploadAboutMeImage,
        getAllUsers,
        getUserById,
        updateUserStatus,
        updateUserRole,
        toggleUserVerification
    };
};