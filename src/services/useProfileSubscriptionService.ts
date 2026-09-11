import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { type AuditableResponse } from "./useRoleService";

export const PROFILE_SUBSCRIPTION_URLS = {
    ME: "/profile-subscriptions/me",
    BY_PROFILE_ID: "/profile-subscriptions/:profileId",
};

export const BillingCycle = {
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
};

export interface ProfileSubscriptionResponseDTO extends AuditableResponse {
    id?: number | null;
    profileId: number;
    planId: number;
    planName?: string;
    planCode?: string;
    status: string;
    billingCycle: string;
    startDate?: string | null;
    endDate?: string | null;
    autoRenew: boolean;
}

export interface AssignSubscriptionRequestDTO {
    planId: number;
    billingCycle: string;
    autoRenew: boolean;
}

export const useProfileSubscriptionService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getMySubscription = () => {
            return request(API_METHOD.GET, PROFILE_SUBSCRIPTION_URLS.ME, user);
        };

        const getSubscriptionByProfileId = (profileId: number | null) => {
            const url = replaceUrlParams(PROFILE_SUBSCRIPTION_URLS.BY_PROFILE_ID, { profileId });
            return request(API_METHOD.GET, url, user);
        };

        const assignPlan = (profileId: number | null, data: AssignSubscriptionRequestDTO) => {
            const url = replaceUrlParams(PROFILE_SUBSCRIPTION_URLS.BY_PROFILE_ID, { profileId });
            return request(API_METHOD.PUT, url, user, data);
        };

        return {
            getMySubscription,
            getSubscriptionByProfileId,
            assignPlan,
        };
    }, [user]);
};
