import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { type AuthenticatedUserType } from '../contexts/AuthenticatedUserContext';

const API_BASE_URL = import.meta.env.VITE_API_V1_URL;

axios.defaults.withCredentials = true;

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const onRefreshed = () => refreshSubscribers.forEach(cb => cb());

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axios(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(`${API_BASE_URL}/admin/auth/refresh`, {}, { withCredentials: true });
        onRefreshed();
        refreshSubscribers = [];
        isRefreshing = false;
        return axios(originalRequest);
      } catch {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.removeItem("user");
        localStorage.removeItem("defaultTheme");
        localStorage.removeItem("rolePermissions");
        localStorage.removeItem("reLoginTimestamp");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Token now sent via httpOnly cookie — no manual header needed
const setAuthHeader = (_userContext: AuthenticatedUserType | null): void => {};

export const request = async (
  method: AxiosRequestConfig['method'],
  url: string,
  userContext: AuthenticatedUserType | null,
  data?: any,
  options?: { params: { [key: string]: any } } | null,
  onUploadProgress?:any,
  baseUrl = API_BASE_URL,
  headers?: { [key: string]: string }
): Promise<any> => {


  setAuthHeader(userContext);

  try {
    const response = await axios({
      method,
      baseURL: baseUrl,
      url,
      data,
      ...(options ? options : {}),
      onUploadProgress,
      headers
    });
    return response;
  } catch (error) {
    return (error as AxiosError)?.response ?? null;
  }

}
