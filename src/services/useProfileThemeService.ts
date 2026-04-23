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
    themeId: string;
}

export interface ProfileThemeResponse {
    id: string;
    themeId: string;
    profileId: string;
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

    const getThemeUsersByThemeId = async (themeId: string) => {
        return request(API_METHOD.GET, replaceUrlParams(PROFILE_THEME_URLS.GET_THEME_USERS_BY_THEME_ID, { themeId }), user);
    }

    const assignThemeToUser = async (themeId: string) => {
        return request(API_METHOD.POST, PROFILE_THEME_URLS.GET_PROFILE_THEME, user, themeId);
    }

    return {
        getProfileTheme,
        getThemeUsersByThemeId,
        assignThemeToUser,
    }
}