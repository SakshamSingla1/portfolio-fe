import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const request = async (
    method: AxiosRequestConfig['method'],
    url: string,
    data?: any,
    options?: { params?: { [key: string]: any } },
    onUploadProgress?: AxiosRequestConfig['onUploadProgress'],
    headers?: { [key: string]: string },
    baseUrl: string = API_BASE_URL
): Promise<any> => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            baseURL: baseUrl,
            ...(options || {}),
            onUploadProgress,
            headers,
        });

        return response;
    } catch (error) {
        const err = error as AxiosError;

        console.error(`[HTTP ERROR] ${method?.toUpperCase()} ${url}:`, err.message);

        return err.response ?? null;
    }
};
