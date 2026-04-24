import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const EDUCATION_URLS = {
    GET_ALL: "/education",
    GET_BY_DEGREE: "/education/:id",
};

export const GradeType = [
    { label: "CGPA", value: "CGPA" },
    { label: "Percentage", value: "%" },
    { label: "Grade", value: "Grade" },
];

export interface Education {
    id?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    description: string;
    location: string;
    gradeType?: string;
    grade?: string;
}

export interface EducationFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useEducationService = () => {
    const { user } = useAuthenticatedUser();

    const create = (education: Education) =>
        request(API_METHOD.POST, EDUCATION_URLS.GET_ALL, user, education);

    const update = (id: string | null, education: Education) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { id });
        return request(API_METHOD.PUT, url, user, education);
    };

    const remove = (id: string) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    const getById = (id: string | null) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { id });
        return request(API_METHOD.GET, url, user, null);
    };

    const getAllByProfile = (params: EducationFilterParams) => {
        const url = EDUCATION_URLS.GET_ALL;
        return request(API_METHOD.GET, url, user, null, { params });
    };

    return {
        create,
        update,
        remove,
        getById,
        getAllByProfile,
    };
};

export default useEducationService;
