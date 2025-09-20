import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const EDUCATION_URLS = {
    GET_ALL: "/education/profile/:profileId",
    GET_BY_DEGREE: "/education/:id/:profileId",
    CREATE: "/education",
    UPDATE: "/education/:id",
};

export const GradeType = [
    { label: "CGPA", value: "CGPA" },
    { label: "Percentage", value: "Percentage" },
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
    profileId?: string;
}

export interface EducationFilterParams {
    search?: string;
    page?: number;
    size?: number;
}

export const useEducationService = () => {
    const { user } = useAuthenticatedUser();

    // ---------------- CREATE ----------------
    const create = (education: Education) =>
        request(API_METHOD.POST, EDUCATION_URLS.CREATE, user, education);

    // ---------------- UPDATE ----------------
    const update = (id: number | null, education: Education) => {
        const url = replaceUrlParams(EDUCATION_URLS.UPDATE, { id });
        return request(API_METHOD.PUT, url, user, education);
    };

    const remove = (id: number) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { id, profileId: user?.id });
        return request(API_METHOD.DELETE, url, user, null);
    };

    // ---------------- GET BY ID ----------------
    const getById = (id: number | null) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { id, profileId: user?.id });
        return request(API_METHOD.GET, url, null, null);
    };

    // ---------------- GET ALL BY PROFILE ----------------
    const getAllByProfile = (params : EducationFilterParams) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_ALL, { profileId: user?.id });
        return request(API_METHOD.GET, url, null, null, {params});
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
