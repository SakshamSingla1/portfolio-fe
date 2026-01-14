import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { type SkillDropdown } from "./useSkillService";

export const EXPERIENCE_URLS = {
  GET_BY_PROFILE: "/experience/profile/:profileId",
  GET_BY_ID: "/experience/:id",
  CREATE: "/experience",
};

export const EmploymentStatus = {
    CURRENT: "CURRENT",
    PREVIOUS: "PREVIOUS",
    INTERNSHIP: "INTERNSHIP",
    CONTRACT: "CONTRACT",
    FREELANCE: "FREELANCE",
}

export interface ExperienceRequest {
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  employmentStatus: string;
  description: string;
  skillIds: string[];
  profileId?: string;
}

export interface ExperienceResponse {
  id?: string;
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  employmentStatus: string;
  description: string;
  skills: SkillDropdown[];
}

export interface ExperienceFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useExperienceService = () => {
  const { user } = useAuthenticatedUser();

  const getAllByProfile = (params : ExperienceFilterParams) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_PROFILE, { profileId: user?.id });
    return request(API_METHOD.GET, url, null, null, {params});
  };

  const getById = (id: string) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id : String(id) });
    return request(API_METHOD.GET, url, null, null);
  };

  const create = (experience: ExperienceRequest) =>
    request(API_METHOD.POST, EXPERIENCE_URLS.CREATE, user, experience);

  const update = (id: string, experience: ExperienceRequest) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id : String(id) });
    return request(API_METHOD.PUT, url, user, experience);
  };

  const remove = (id: string) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id : String(id) });
    return request(API_METHOD.DELETE, url, user, null);
  };

  return {
    getAllByProfile,
    getById,
    create,
    update,
    remove,
  };
};

export default useExperienceService;
