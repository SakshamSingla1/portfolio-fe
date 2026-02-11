import { request } from "."
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const TEMPLATE_URLS = {
    GET_TEMPLATES: "templates",
    GET_TEMPLATE_BY_NAME: "templates/:name",
}

export interface TemplateFilterRequest {
    search?: string;
    sortDir?: string;
    sortBy?: string;
    page: string;
    size: string;
}

export interface TemplateRequest {
    name: string;
    subject: string;
    body: string;
    type: string;
    status: string;
}

export interface TemplateResponse {
    id: string;
    name: string;
    subject: string;
    body: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const useTemplateService = () => {
    const { user } = useAuthenticatedUser();

    const getAllTemplates = (params: TemplateFilterRequest) =>
        request(API_METHOD.GET, TEMPLATE_URLS.GET_TEMPLATES, user, null, { params });

    const getTemplateByName = async (name: string) => {
        return request(API_METHOD.GET, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            user, 
            null
        );
    };

    const createTemplate = async (template: TemplateRequest) => {
        return request(API_METHOD.POST, 
            TEMPLATE_URLS.GET_TEMPLATES, 
            user, 
            template
        );
    };

    const updateTemplate = async (name: string, template: TemplateRequest) => {
        return request(API_METHOD.PUT, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            user, 
            template
        );
    };

    const deleteTemplate = async (name: string) => {
        return request(API_METHOD.DELETE, 
            replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_NAME, { name }), 
            user, 
            null
        );
    };

    return {
        getAllTemplates,
        getTemplateByName,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
};