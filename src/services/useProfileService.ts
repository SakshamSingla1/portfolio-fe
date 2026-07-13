import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import useFileService from "./useFileService";

// =========================
// URLS
// =========================
export const PROFILE_URLS = {
    GET_BY_ID: "/profile",
    GET_ALL: "/profile",
    PATCH_SETTINGS: "/profile/settings",

    // Uploads (kept for reference — upload functions use useFileService directly)
    UPLOAD_PROFILE_IMAGE: "/profile/upload/profile-image",
    UPLOAD_PROFILE_LOGO: "/profile/upload/logo",
    UPLOAD_ABOUT_ME_IMAGE: "/profile/upload/about-image",

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
    availableForWork?: boolean;
    availabilityNote?: string;
    availableFrom?: string;
}

export interface UserResponse {
    id?: number | null;
    fullName: string;
    userName: string;
    email: string;
    status: string;
    roleId?: number | null;
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
    roleId: number | null;
}

export interface ProfileSettingsRequest {
    isDiscoverable?: boolean;
    digestEmailEnabled?: boolean;
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
    const fileService = useFileService();

    // =========================
    // PROFILE
    // =========================
    const get = () => {
        return request(API_METHOD.GET, PROFILE_URLS.GET_BY_ID, user);
    };

    const update = (profile: ProfileRequest) => {
        return request(API_METHOD.PUT, PROFILE_URLS.GET_BY_ID, user, profile);
    };

    const updateSettings = (settings: ProfileSettingsRequest) => {
        return request(API_METHOD.PATCH, PROFILE_URLS.PATCH_SETTINGS, user, settings);
    };

    // =========================
    // IMAGE UPLOADS
    // =========================
    const uploadProfileImage = (file: File) =>
        fileService.upload(file, user?.id ?? "", "PROFILE", { isPrimary: true, sortOrder: 0 });

    const uploadLogo = (file: File) =>
        fileService.upload(file, user?.id ?? "", "PROFILE_LOGO", { isPrimary: true, sortOrder: 0 });

    const uploadAboutMeImage = (file: File) =>
        fileService.upload(file, user?.id ?? "", "PROFILE", { isPrimary: false, sortOrder: 1, metaData: "ABOUT_ME_IMAGE" });

    // =========================
    // ADMIN APIs
    // =========================
    const getAllUsers = (params?: GetProfilesParams) => {
        return request(API_METHOD.GET, PROFILE_URLS.ADMIN_GET_ALL_USERS, user, null, params ? { params } : null);
    };

    const getUserById = (id: number | null) => {
        return request(
            API_METHOD.GET,
            replaceUrlParams(PROFILE_URLS.ADMIN_GET_USER_BY_ID, { id }),
            user
        );
    };

    const updateUserStatus = (id: number | null, body: StatusUpdateRequest) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_UPDATE_STATUS, { id }),
            user,
            body
        );
    };

    const updateUserRole = (id: number | null, body: RoleUpdateRequest) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_UPDATE_ROLE, { id }),
            user,
            body
        );
    };

    const toggleUserVerification = (id: number | null) => {
        return request(
            API_METHOD.PUT,
            replaceUrlParams(PROFILE_URLS.ADMIN_TOGGLE_VERIFY, { id }),
            user
        );
    };

    const deleteUser = (id: number | null) => {
        return request(
            API_METHOD.DELETE,
            replaceUrlParams(PROFILE_URLS.ADMIN_DELETE_USER, { id }),
            user
        );
    };

    return {
        get,
        update,
        updateSettings,
        uploadProfileImage,
        uploadLogo,
        uploadAboutMeImage,
        getAllUsers,
        getUserById,
        updateUserStatus,
        updateUserRole,
        toggleUserVerification,
        deleteUser
    };
};