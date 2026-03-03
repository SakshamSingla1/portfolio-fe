import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const LOGO_URLS = {
  LOGO: "/logo",
  LOGO_BY_ID: "/logo/:id",
};

export interface Logo {
  id?: string | null;
  name: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LogoRequest {
  name: string;
  url: string;
}

export interface LogoFilterParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
}

export const useLogoService = () => {
  const { user } = useAuthenticatedUser();

  const getAll = (params: LogoFilterParams) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO, {});
    return request(API_METHOD.GET, url, user, null, { params });
  };

  const getById = (id: string | null) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.GET, url, user, null);
  };

  const create = (logo: LogoRequest) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO, {});
    return request(API_METHOD.POST, url, user, logo);
  };

  const update = (id: string, logo: LogoRequest) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.PUT, url, user, logo);
  };

  const remove = (id: string) => {
    const url = replaceUrlParams(LOGO_URLS.LOGO_BY_ID, { id });
    return request(API_METHOD.DELETE, url, user, null);
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
