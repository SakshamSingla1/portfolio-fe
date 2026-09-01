import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export interface GithubRepoItem {
    id: number;
    name: string;
    fullName: string;
    description?: string;
    url?: string;
    homepage?: string;
    language?: string;
    stars: number;
    forks: number;
    isPinned: boolean;
    isVisible: boolean;
    sortOrder: number;
}

export interface GithubIntegration {
    id: number;
    githubUsername: string;
    isActive: boolean;
    lastSyncedAt?: string;
    cachedPublicRepos: number;
    cachedFollowers: number;
    cachedTotalStars: number;
    cachedExternalPrs?: number;
    repos: GithubRepoItem[];
}

const GITHUB_URLS = {
    OAUTH_URL:    "/github/oauth/url",
    INTEGRATION:  "/github/integration",
    SYNC:         "/github/sync",
    REPO:         (id: number) => `/github/repos/${id}`,
} as const;

export const useGithubIntegrationService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getOAuthUrl = () =>
            request(API_METHOD.GET, GITHUB_URLS.OAUTH_URL, user);

        const getIntegration = () =>
            request(API_METHOD.GET, GITHUB_URLS.INTEGRATION, user);

        const sync = () =>
            request(API_METHOD.POST, GITHUB_URLS.SYNC, user);

        const disconnect = () =>
            request(API_METHOD.DELETE, GITHUB_URLS.INTEGRATION, user);

        const updateRepo = (id: number, isVisible?: boolean, sortOrder?: number) => {
            const params = new URLSearchParams();
            if (isVisible !== undefined) params.set("isVisible", String(isVisible));
            if (sortOrder !== undefined) params.set("sortOrder", String(sortOrder));
            return request(API_METHOD.PATCH, `${GITHUB_URLS.REPO(id)}?${params}`, user);
        };

        return { getOAuthUrl, getIntegration, sync, disconnect, updateRepo };
    }, [user]);
};
