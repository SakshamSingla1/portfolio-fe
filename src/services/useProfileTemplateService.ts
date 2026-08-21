import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PROFILE_TEMPLATE_URLS = {
    GET_PROFILE_TEMPLATE: "profile-templates",
    GET_TEMPLATE_USERS_COUNT_BY_KEY: "profile-templates/template/:templateKey/count",
};

export type TemplateKey = "CLASSIC" | "MODERN" | "MINIMAL";

export interface ProfileTemplateRequest {
    templateKey: TemplateKey;
}

export interface ProfileTemplateResponse {
    profileId: number;
    username: string;
    templateKey: TemplateKey;
    createdAt: string;
    updatedAt: string;
}

export const useProfileTemplateService = () => {
    const { user } = useAuthenticatedUser();

    const getProfileTemplate = () => {
        return request(API_METHOD.GET, PROFILE_TEMPLATE_URLS.GET_PROFILE_TEMPLATE, user);
    };

    const assignTemplateToUser = (requestData: ProfileTemplateRequest) => {
        return request(API_METHOD.POST, PROFILE_TEMPLATE_URLS.GET_PROFILE_TEMPLATE, user, requestData);
    };

    const resetTemplate = () => {
        return request(API_METHOD.DELETE, PROFILE_TEMPLATE_URLS.GET_PROFILE_TEMPLATE, user);
    };

    const getTemplateUsersCount = (templateKey: TemplateKey) => {
        return request(API_METHOD.GET, replaceUrlParams(PROFILE_TEMPLATE_URLS.GET_TEMPLATE_USERS_COUNT_BY_KEY, { templateKey }), user);
    };

    return {
        getProfileTemplate,
        assignTemplateToUser,
        resetTemplate,
        getTemplateUsersCount,
    };
};

export default useProfileTemplateService;
