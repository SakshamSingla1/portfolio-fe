import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import useFileService from "./useFileService";

export const TESTIMONIAL_URLS = {
    GET_ALL: "/testimonials",
    GET_BY_ID: "/testimonials/:id",
    UPLOAD_IMAGE: "/testimonials/:id/upload",
};

export interface Testimonial {
    id?: number | null;
    name: string;
    message: string;
    role: string;
    company: string;
    imageId: string;
    imageUrl: string;
    linkedInUrl: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialRequest {
    name: string;
    message: string;
    role: string;
    company: string;
    imageId: string;
    imageUrl: string;
    linkedInUrl: string;
    status: string;
    order: string;
}

export interface TestimonialFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useTestimonialService = () => {
    const { user } = useAuthenticatedUser();
    const fileService = useFileService();

    const create = (testimonial: TestimonialRequest) =>
        request(API_METHOD.POST, TESTIMONIAL_URLS.GET_ALL, user, testimonial);

    const update = (id: number | null, testimonial: TestimonialRequest) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, testimonial);
    };

    const remove = (id: number | null) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getById = (id: number | null) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const getAll = (params: TestimonialFilterParams) => {
        const url = TESTIMONIAL_URLS.GET_ALL;
        return request(API_METHOD.GET, url, user, null, { params });
    };

    const uploadImage = (file: File) =>
        fileService.upload(file, user?.id ?? "", "TESTIMONIAL", { isPrimary: true });

    return {
        create,
        update,
        remove,
        getById,
        getAll,
        uploadImage
    };
};

export default useTestimonialService;
