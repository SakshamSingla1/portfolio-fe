// src/services/useExperienceService.ts
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { SkillDropdown } from "./useSkillService";

export const AUTH_URLS = {
  GET_ALL: "/experience",
  GET_ALL_BY_ID: "/experience/:id",
};

export interface ExperienceRequest {
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description: string;
  technologiesUsed: number[]; // IDs in request
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

export const useExperienceService = () => {
  const { user } = useAuthenticatedUser();

  const getAll = () => {
    const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
    return request(API_METHOD.GET, url, null, null, null, null);
  };

  const getById = (id: string) => {
    const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
    return request(API_METHOD.GET, url, user, null, null, null);
  };

  const create = (experience: ExperienceRequest) => {
    const url = replaceUrlParams(AUTH_URLS.GET_ALL, {});
    return request(API_METHOD.POST, url, user, experience);
  };

  const update = (id: string, experience: ExperienceRequest) => {
    const url = replaceUrlParams(AUTH_URLS.GET_ALL_BY_ID, { id });
    return request(API_METHOD.PUT, url, user, experience);
  };

  return { getAll, getById, create, update };
};

export default useExperienceService;