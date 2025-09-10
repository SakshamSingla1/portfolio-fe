import { request } from "."
import { API_METHOD } from "../utils/constant"

export const AUTH_URLS = {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/register",
    VERIFY_SIGNUP_OTP: "/admin/verify-otp",

    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
    CHANGE_PASSWORD: (id: string) => `/admin/change-password/${id}`,

    CHANGE_EMAIL: (id: string) => `/admin/change-email/${id}`,
    VERIFY_CHANGE_EMAIL_OTP: (id: string) => `/admin/verify-change-email-otp/${id}`,

    REQUEST_DELETE_ACCOUNT_OTP: (id: string) => `/admin/request-delete-profile-otp/${id}`,
    DELETE_ACCOUNT: (id: string) => `/admin/${id}`,

    RESEND_OTP : `/admin/send-otp`,
}

// ---------------- DTOs ----------------
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
    phone?: string;
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
    otp: string;
}

export interface VerifyOtpRequest {
    phone?: string;       // for signup verification
    otp: string;
    newEmail?: string;    // for change email verification
}

// ---------------- Service ----------------
export const useAuthService = () => {
    const login = (data: AuthLoginRequest) =>
        request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);

    const signUp = (data: AuthRegisterRequest) =>
        request(API_METHOD.POST, AUTH_URLS.SIGNUP, null, data);

    const verifySignUpOtp = (data: VerifyOtpRequest) =>
        request(API_METHOD.POST, AUTH_URLS.VERIFY_SIGNUP_OTP, null, data);

    const forgotPassword = (data: AuthForgotPasswordRequest) =>
        request(API_METHOD.POST, AUTH_URLS.FORGOT_PASSWORD, null, data);

    const resetPassword = (data: AuthResetPasswordRequest) =>
        request(API_METHOD.POST, AUTH_URLS.RESET_PASSWORD, null, data);

    const changePassword = (id: string, data: ChangePasswordRequest) =>
        request(API_METHOD.PUT, AUTH_URLS.CHANGE_PASSWORD(id), null, data);

    const changeEmail = (id: string, data: ChangeEmailRequest) =>
        request(API_METHOD.PUT, AUTH_URLS.CHANGE_EMAIL(id), null, data);

    const verifyChangeEmailOtp = (id: string, data: VerifyOtpRequest) =>
        request(API_METHOD.POST, AUTH_URLS.VERIFY_CHANGE_EMAIL_OTP(id), null, data);

    const requestDeleteAccountOtp = (id: string) =>
        request(API_METHOD.POST, AUTH_URLS.REQUEST_DELETE_ACCOUNT_OTP(id), null, {});

    const deleteAccount = (id: string, data: AuthDeleteAccountRequest) =>
        request(API_METHOD.DELETE, AUTH_URLS.DELETE_ACCOUNT(id), null, data);

    const resendOtp = (phone?: string) =>
        request(API_METHOD.POST, AUTH_URLS.RESEND_OTP, null, { phone });   

    return {
        login,
        signUp,
        verifySignUpOtp,
        forgotPassword,
        resetPassword,
        changePassword,
        changeEmail,
        verifyChangeEmailOtp,
        requestDeleteAccountOtp,
        deleteAccount,
        resendOtp,
    }
}
