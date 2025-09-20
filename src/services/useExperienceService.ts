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

export interface ExperienceRequest {
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description: string;
  technologiesUsed: number[]; // IDs
  profileId?: number;
}

export interface ExperienceResponse {
  id?: number;
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description: string;
  technologiesUsed: SkillDropdown[]; // objects in response
}

export interface ExperienceFilterParams {
  search?: string;
  page?: number;
  size?: number;
}

export const useExperienceService = () => {
  const { user } = useAuthenticatedUser();

  // ---------------- GET ALL BY PROFILE ----------------
  const getAllByProfile = (params : ExperienceFilterParams) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_PROFILE, { profileId: user?.id });
    return request(API_METHOD.GET, url, null, null, {params});
  };

  // ---------------- GET BY ID ----------------
  const getById = (id: number | string) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id });
    return request(API_METHOD.GET, url, null, null);
  };

  // ---------------- CREATE ----------------
  const create = (experience: ExperienceRequest) =>
    request(API_METHOD.POST, EXPERIENCE_URLS.CREATE, user, experience);

  // ---------------- UPDATE ----------------
  const update = (id: number | string, experience: ExperienceRequest) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id });
    return request(API_METHOD.PUT, url, user, experience);
  };

  // ---------------- DELETE ----------------
  const remove = (id: number | string) => {
    const url = replaceUrlParams(EXPERIENCE_URLS.GET_BY_ID, { id });
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
