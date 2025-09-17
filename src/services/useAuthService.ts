import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

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

    RESEND_OTP: `/admin/send-otp`,
};

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
    email: string;
    otp: string;
    newPassword: string;
}

export interface AuthDeleteAccountRequest {
    password: string;
}

export interface VerifyOtpRequest {
    phone?: string;       // for signup verification
    otp: string;
    newEmail?: string;    // for change email verification
}

// ---------------- Service ----------------
export const useAuthService = () => {
    const { user } = useAuthenticatedUser();
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

    const changePassword = (data: ChangePasswordRequest) =>
        request(API_METHOD.PUT, AUTH_URLS.CHANGE_PASSWORD(user?.id?.toString() || ""), null, data);

    const changeEmail = (data: ChangeEmailRequest) =>
        request(API_METHOD.PUT, AUTH_URLS.CHANGE_EMAIL(user?.id?.toString() || ""), null, data);

    const verifyChangeEmailOtp = (data: VerifyOtpRequest) =>
        request(API_METHOD.POST, AUTH_URLS.VERIFY_CHANGE_EMAIL_OTP(user?.id?.toString() || ""), null, data);

    const requestDeleteAccountOtp = () =>
        request(API_METHOD.POST, AUTH_URLS.REQUEST_DELETE_ACCOUNT_OTP(user?.id?.toString() || ""), null, {});

    const deleteAccount = () =>
        request(API_METHOD.DELETE, AUTH_URLS.DELETE_ACCOUNT(user?.id?.toString() || ""), null, {});

    const resendOtp = () =>
        request(API_METHOD.POST, AUTH_URLS.RESEND_OTP, null, { phone: user?.phone });

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
    };
};
