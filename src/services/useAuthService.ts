import { request } from "."
import { API_METHOD } from "../utils/constant";

export const AUTH_URLS = {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/register",
}

export interface AuthRegisterRequest {
    email:string;
    fullName:string;
    password:string;
}

export interface AuthLoginRequest {
    email:string;
    password:string;
}

export const useAuthService = () => {
    const login = (data: AuthLoginRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    }

    const signUp = (data: AuthRegisterRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.SIGNUP, null, data);
    }
    
    return {
        login,
        signUp,
    }
};