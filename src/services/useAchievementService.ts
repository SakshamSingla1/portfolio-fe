import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const ACHIEVEMENT_URLS = {
    GET_ALL: "/achievements",
    GET_BY_ID: "/achievements/:id",
    UPLOAD_IMAGE: "/achievements/:id/upload",
};

export interface Achievement {
    id?: string;
    title: string;
    issuer: string;
    achievedAt: string;
    description: string;
    proofUrl: string;
    proofPublicId: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface AchievementRequest {
    profileId: string;
    title: string;
    description: string;
    issuer: string;
    achievedAt: string;
    proofUrl: string;
    proofPublicId: string;
    order: string;
    status: string;
}

export interface AchievementFilterParams {
    search?: string;
    profileId?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useAchievementService = () => {
    const { user } = useAuthenticatedUser();
    
    const create = (achievement: AchievementRequest) =>
        request(API_METHOD.POST, ACHIEVEMENT_URLS.GET_ALL, user, achievement);

    const update = (id: string | null, achievement: AchievementRequest) => {
        const url = replaceUrlParams(ACHIEVEMENT_URLS.GET_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, achievement);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(ACHIEVEMENT_URLS.GET_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(ACHIEVEMENT_URLS.GET_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const getAll = (params : AchievementFilterParams) => {
        const url = ACHIEVEMENT_URLS.GET_ALL;
        return request(API_METHOD.GET, url, user, null, {params:{...params, profileId: user?.id}});
    };

    const uploadImage = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const url = replaceUrlParams(ACHIEVEMENT_URLS.UPLOAD_IMAGE, { id: user?.id });
        return request(
            API_METHOD.POST,
            url,
            user,
            formData
        );
    };

    return {
        create,
        update,
        remove,
        getById,
        getAll,
        uploadImage
    };
};

export default useAchievementService;
