import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const TESTIMONIAL_URLS = {
    GET_ALL: "/testimonials",
    GET_BY_ID: "/testimonials/:id",
    UPLOAD_IMAGE: "/testimonials/:id/upload",
};

export interface Testimonial {
    id?: string;
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
    profileId: string;
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
    profileId?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useTestimonialService = () => {
    const { user } = useAuthenticatedUser();
    
    const create = (testimonial: TestimonialRequest) =>
        request(API_METHOD.POST, TESTIMONIAL_URLS.GET_ALL, user, testimonial);

    const update = (id: string | null, testimonial: TestimonialRequest) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.PUT, url, user, testimonial);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(TESTIMONIAL_URLS.GET_BY_ID, { id });
        return request(API_METHOD.GET, url, null, null);
    };

    const getAll = (params : TestimonialFilterParams) => {
        const url = TESTIMONIAL_URLS.GET_ALL;
        return request(API_METHOD.GET, url, null, null, {params:{...params, profileId: user?.id}});
    };

    const uploadImage = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const url = replaceUrlParams(TESTIMONIAL_URLS.UPLOAD_IMAGE, { id: user?.id });
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

export default useTestimonialService;
