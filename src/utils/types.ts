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

export const useColors = () => {
    const { defaultTheme } = useAuthenticatedUser();
    return {
        primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
        primary100: getColor(defaultTheme, "primary100") ?? "#EEF2FF",
        primary200: getColor(defaultTheme, "primary200") ?? "#EEF2FF",
        primary300: getColor(defaultTheme, "primary300") ?? "#EEF2FF",
        primary400: getColor(defaultTheme, "primary400") ?? "#EEF2FF",
        primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
        primary600: getColor(defaultTheme, "primary600") ?? "#6366F1",
        primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
        primary800: getColor(defaultTheme, "primary800") ?? "#4338CA",
        primary900: getColor(defaultTheme, "primary900") ?? "#4338CA",
        secondary50: getColor(defaultTheme, "secondary50") ?? "#EEF2FF",
        secondary100: getColor(defaultTheme, "secondary100") ?? "#EEF2FF",
        secondary200: getColor(defaultTheme, "secondary200") ?? "#EEF2FF",
        secondary300: getColor(defaultTheme, "secondary300") ?? "#EEF2FF",
        secondary400: getColor(defaultTheme, "secondary400") ?? "#EEF2FF",
        secondary500: getColor(defaultTheme, "secondary500") ?? "#EEF2FF",
        secondary600: getColor(defaultTheme, "secondary600") ?? "#EEF2FF",
        secondary700: getColor(defaultTheme, "secondary700") ?? "#EEF2FF",
        secondary800: getColor(defaultTheme, "secondary800") ?? "#EEF2FF",
        secondary900: getColor(defaultTheme, "secondary900") ?? "#EEF2FF",
        accent50: getColor(defaultTheme, "accent50") ?? "#EEF2FF",
        accent100: getColor(defaultTheme, "accent100") ?? "#EEF2FF",
        accent200: getColor(defaultTheme, "accent200") ?? "#EEF2FF",
        accent300: getColor(defaultTheme, "accent300") ?? "#EEF2FF",
        accent400: getColor(defaultTheme, "accent400") ?? "#EEF2FF",
        accent500: getColor(defaultTheme, "accent500") ?? "#EEF2FF",
        accent600: getColor(defaultTheme, "accent600") ?? "#EEF2FF",
        accent700: getColor(defaultTheme, "accent700") ?? "#EEF2FF",
        accent800: getColor(defaultTheme, "accent800") ?? "#EEF2FF",
        accent900: getColor(defaultTheme, "accent900") ?? "#EEF2FF",
        neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
        neutral100: getColor(defaultTheme, "neutral100") ?? "#F9FAFB",
        neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
        neutral300: getColor(defaultTheme, "neutral300") ?? "#E5E7EB",
        neutral400: getColor(defaultTheme, "neutral400") ?? "#E5E7EB",
        neutral500: getColor(defaultTheme, "neutral500") ?? "#E5E7EB",
        neutral600: getColor(defaultTheme, "neutral600") ?? "#E5E7EB",
        neutral700: getColor(defaultTheme, "neutral700") ?? "#E5E7EB",
        neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
        neutral900: getColor(defaultTheme, "neutral900") ?? "#1F2937",
        success50: getColor(defaultTheme, "success50") ?? "#ECFDF5",
        success100: getColor(defaultTheme, "success100") ?? "#D1FAE5",
        success200: getColor(defaultTheme, "success200") ?? "#A7F3D0",
        success300: getColor(defaultTheme, "success300") ?? "#6EE7B7",
        success400: getColor(defaultTheme, "success400") ?? "#34D399",
        success500: getColor(defaultTheme, "success500") ?? "#10B981",
        error50: getColor(defaultTheme, "error50") ?? "#FEF2F2",
        error100: getColor(defaultTheme, "error100") ?? "#FEE2E2",
        error200: getColor(defaultTheme, "error200") ?? "#FECACA",
        error300: getColor(defaultTheme, "error300") ?? "#FCA5A5",
        error400: getColor(defaultTheme, "error400") ?? "#F87171",
        error500: getColor(defaultTheme, "error500") ?? "#EF4444",
        warning50: getColor(defaultTheme, "warning50") ?? "#FFFBEB",
        warning100: getColor(defaultTheme, "warning100") ?? "#FEF3C7",
        warning200: getColor(defaultTheme, "warning200") ?? "#FDE68A",
        warning300: getColor(defaultTheme, "warning300") ?? "#FCD34D",
        warning400: getColor(defaultTheme, "warning400") ?? "#FBBF24",
        warning500: getColor(defaultTheme, "warning500") ?? "#F59E0B"
    };
};

export const SORT_ENUM = {
   NAME_ASC: "name_asc",
   NAME_DESC: "name_desc",
   CREATED_AT_ASC: "created_at_asc",
   CREATED_AT_DESC: "created_at_desc"
}