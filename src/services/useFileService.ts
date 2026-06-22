import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const URLS = {
    UPLOAD: "/files/upload",
    GET_BY_RESOURCE: (resourceType: string, resourceId: string | number | null) =>
        `/files/${resourceType}/${resourceId}`,
    GET_BY_ID: (id: string | number | null) => `/files/${id}`,
    DELETE_BY_ID: (id: string | number | null) => `/files/${id}`,
    DELETE_BY_RESOURCE: (resourceType: string, resourceId: string | number | null) =>
        `/files/${resourceType}/${resourceId}`,
};

export interface IFileAsset {
    id: string | number | null;
    location: string | null;
    path: string;
    resourceId: string | null;
    resourceType: string;
    mimeType: string;
    metaData: string | null;
    createdAt: string;
    validityFrom: string | null;
    validityTo: string | null;
    platform: string | null;
    createdBy: string | null;
    creatorName: string | null;
    isPrimary: boolean;
    sortOrder: number;
}

export interface IFileUploadOptions {
    isPrimary?: boolean;
    sortOrder?: number;
    platform?: string;
    metaData?: string;
}

export const useFileService = () => {
    const { user } = useAuthenticatedUser();

    const upload = (
        file: File,
        resourceId: string | number | null,
        resourceType: string,
        options: IFileUploadOptions = {}
    ) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("resourceId", String(resourceId));
        formData.append("resourceType", resourceType);
        if (options.isPrimary !== undefined)
            formData.append("isPrimary", String(options.isPrimary));
        if (options.sortOrder !== undefined)
            formData.append("sortOrder", String(options.sortOrder));
        if (options.platform)
            formData.append("platform", options.platform);
        if (options.metaData)
            formData.append("metaData", options.metaData);
        return request(API_METHOD.POST, URLS.UPLOAD, user, formData);
    };

    const getByResource = (resourceId: string | number | null, resourceType: string) =>
        request(
            API_METHOD.GET,
            URLS.GET_BY_RESOURCE(resourceType, resourceId),
            user,
            null
        );

    const getById = (id: string | number | null) =>
        request(API_METHOD.GET, URLS.GET_BY_ID(id), user, null);

    const deleteFile = (id: string | number | null) =>
        request(API_METHOD.DELETE, URLS.DELETE_BY_ID(id), user, null);

    const deleteByResource = (resourceId: string | number | null, resourceType: string) =>
        request(
            API_METHOD.DELETE,
            URLS.DELETE_BY_RESOURCE(resourceType, resourceId),
            user,
            null
        );

    return { upload, getByResource, getById, deleteFile, deleteByResource };
};

export default useFileService;
