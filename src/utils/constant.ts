export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}

export const API_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS'
}

export const ADMIN_ROUTES = {
    REGISTER: '/admin/register',
    LOGIN: '/admin/login',
    FORGOT_PASSWORD: '/admin/forgot-password',
    RESET_PASSWORD: '/admin/reset-password',
    EDUCATION: '/admin/education',
    EDUCATION_ADD: '/admin/education/add',
    EDUCATION_EDIT: '/admin/education/:degree/edit',
    EDUCATION_VIEW: '/admin/education/:degree',
    CONTACT_US: '/admin/contact-us',
    PROJECTS: '/admin/projects',
    PROJECTS_ADD: '/admin/projects/add',
    PROJECTS_EDIT: '/admin/projects/:id/edit',
    PROJECTS_VIEW: '/admin/projects/:id',
    EXPERIENCE: '/admin/experience',
    EXPERIENCE_ADD: '/admin/experience/add',
    EXPERIENCE_EDIT: '/admin/experience/:id/edit',
    EXPERIENCE_VIEW: '/admin/experience/:id',
    SKILL: '/admin/skill',
    SKILL_ADD: '/admin/skill/add',
    SKILL_EDIT: '/admin/skill/:id/edit',
    SKILL_VIEW: '/admin/skill/:id',
    PROFILE: '/admin/profile',
    SETTINGS: '/admin/settings',
}

export const MAIN_ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    PROJECTS: '/projects',
    EXPERIENCE: '/experience',
    SKILL: '/skill',
    CONTACT_US: '/contact-us',
    EDUCATION: '/education',
}

export const MODE = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    VIEW: 'VIEW',
}

export type DegreeType = {
    value: string;
    label: string;
}

export const DEGREE_OPTIONS: DegreeType[] = [
    { value: 'HIGH_SCHOOL', label: '10th' },
    { value: 'SENIOR_SECONDARY', label: '12th' },
    { value: 'BACHELORS', label: 'Bachelors' },
    { value: 'MASTERS', label: 'Masters' },
    { value: 'DIPLOMA', label: 'Diploma' },
    { value: 'PHD', label: 'PhD' },
    { value: 'OTHER', label: 'Other' },
];

export const SKILL_LEVEL_OPTIONS: DegreeType[] = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
];

export const SKILL_CATEGORY_OPTIONS: DegreeType[] = [
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Tool', label: 'Tool' },
    { value: 'Soft_Skills', label: 'Soft Skills' },
];

export const NAV_ITEMS = [
    { id: 1, name: "Home", to: "/" },
    { id: 2, name: "About", to: "/about" },
    { id: 3, name: "Projects", to: "/projects" },
    { id: 4, name: "Contact", to: "/contact" },
]

export const DEBOUNCE_TIME = {
    USER_STATUS_UPDATE: 2000,
    DEFAULT: 300
}

export const COLORS = {
    primary: '#1A56DB',
    primaryLight: '#EBF5FF',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    background: '#FFFFFF',
    success: '#10B981',
    accent: '#10B981',
} as const;
