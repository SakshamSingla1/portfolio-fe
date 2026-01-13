import type { IPagination, IOption } from "./types"

export const API_METHOD = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH"
}

export const REGEX = {
    TOKEN: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*_\-+=|\\(){}[\]:;'"<>,.?/])(.{8,})$/,
    FULL_NAME: /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
    PHONE_NUMBER: /^[6-9]\d{9}$/,
    OTP: /^\d{4}$/,
    NUMBER: /[1-9][0-9]*/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    PINCODE: /^\d{6}$/,
}

export const ADMIN_ROUTES = {
    LOGIN: "/admin/login",
    REGISTER: "/admin/register",
    FORGOT_PASSWORD: "/admin/forgot-password",
    RESET_PASSWORD: "/admin/reset-password",
    PROFILE: "/admin/profile",
    
    EDUCATION: "/admin/education",
    EDUCATION_ADD: "/admin/education/add",
    EDUCATION_EDIT: "/admin/education/:id/edit",
    EDUCATION_VIEW: "/admin/education/:id",
    
    EXPERIENCE: "/admin/experience",
    EXPERIENCE_ADD: "/admin/experience/add",
    EXPERIENCE_EDIT: "/admin/experience/:id/edit",
    EXPERIENCE_VIEW: "/admin/experience/:id",
    
    PROJECTS: "/admin/projects",
    PROJECTS_ADD: "/admin/projects/add",
    PROJECTS_EDIT: "/admin/projects/:id/edit",
    PROJECTS_VIEW: "/admin/projects/:id",
    
    SKILL: "/admin/skills",
    SKILL_ADD: "/admin/skills/add",
    SKILL_EDIT: "/admin/skills/:id/edit",
    SKILL_VIEW: "/admin/skills/:id",
    
    CONTACT_US: "/admin/contact-us",

    SETTINGS: "/admin/settings",
    MAIN_SITE: "/admin/main-site",

    NAVLINKS: "/admin/navlinks",
    NAVLINKS_ADD: "/admin/navlinks/add",
    NAVLINKS_EDIT: "/admin/navlinks/:index/edit",
    NAVLINKS_VIEW: "/admin/navlinks/:index",

    TEMPLATES: "/admin/templates",
    TEMPLATES_ADD: "/admin/templates/add",
    TEMPLATES_EDIT: "/admin/templates/:name/edit",
    TEMPLATES_VIEW: "/admin/templates/:name",

    COLOR_THEME: "/admin/color-theme",
    COLOR_THEME_ADD: "/admin/color-theme/add",
    COLOR_THEME_EDIT: "/admin/color-theme/:themeName/edit",
    COLOR_THEME_VIEW: "/admin/color-theme/:themeName",
}

export const MODE = {
    VIEW: "VIEW",
    ADD: "ADD",
    UPDATE: "UPDATE",
    EDIT: "EDIT",
    REVIEW: "REVIEW",
}
   
export const initialPaginationValues: IPagination = {
    currentPage: 0,
    pageSize: 50,
    totalPages: 1,
    totalRecords: 0,
}

export const initialPaginationValuesV2: IPagination = {
    currentPage: 0,
    pageSize: 50,
    totalPages: 1,
    totalRecords: 0,
}

export const sortOptions: IOption[] = [
    { value: "name,asc", label: "Name (Ascending)" },
    { value: "name,desc", label: "Name (Descending)" },
    { value: "createdAt,asc", label: "Created Date(Ascending)" },
    { value: "createdAt,desc", label: "Created Date(Descending)" },
];

export const RESOURCES: {
    [key: string]: string
} = {
}

export const LANGUAGE_CODE: IOption[] = [
    {
        "label": "Afrikaans",
        "value": "af"
    },
    {
        "label": "Albanian",
        "value": "sq"
    },
    {
        "label": "Arabic",
        "value": "ar"
    },
    {
        "label": "Azerbaijani",
        "value": "az"
    },
    {
        "label": "Bengali",
        "value": "bn"
    },
    {
        "label": "Bulgarian",
        "value": "bg"
    },
    {
        "label": "Catalan",
        "value": "ca"
    },
    {
        "label": "Chinese (CHN)",
        "value": "zh_CN"
    },
    {
        "label": "Chinese (HKG)",
        "value": "zh_HK"
    },
    {
        "label": "Chinese (TAI)",
        "value": "zh_TW"
    },
    {
        "label": "Croatian",
        "value": "hr"
    },
    {
        "label": "Czech",
        "value": "cs"
    },
    {
        "label": "Danish",
        "value": "da"
    },
    {
        "label": "Dutch",
        "value": "nl"
    },
    {
        "label": "English",
        "value": "en"
    },
    {
        "label": "English (UK)",
        "value": "en_GB"
    },
    {
        "label": "English (US)",
        "value": "en_US"
    },
    {
        "label": "Estonian",
        "value": "et"
    },
    {
        "label": "Filipino",
        "value": "fil"
    },
    {
        "label": "Finnish",
        "value": "fi"
    },
    {
        "label": "French",
        "value": "fr"
    },
    {
        "label": "Georgian",
        "value": "ka"
    },
    {
        "label": "German",
        "value": "de"
    },
    {
        "label": "Greek",
        "value": "el"
    },
    {
        "label": "Gujarati",
        "value": "gu"
    },
    {
        "label": "Hausa",
        "value": "ha"
    },
    {
        "label": "Hebrew",
        "value": "he"
    },
    {
        "label": "Hindi",
        "value": "hi"
    },
    {
        "label": "Hungarian",
        "value": "hu"
    },
    {
        "label": "Indonesian",
        "value": "id"
    },
    {
        "label": "Irish",
        "value": "ga"
    },
    {
        "label": "Italian",
        "value": "it"
    },
    {
        "label": "Japanese",
        "value": "ja"
    },
    {
        "label": "Kannada",
        "value": "kn"
    },
    {
        "label": "Kazakh",
        "value": "kk"
    },
    {
        "label": "Kinyarwanda",
        "value": "rw_RW"
    },
    {
        "label": "Korean",
        "value": "ko"
    },
    {
        "label": "Kyrgyz (Kyrgyzstan)",
        "value": "ky_KG"
    },
    {
        "label": "Lao",
        "value": "lo"
    },
    {
        "label": "Latvian",
        "value": "lv"
    },
    {
        "label": "Lithuanian",
        "value": "lt"
    },
    {
        "label": "Macedonian",
        "value": "mk"
    },
    {
        "label": "Malay",
        "value": "ms"
    },
    {
        "label": "Malayalam",
        "value": "ml"
    },
    {
        "label": "Marathi",
        "value": "mr"
    },
    {
        "label": "Norwegian",
        "value": "nb"
    },
    {
        "label": "Persian",
        "value": "fa"
    },
    {
        "label": "Polish",
        "value": "pl"
    },
    {
        "label": "Portuguese (BR)",
        "value": "pt_BR"
    },
    {
        "label": "Portuguese (POR)",
        "value": "pt_PT"
    },
    {
        "label": "Punjabi",
        "value": "pa"
    },
    {
        "label": "Romanian",
        "value": "ro"
    },
    {
        "label": "Russian",
        "value": "ru"
    },
    {
        "label": "Serbian",
        "value": "sr"
    },
    {
        "label": "Slovak",
        "value": "sk"
    },
    {
        "label": "Slovenian",
        "value": "sl"
    },
    {
        "label": "Spanish",
        "value": "es"
    },
    {
        "label": "Spanish (ARG)",
        "value": "es_AR"
    },
    {
        "label": "Spanish (SPA)",
        "value": "es_ES"
    },
    {
        "label": "Spanish (MEX)",
        "value": "es_MX"
    },
    {
        "label": "Swahili",
        "value": "sw"
    },
    {
        "label": "Swedish",
        "value": "sv"
    },
    {
        "label": "Tamil",
        "value": "ta"
    },
    {
        "label": "Telugu",
        "value": "te"
    },
    {
        "label": "Thai",
        "value": "th"
    },
    {
        "label": "Turkish",
        "value": "tr"
    },
    {
        "label": "Ukrainian",
        "value": "uk"
    },
    {
        "label": "Urdu",
        "value": "ur"
    },
    {
        "label": "Uzbek",
        "value": "uz"
    },
    {
        "label": "Vietnamese",
        "value": "vi"
    },
    {
        "label": "Zulu",
        "value": "zu"
    }
]

export const COLORS = {
    primary50: '#E8F8F5',
    primary100: '#D1F2EB',
    primary200: '#A3E4D7',
    primary300: '#76D7C4',
    primary400: '#48C9B0',
    primary500: '#1ABC9C',
    primary600: '#17A589',
    primary700: '#148F77',
    primary800: '#0E6655',
    primary900: '#0B5345',
    primary950: '#073B32',
    primary960: '#E8F8F5',
}

export type Option = {
    value: string;
    label: string;
}

export const SKILL_LEVEL_OPTIONS: Option[] = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
];

export const SKILL_CATEGORY_OPTIONS: Option[] = [
    { value: 'FRONTEND', label: 'Frontend' },
    { value: 'BACKEND', label: 'Backend' },
    { value: 'PROGRAMMING', label: 'Programming' },
    { value: 'TOOL', label: 'Tool' },
    { value: 'DATABASE', label: 'Database' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'TESTING', label: 'Testing' },
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'CLOUD', label: 'Cloud' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'DATA_SCIENCE', label: 'Data Science' },
    { value: 'UI_UX', label: 'UI/UX' },
    { value: 'SOFT_SKILLS', label: 'Soft Skills' },
    { value: 'OTHER', label: 'Other' }
];

export const DEBOUNCE_TIME = {
    DEFAULT: 500,
}

export const DEGREE_OPTIONS: Option[] = [
    { value: 'HIGH_SCHOOL', label: '10th' },
    { value: 'SENIOR_SECONDARY', label: '12th' },
    { value: 'BACHELORS', label: 'Bachelors' },
    { value: 'MASTERS', label: 'Masters' },
    { value: 'DIPLOMA', label: 'Diploma' },
    { value: 'PHD', label: 'PhD' },
    { value: 'OTHER', label: 'Other' },
];

export const ROLES = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};