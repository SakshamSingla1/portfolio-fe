import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { type IUser } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_V1_URL;

const setAuthHeader = (userContext: IUser | null): void => {

    if (userContext?.token) {
        axios.defaults.headers.common['Authorization'] = userContext.token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

};

export const request = async (
    method: AxiosRequestConfig['method'],
    url: string,
    userContext: IUser | null,
    data?: any,
    options?: { params: { [key: string]: any } } | null,
    onUploadProgress?: any,
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
