import { request } from "."
import { API_METHOD } from "../utils/constant";

export const AUTH_URLS = {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/register",
    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
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

export interface AuthForgotPasswordRequest {
    email:string;
}

export interface AuthResetPasswordRequest {
    token:string;
    newPassword:string;
}

export const useAuthService = () => {
    const login = (data: AuthLoginRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    }

    const signUp = (data: AuthRegisterRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.SIGNUP, null, data);
    }

    const forgotPassword = (data: AuthForgotPasswordRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.FORGOT_PASSWORD, null, data);
    }

    const resetPassword = (data: AuthResetPasswordRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.RESET_PASSWORD, null, data);
    }
    
    return {
        login,
        signUp,
        forgotPassword,
        resetPassword,
    }
};