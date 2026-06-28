import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const TEMPLATE_URLS = {
    CREATE_TEMPLATE:          "/notification-templates",
    GET_TEMPLATE_BY_ID:       "/notification-templates/:id",
    UPDATE_TEMPLATE_BY_ID:    "/notification-templates/:id",
    GET_ALL_TEMPLATES:        "/notification-templates",
    GET_TEMPLATE_VARIABLES:   "/notification-template-variables",
};

export interface INotificationTemplate {
    id: number;
    message: string;
    messageTo: string;
    subject: string;
    messageBody: string;
    emailTo: string;
    emailCc: string;
    emailBcc: string;
    emailReplyTo: string;
    template: string;
    isSms: number;
    isEmail: number;
    isWhatsapp: number;
    whatsappTemplateName: string;
    whatsappTemplateBody: string;
    additionalData: string;
    dltTemplateId: string;
    templateGroupId: number | null;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
}

export interface INotificationTemplateFormPayload {
    message?: string;
    messageTo?: string;
    subject?: string;
    messageBody?: string;
    emailTo?: string;
    emailCc?: string;
    emailBcc?: string;
    emailReplyTo?: string;
    template: string;
    isSms?: number;
    isEmail?: number;
    isWhatsapp?: number;
    whatsappTemplateName?: string;
    whatsappTemplateBody?: string;
    additionalData?: string;
    dltTemplateId?: string;
    templateGroupId?: number | null;
}

export interface ITemplateFilterRequest {
    search?: string;
    page: number;
    size: number;
    sort?: string;
    templateGroupIdString?: string;
}

export interface ITemplateVariable {
    id: number;
    variableName: string;
    htmlContent: string;
    createdAt: string;
    updatedAt: string;
}

export const useTemplateService = () => {
    const { user } = useAuthenticatedUser();

    const createTemplate = (data: INotificationTemplateFormPayload) =>
        request(API_METHOD.POST, TEMPLATE_URLS.CREATE_TEMPLATE, user, data, null, null);

    const getTemplateById = (id: number) =>
        request(API_METHOD.GET, replaceUrlParams(TEMPLATE_URLS.GET_TEMPLATE_BY_ID, { id }), user, null, null, null);

    const updateTemplateById = (id: number, data: INotificationTemplateFormPayload) =>
        request(API_METHOD.PUT, replaceUrlParams(TEMPLATE_URLS.UPDATE_TEMPLATE_BY_ID, { id }), user, data, null, null);

    const getAllTemplates = (params: ITemplateFilterRequest) =>
        request(API_METHOD.GET, TEMPLATE_URLS.GET_ALL_TEMPLATES, user, null, { params }, null);

    const getTemplateVariables = (params: ITemplateFilterRequest) =>
        request(API_METHOD.GET, TEMPLATE_URLS.GET_TEMPLATE_VARIABLES, user, null, { params }, null);

    return {
        createTemplate,
        getTemplateById,
        updateTemplateById,
        getAllTemplates,
        getTemplateVariables,
    };
};
