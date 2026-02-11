import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const CERTIFICATION_URLS = {
    GET_ALL: "/certifications",
    GET_BY_ID: "/certifications/:id",
    UPLOAD_CREDENTIAL: "/certifications/:id/upload",
};

export interface Certification {
    id?: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface CertificationRequest {
    profileId: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    status: string;
    order: string;
}

export interface CertificationFilterParams {
    search?: string;
    profileId?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useCertificationService = () => {
    const { user } = useAuthenticatedUser();
    
    const create = (certification: CertificationRequest) =>
        request(API_METHOD.POST, CERTIFICATION_URLS.GET_ALL, user, certification);

    const update = (id: string | null, certification: CertificationRequest) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, certification);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const getAll = (params : CertificationFilterParams) => {
        const url = CERTIFICATION_URLS.GET_ALL;
        return request(API_METHOD.GET, url, user, null, {params:{...params, profileId: user?.id}});
    };

    const uploadCredential = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const url = replaceUrlParams(CERTIFICATION_URLS.UPLOAD_CREDENTIAL, { id: user?.id });
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
        uploadCredential
    };
};

export default useCertificationService;
