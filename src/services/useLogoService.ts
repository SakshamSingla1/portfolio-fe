import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const LOGO_URLS = {
  LOGO: "/logo",
  LOGO_BY_ID: "/logo/:id",
};

export type LogoCategoryType =
  | "FRONTEND"
  | "BACKEND"
  | "PROGRAMMING"
  | "TOOL"
  | "DATABASE"
  | "DEVOPS"
  | "TESTING"
  | "MOBILE"
  | "CLOUD"
  | "SECURITY"
  | "DATA_SCIENCE"
  | "UI_UX"
  | "SOFT_SKILLS"
  | "OTHER";

export interface Logo {
  id?: string | null;
  name: string;
  url: string;
  category?: LogoCategoryType;
}

export interface LogoRequest {
  name: string;
  url: string;
  category?: LogoCategoryType | null;
}

export interface LogoFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useLogoService = () => {
  const getAll = (params: LogoFilterParams) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO, {});
    return request(API_METHOD.GET, url, null, null, { params });
  };

  const getById = (id: string) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.GET, url, null, null);
  };

  const create = (logo: LogoRequest) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO, {});
    return request(API_METHOD.POST, url, null, logo);
  };

  const update = (id: string, logo: LogoRequest) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.PUT, url, null, logo);
  };

  const remove = (id: string) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.DELETE, url, null, null);
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
};

export default useLogoService;
