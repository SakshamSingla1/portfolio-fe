import { getColor } from "./helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
};

export interface IOption {
    value: string | number;
    label: string | number | React.ReactNode;
}

export type MakeRouteParams = {
    params?: { [key: string]: any } | null;
    query?: { [key: string]: any } | null;
};

export const HTTP_STATUS = {
    OK: 200,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201
}

export const VerificationStatus = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
}

export const Status = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED",
}

export const VerificationStatusOptions = [
    { value: VerificationStatus.PENDING, label: "Pending" },
    { value: VerificationStatus.VERIFIED, label: "Verified" },
]

export const StatusOptions = [
    { value: Status.ACTIVE, label: "Active" },
    { value: Status.INACTIVE, label: "Inactive" },
    { value: Status.BLOCKED, label: "Blocked" },
    { value: Status.DELETED, label: "Deleted" },
]

export const AUTH_STATE = {
    LOGIN_WITH_EMAIL: "login-with-email",
    LOGIN_WITH_PHONE: "login-with-phone",
    REGISTER: "register",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password",
    OTP_VERIFICATION: "otp-verification"
} as const;

export type AUTH_STATE = typeof AUTH_STATE[keyof typeof AUTH_STATE];

import { useTheme } from "../contexts/ThemeContext";

export const useColors = () => {
    const { defaultTheme } = useAuthenticatedUser();
    const { isDark } = useTheme();

    const getThemeColor = (prefix: string, shade: number) => {
        let targetShade = shade;
        if (isDark) {
            if (shade === 0) targetShade = 950;
            else if (shade === 50) targetShade = 900;
            else if (shade === 100) targetShade = 800;
            else if (shade === 200) targetShade = 700;
            else if (shade === 300) targetShade = 600;
            else if (shade === 400) targetShade = 500;
            else if (shade === 500) targetShade = 400;
            else if (shade === 600) targetShade = 300;
            else if (shade === 700) targetShade = 200;
            else if (shade === 800) targetShade = 100;
            else if (shade === 900) targetShade = 50;
            else if (shade === 950) targetShade = 0;
        }

        const fallbacks: Record<string, Record<number, string>> = {
            primary: { 50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 400: "#34D399", 500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#064E3B" },
            secondary: { 50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC", 400: "#818CF8", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA", 800: "#3730A3", 900: "#312E81" },
            accent: { 50: "#F5F3FF", 100: "#EDE9FE", 200: "#DDD6FE", 300: "#C4B5FD", 400: "#A78BFA", 500: "#8B5CF6", 600: "#7C3AED", 700: "#6D28D9", 800: "#5B21B6", 900: "#4C1D95" },
            neutral: { 0: "#FFFFFF", 50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB", 400: "#9CA3AF", 500: "#6B7280", 600: "#4B5563", 700: "#374151", 800: "#1F2937", 900: "#111827", 950: "#030712" },
            success: { 50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 400: "#34D399", 500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#064E3B" },
            error: { 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FCA5A5", 400: "#F87171", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 800: "#991B1B", 900: "#7F1D1D" },
            warning: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F" },
        };

        const colorKey = `${prefix}${targetShade}`;
        return getColor(defaultTheme, colorKey) || fallbacks[prefix]?.[targetShade] || fallbacks[prefix]?.[shade] || "";
    };

    return {
        primary50: getThemeColor("primary", 50),
        primary100: getThemeColor("primary", 100),
        primary200: getThemeColor("primary", 200),
        primary300: getThemeColor("primary", 300),
        primary400: getThemeColor("primary", 400),
        primary500: getThemeColor("primary", 500),
        primary600: getThemeColor("primary", 600),
        primary700: getThemeColor("primary", 700),
        primary800: getThemeColor("primary", 800),
        primary900: getThemeColor("primary", 900),
        secondary50: getThemeColor("secondary", 50),
        secondary100: getThemeColor("secondary", 100),
        secondary200: getThemeColor("secondary", 200),
        secondary300: getThemeColor("secondary", 300),
        secondary400: getThemeColor("secondary", 400),
        secondary500: getThemeColor("secondary", 500),
        secondary600: getThemeColor("secondary", 600),
        secondary700: getThemeColor("secondary", 700),
        secondary800: getThemeColor("secondary", 800),
        secondary900: getThemeColor("secondary", 900),
        accent50: getThemeColor("accent", 50),
        accent100: getThemeColor("accent", 100),
        accent200: getThemeColor("accent", 200),
        accent300: getThemeColor("accent", 300),
        accent400: getThemeColor("accent", 400),
        accent500: getThemeColor("accent", 500),
        accent600: getThemeColor("accent", 600),
        accent700: getThemeColor("accent", 700),
        accent800: getThemeColor("accent", 800),
        accent900: getThemeColor("accent", 900),
        neutral0: getThemeColor("neutral", 0),
        neutral50: getThemeColor("neutral", 50),
        neutral100: getThemeColor("neutral", 100),
        neutral200: getThemeColor("neutral", 200),
        neutral300: getThemeColor("neutral", 300),
        neutral400: getThemeColor("neutral", 400),
        neutral500: getThemeColor("neutral", 500),
        neutral600: getThemeColor("neutral", 600),
        neutral700: getThemeColor("neutral", 700),
        neutral800: getThemeColor("neutral", 800),
        neutral900: getThemeColor("neutral", 900),
        neutral950: getThemeColor("neutral", 950),
        success50: getThemeColor("success", 50),
        success100: getThemeColor("success", 100),
        success200: getThemeColor("success", 200),
        success300: getThemeColor("success", 300),
        success400: getThemeColor("success", 400),
        success500: getThemeColor("success", 500),
        success600: getThemeColor("success", 600),
        success700: getThemeColor("success", 700),
        success800: getThemeColor("success", 800),
        success900: getThemeColor("success", 900),
        error50: getThemeColor("error", 50),
        error100: getThemeColor("error", 100),
        error200: getThemeColor("error", 200),
        error300: getThemeColor("error", 300),
        error400: getThemeColor("error", 400),
        error500: getThemeColor("error", 500),
        error600: getThemeColor("error", 600),
        error700: getThemeColor("error", 700),
        error800: getThemeColor("error", 800),
        error900: getThemeColor("error", 900),
        warning50: getThemeColor("warning", 50),
        warning100: getThemeColor("warning", 100),
        warning200: getThemeColor("warning", 200),
        warning300: getThemeColor("warning", 300),
        warning400: getThemeColor("warning", 400),
        warning500: getThemeColor("warning", 500),
        warning600: getThemeColor("warning", 600),
        warning700: getThemeColor("warning", 700),
        warning800: getThemeColor("warning", 800),
        warning900: getThemeColor("warning", 900),
    };
};


export const SORT_ENUM = {
    ASC: "asc",
    DESC: "desc",
}

export const ROLES = {
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
}

export const RoleOptions = [
    { value: ROLES.ADMIN, label: "Admin" },
    { value: ROLES.SUPER_ADMIN, label: "Super Admin" },
]

export interface ImageValue {
    url: string;
    publicId?: string;
}