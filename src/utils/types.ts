export interface IUser {
    id: number;
    email: string;
    token: string;
    role?: string;
    fullName: string;
    title?: string;
    aboutMe?: string;
    phone?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    profileImageUrl?: string;
}

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
};

export interface option {
    value: string;
    label: string;
}

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


