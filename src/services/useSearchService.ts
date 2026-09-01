import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const SEARCH_URLS = {
    SEARCH: "/search",
};

export interface SearchResult {
    module: string;
    id: number;
    title: string;
    snippet: string | null;
    path: string;
}

export const useSearchService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const search = (query: string) =>
            request(API_METHOD.GET, SEARCH_URLS.SEARCH, user, null, { params: { q: query } });

        return { search };
    }, [user]);
};

export default useSearchService;
