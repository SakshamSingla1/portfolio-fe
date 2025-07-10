import { request } from "."
import { API_METHOD } from "../utils/constant"

export const AUTH_URLS = {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/register",
    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
    CHANGE_PASSWORD: (id: string) => `/admin/change-password/${id}`,
    CHANGE_EMAIL: (id: string) => `/admin/change-email/${id}`,
    DELETE_ACCOUNT: (id: string) => `/admin/${id}`
}

export interface ChangeEmailRequest {
    email: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface AuthRegisterRequest {
    email: string;
    fullName: string;
    password: string;
}

export interface AuthLoginRequest {
    email: string;
    password: string;
}

export interface AuthForgotPasswordRequest {
    email: string;
}

export interface AuthResetPasswordRequest {
    token: string;
    newPassword: string;
}
export interface AuthDeleteAccountRequest {
    password: string;
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

    const changePassword = (id: string, data: ChangePasswordRequest) => {
        return request(API_METHOD.PUT, AUTH_URLS.CHANGE_PASSWORD(id), null, data);
    }

    const changeEmail = (id: string, data: ChangeEmailRequest) => {
        return request(API_METHOD.PUT, AUTH_URLS.CHANGE_EMAIL(id), null, data);
    }

    const deleteAccount = (id: string, data: AuthDeleteAccountRequest) => {
        return request(API_METHOD.DELETE, AUTH_URLS.DELETE_ACCOUNT(id), null, data);
    }

    return {
        login,
        signUp,
        forgotPassword,
        resetPassword,
        changePassword,
        changeEmail,
        deleteAccount
    }
}