import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const EDUCATION_URLS = {
    GET_ALL: "/education/profile/:profileId", // fetch by profileId
    GET_BY_DEGREE: "/education/:degree/:profileId",
    CREATE: "/education",
    UPDATE: "/education/:degree",
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
    const update = (degree: string, education: Education) => {
        const url = replaceUrlParams(EDUCATION_URLS.UPDATE, { degree });
        return request(API_METHOD.PUT, url, user, education);
    };

    // ---------------- GET BY DEGREE ----------------
    const getByDegree = (degree: string) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_BY_DEGREE, { degree, profileId: user?.id });
        return request(API_METHOD.GET, url, user, null);
    };

    // ---------------- GET ALL BY PROFILE ----------------
    const getAllByProfile = (params : EducationFilterParams) => {
        const url = replaceUrlParams(EDUCATION_URLS.GET_ALL, { profileId: user?.id });
        return request(API_METHOD.GET, url, user, null, {params});
    };

    return {
        create,
        update,
        getByDegree,
        getAllByProfile,
    };
};

export default useEducationService;
