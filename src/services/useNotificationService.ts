import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const NOTIFICATION_URLS = {
    GET_ALL: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/read-all",
};

export interface NotificationResponse {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationFilterParams {
    page?: string;
    size?: string;
}

export const useNotificationService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getAll = (params: NotificationFilterParams) =>
            request(API_METHOD.GET, NOTIFICATION_URLS.GET_ALL, user, null, { params });

        const getUnreadCount = () =>
            request(API_METHOD.GET, NOTIFICATION_URLS.UNREAD_COUNT, user, null);

        const markAsRead = (id: number) => {
            const url = replaceUrlParams(NOTIFICATION_URLS.MARK_READ, { id });
            return request(API_METHOD.PUT, url, user, null);
        };

        const markAllAsRead = () =>
            request(API_METHOD.PUT, NOTIFICATION_URLS.MARK_ALL_READ, user, null);

        return {
            getAll,
            getUnreadCount,
            markAsRead,
            markAllAsRead,
        };
    }, [user]);
};

export default useNotificationService;
