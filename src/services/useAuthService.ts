import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

const AUTH_URLS = {
    LOGIN: "/admin/login",
    SIGNUP: "/admin/register",
    VERIFY_OTP: "/admin/verify-otp",
    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
    CHANGE_PASSWORD: `/admin/change-password/:id`,
    CHANGE_EMAIL: `/admin/change-email/:id`,
    VERIFY_CHANGE_EMAIL_OTP: `/admin/verify-change-email-otp/:id`,
    REQUEST_DELETE_ACCOUNT_OTP: `/admin/request-delete-profile-otp/:id`,
    DELETE_ACCOUNT: `/admin/:id`,
    SEND_OTP: "/admin/send-otp",
};

// Request Types
export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
}

export interface IVerifyOtpRequest {
    phone?: string;
    otp: string;
    newEmail?: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface IChangeEmailRequest {
    email: string;
}

export interface IPasswordRequest {
    password: string;
    otp: string;
}

export const useAuthService = () => {

    // Authentication
    const login = (data: ILoginRequest) => {
        localStorage.setItem("reLoginTimestamp", new Date().toISOString());
        sessionStorage.removeItem("sessionHandled");
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    };

    const register = (data: IRegisterRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.SIGNUP, null, data);
    };

    const verifyOtp = (data: IVerifyOtpRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.VERIFY_OTP, null, data);
    };

    // Password Management
    const forgotPassword = (data: IForgotPasswordRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.FORGOT_PASSWORD, null, data);
    };

    const resetPassword = (data: IResetPasswordRequest) => {
        return request(API_METHOD.POST, AUTH_URLS.RESET_PASSWORD, null, data);
    };

    const changePassword = (userId: string, data: IChangePasswordRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(AUTH_URLS.CHANGE_PASSWORD, { id: userId }), null, data);
    };

    // Email Management
    const changeEmail = (userId: string, data: IChangeEmailRequest) => {
        return request(API_METHOD.PUT, replaceUrlParams(AUTH_URLS.CHANGE_EMAIL, { id: userId }), null, data);
    };

    const verifyChangeEmailOtp = (userId: string, data: IVerifyOtpRequest) => {
        return request(API_METHOD.POST, replaceUrlParams(AUTH_URLS.VERIFY_CHANGE_EMAIL_OTP, { id: userId }), null, data);
    };

    // Account Management
    const requestDeleteAccountOtp = (userId: string) => {
        return request(API_METHOD.POST, replaceUrlParams(AUTH_URLS.REQUEST_DELETE_ACCOUNT_OTP, { id: userId }), null, null);
    };

    const deleteAccount = (userId: string, data: IPasswordRequest) => {
        return request(API_METHOD.DELETE, replaceUrlParams(AUTH_URLS.DELETE_ACCOUNT, { id: userId }), null, data);
    };

    // OTP
    const sendOtp = (phone: string) => {
        return request(API_METHOD.POST, AUTH_URLS.SEND_OTP, null, { phone });
    };

    return {
        // Authentication
        login,
        register,
        verifyOtp,
        
        // Password Management
        forgotPassword,
        resetPassword,
        changePassword,
        
        // Email Management
        changeEmail,
        verifyChangeEmailOtp,
        
        // Account Management
        requestDeleteAccountOtp,
        deleteAccount,
        
        // OTP
        sendOtp
    };
};