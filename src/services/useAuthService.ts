import { request } from "."
import { API_METHOD } from "../utils/constant";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const AUTH_URLS = {
    REGISTER: "auth/register",
    LOGIN : "auth/login",
    VERIFY_OTP : "auth/verify-otp",
    SEND_OTP : "auth/send-otp",
    RESEND_OTP : "auth/resend-otp",
    FORGOT_PASSWORD : "auth/forgot-password",
    VALIDATE_RESET_TOKEN : "auth/validate-reset-token",
    RESET_PASSWORD : "auth/reset-password",
    CHANGE_PASSWORD : "auth/change-password",
    REQUEST_EMAIL_CHANGE : "auth/request-email-change",
    VERIFY_EMAIL_CHANGE : "auth/verify-email-change", 
}

export interface AuthRegisterDTO {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
    phone: string;
}

export interface AuthLoginDTO {
    userName?: string;
    email?: string;
    phone?: string;
    otp?: string;
    password?: string;
}

export interface AuthVerifyOtpDTO {
    phone?: string;
    email?: string;
    otp: string;
}

export interface PasswordResetConfirmDTO {
    token: string;
    newPassword: string;
    confirmPassword?: string;
}

export interface ChangePasswordDTO {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface RequestEmailChangeDTO {
    newEmail: string;
}

export interface VerifyEmailChangeDTO {
    newEmail: string;
    otp: string;
}

export const useAuthService = () => {
    const { user } = useAuthenticatedUser();

    const login = (data: AuthLoginDTO) => {
        localStorage.setItem("reLoginTimestamp", new Date().toISOString());
        sessionStorage.removeItem("sessionHandled");
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    }

    const register = async (user: AuthRegisterDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.REGISTER, null, user);
    }

    const verifyOtp = async (data: AuthVerifyOtpDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.VERIFY_OTP, null, data);
    }

    const resendOtp = async (data: {email?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.RESEND_OTP, null, data);
    }

    const sendOtp = async (data: {phone?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.SEND_OTP, null, data);
    }

    const forgotPassword = async (data: {email?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.FORGOT_PASSWORD, null, data);
    }

    const validateResetToken = async (data: {token: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.VALIDATE_RESET_TOKEN, null, data);
    }

    const resetPassword = async (data: PasswordResetConfirmDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.RESET_PASSWORD, null, data);
    }

    const changePassword = async (data: ChangePasswordDTO) => {
        return request(API_METHOD.PUT, AUTH_URLS.CHANGE_PASSWORD, user, data);
    }

    const changeEmailRequest = async (data: RequestEmailChangeDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.REQUEST_EMAIL_CHANGE, user, data);
    }

    const changeEmailVerify = async (data: VerifyEmailChangeDTO) => {
        return request(API_METHOD.PUT, AUTH_URLS.VERIFY_EMAIL_CHANGE, user, data);
    }

    return {
        login,
        register,
        verifyOtp,
        sendOtp,
        resendOtp,
        forgotPassword,
        validateResetToken,
        resetPassword,
        changePassword,
        changeEmailRequest,
        changeEmailVerify,
    }
}