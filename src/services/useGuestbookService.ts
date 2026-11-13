import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const GUESTBOOK_URLS = {
    LIST: "/guestbook",
    HIDE: "/guestbook/:id/hide",
    UNHIDE: "/guestbook/:id/unhide",
    DELETE: "/guestbook/:id",
};

export interface GuestbookEntry {
    id: number;
    visitorName: string;
    message: string;
    createdAt: string;
    status: "ACTIVE" | "INACTIVE" | string;
}

export interface GuestbookListParams {
    page: string;
    size: string;
    sortDir?: string;
    sortBy?: string;
}

export const useGuestbookService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getEntries = (params: GuestbookListParams) => {
            return request(API_METHOD.GET, GUESTBOOK_URLS.LIST, user, null, { params });
        };

        const hide = (id: number) => {
            return request(API_METHOD.PUT, replaceUrlParams(GUESTBOOK_URLS.HIDE, { id }), user);
        };

        const unhide = (id: number) => {
            return request(API_METHOD.PUT, replaceUrlParams(GUESTBOOK_URLS.UNHIDE, { id }), user);
        };

        const deleteEntry = (id: number) => {
            return request(API_METHOD.DELETE, replaceUrlParams(GUESTBOOK_URLS.DELETE, { id }), user);
        };

        return { getEntries, hide, unhide, deleteEntry };
    }, [user]);
};

export default useGuestbookService;
