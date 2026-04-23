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
    PROFILE: "/profile",

    EDUCATION: "/education",
    EDUCATION_ADD: "/education/add",
    EDUCATION_EDIT: "/education/:id/edit",
    EDUCATION_VIEW: "/education/:id",

    EXPERIENCE: "/experience",
    EXPERIENCE_ADD: "/experience/add",
    EXPERIENCE_EDIT: "/experience/:id/edit",
    EXPERIENCE_VIEW: "/experience/:id",

    PROJECTS: "/projects",
    PROJECTS_ADD: "/projects/add",
    PROJECTS_EDIT: "/projects/:id/edit",
    PROJECTS_VIEW: "/projects/:id",

    SKILL: "/skills",
    SKILL_ADD: "/skills/add",
    SKILL_EDIT: "/skills/:id/edit",
    SKILL_VIEW: "/skills/:id",

    CONTACT_US: "/messages",

    SETTINGS: "/settings",
    MAIN_SITE: "/main-site",

    NAVLINKS: "/navlinks",
    NAVLINKS_ADD: "/navlinks/add",
    NAVLINKS_EDIT: "/navlinks/:id/edit",
    NAVLINKS_VIEW: "/navlinks/:id",

    TEMPLATES: "/notifications",
    TEMPLATES_ADD: "/notifications/add",
    TEMPLATES_EDIT: "/notifications/:name/edit",
    TEMPLATES_VIEW: "/notifications/:name",

    COLOR_THEME: "/themes",
    COLOR_THEME_ADD: "/themes/add",
    COLOR_THEME_EDIT: "/themes/:id/edit",
    COLOR_THEME_VIEW: "/themes/:id",

    RESUMES: "/resumes",

    SOCIAL_LINKS: "/social-links",
    SOCIAL_LINKS_ADD: "/social-links/add",
    SOCIAL_LINKS_EDIT: "/social-links/:id/edit",
    SOCIAL_LINKS_VIEW: "/social-links/:id",

    CERTIFICATIONS: "/certifications",
    CERTIFICATIONS_ADD: "/certifications/add",
    CERTIFICATIONS_EDIT: "/certifications/:id/edit",
    CERTIFICATIONS_VIEW: "/certifications/:id",

    TESTIMONIALS: "/testimonials",
    TESTIMONIALS_ADD: "/testimonials/add",
    TESTIMONIALS_EDIT: "/testimonials/:id/edit",
    TESTIMONIALS_VIEW: "/testimonials/:id",

    ACHIEVEMENTS: "/achievements",
    ACHIEVEMENTS_ADD: "/achievements/add",
    ACHIEVEMENTS_EDIT: "/achievements/:id/edit",
    ACHIEVEMENTS_VIEW: "/achievements/:id",

    LOGO: "/logos",
    LOGO_ADD: "/logos/add",
    LOGO_EDIT: "/logos/:id/edit",
    LOGO_VIEW: "/logos/:id",

    USER: "/users",
    USER_EDIT: "/users/:id/edit",
    USER_VIEW: "/users/:id",

    ROLE: "/roles-permissions",
    ROLE_ADD: "/roles-permissions/add",
    ROLE_EDIT: "/roles-permissions/:id/edit",
    ROLE_VIEW: "/roles-permissions/:id",
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
    { value: 'DIPLOMA', label: 'Diploma' },
    { value: 'ADVANCED_DIPLOMA', label: 'Advanced Diploma' },
    { value: 'CERTIFICATION', label: 'Certification' },
    { value: 'ASSOCIATE', label: 'Associate Degree' },
    { value: 'BACHELORS', label: 'Bachelors' },
    { value: 'BTECH', label: 'Bachelor of Technology (B.Tech)' },
    { value: 'BE', label: 'Bachelor of Engineering (B.E.)' },
    { value: 'BSC', label: 'Bachelor of Science (B.Sc)' },
    { value: 'BA', label: 'Bachelor of Arts (B.A)' },
    { value: 'BCOM', label: 'Bachelor of Commerce (B.Com)' },
    { value: 'BCA', label: 'Bachelor of Computer Applications (BCA)' },
    { value: 'BBA', label: 'Bachelor of Business Administration (BBA)' },
    { value: 'MASTERS', label: 'Masters' },
    { value: 'MTECH', label: 'Master of Technology (M.Tech)' },
    { value: 'ME', label: 'Master of Engineering (M.E.)' },
    { value: 'MSC', label: 'Master of Science (M.Sc)' },
    { value: 'MA', label: 'Master of Arts (M.A)' },
    { value: 'MCOM', label: 'Master of Commerce (M.Com)' },
    { value: 'MBA', label: 'Master of Business Administration (MBA)' },
    { value: 'MCA', label: 'Master of Computer Applications (MCA)' },
    { value: 'PHD', label: 'PhD' },
    { value: 'POST_DOCTORATE', label: 'Post Doctorate' },
    { value: 'OTHER', label: 'Other' },
];


export const ROLES = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};

export const RESOURCE_STATUS = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    BLOCKED: "Blocked",
    DELETED: "Deleted",
}


export const SocialLinkPlatform = {
    GITHUB: "GITHUB",
    GITLAB: "GITLAB",
    BITBUCKET: "BITBUCKET",
    LINKEDIN: "LINKEDIN",
    STACKOVERFLOW: "STACKOVERFLOW",
    LEETCODE: "LEETCODE",
    HACKERRANK: "HACKERRANK",
    CODECHEF: "CODECHEF",
    CODEFORCES: "CODEFORCES",
    PORTFOLIO: "PORTFOLIO",
    RESUME: "RESUME",
    TWITTER: "TWITTER",
    X: "X",
    INSTAGRAM: "INSTAGRAM",
    FACEBOOK: "FACEBOOK",
    OTHER: "OTHER"
} as const;

export const SocialLinkPlatformOptions: Option[] = [
    { label: "Github", value: SocialLinkPlatform.GITHUB },
    { label: "Gitlab", value: SocialLinkPlatform.GITLAB },
    { label: "Bitbucket", value: SocialLinkPlatform.BITBUCKET },
    { label: "LinkedIn", value: SocialLinkPlatform.LINKEDIN },
    { label: "StackOverflow", value: SocialLinkPlatform.STACKOVERFLOW },
    { label: "Leetcode", value: SocialLinkPlatform.LEETCODE },
    { label: "HackerRank", value: SocialLinkPlatform.HACKERRANK },
    { label: "CodeChef", value: SocialLinkPlatform.CODECHEF },
    { label: "CodeForces", value: SocialLinkPlatform.CODEFORCES },
    { label: "Portfolio", value: SocialLinkPlatform.PORTFOLIO },
    { label: "Resume", value: SocialLinkPlatform.RESUME },
    { label: "Twitter", value: SocialLinkPlatform.TWITTER },
    { label: "X", value: SocialLinkPlatform.X },
    { label: "Instagram", value: SocialLinkPlatform.INSTAGRAM },
    { label: "Facebook", value: SocialLinkPlatform.FACEBOOK },
    { label: "Other", value: SocialLinkPlatform.OTHER }
] as const;
