import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PROFILE_THEME_URLS = {
    GET_PROFILE_THEME: "profile-themes",
    GET_THEME_USERS_COUNT_BY_THEME_ID: "profile-themes/theme/:themeId/count",
    GET_THEME_USERS_BY_THEME_ID: "profile-themes/theme/:themeId",
}

export interface ProfileThemeRequest {
    themeId: number | null;
}

export interface ProfileThemeResponse {
    id: number | null;
    themeId: string;
    username: string;
    themeName: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    createdByName: string;
    updatedByName: string;
}

export const useProfileThemeService = () => {
    const { user } = useAuthenticatedUser();
    const getProfileTheme = async (params: ProfileThemeRequest) => {
        return request(API_METHOD.GET, PROFILE_THEME_URLS.GET_PROFILE_THEME, user, null, { params });
    }

    const getThemeUsersByThemeId = async (themeId: number | null) => {
        return request(API_METHOD.GET, replaceUrlParams(PROFILE_THEME_URLS.GET_THEME_USERS_BY_THEME_ID, { themeId }), user);
    }

    const assignThemeToUser = async (requestData: ProfileThemeRequest) => {
        return request(API_METHOD.POST, PROFILE_THEME_URLS.GET_PROFILE_THEME, user, requestData);
    }

    return {
        getProfileTheme,
        getThemeUsersByThemeId,
        assignThemeToUser,
    }
}