import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import useFileService from "./useFileService";

export const CERTIFICATION_URLS = {
    GET_ALL: "/certifications",
    GET_BY_ID: "/certifications/:id",
    UPLOAD_CREDENTIAL: "/certifications/:id/upload",
    BULK_DELETE: "/certifications/bulk",
};

export interface Certification {
    id?: number | null;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    credentialPublicId?: string | null;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface CertificationRequest {
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    credentialPublicId: string;
    status: string;
    order: string;
}

export interface CertificationFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useCertificationService = () => {
    const { user } = useAuthenticatedUser();
    const fileService = useFileService();

    const create = (certification: CertificationRequest) =>
        request(API_METHOD.POST, CERTIFICATION_URLS.GET_ALL, user, certification);

    const update = (id: number | null, certification: CertificationRequest) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, certification);
    };

    const remove = (id: number | null) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const bulkRemove = (ids: number[]) =>
        request(API_METHOD.DELETE, CERTIFICATION_URLS.BULK_DELETE, user, { ids });

    const getById = (id: number | null) => {
        const url = replaceUrlParams(CERTIFICATION_URLS.GET_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const getAll = (params: CertificationFilterParams) => {
        const url = CERTIFICATION_URLS.GET_ALL;
        return request(API_METHOD.GET, url, user, null, { params: params });
    };

    const uploadCredential = (file: File) =>
        fileService.upload(file, user?.id ?? "", "CERTIFICATION", { isPrimary: true });

    return {
        create,
        update,
        remove,
        bulkRemove,
        getById,
        getAll,
        uploadCredential
    };
};

export default useCertificationService;
