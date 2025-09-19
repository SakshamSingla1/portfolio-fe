import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";

export const LOGO_URLS = {
  GET_ALL: "/logo",
};

export interface Logo {
  id?: number | null;
  name: string;
  url: string;
  category?: string | null;
}

export interface LogoFilterParams {
  page?: number;
  size?: number;
  search?: string;
}

export const useLogoService = () => {
  const getAll = (params: LogoFilterParams) => {
    const url = replaceUrlParams(LOGO_URLS.GET_ALL, {});
    return request(API_METHOD.GET, url, null, null, { params });
  };

  return {
    getAll,
  };
};

export default useLogoService;
