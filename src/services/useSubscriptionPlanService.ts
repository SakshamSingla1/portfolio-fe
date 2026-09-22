import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { type AuditableResponse } from "./useRoleService";

export const SUBSCRIPTION_PLAN_URLS = {
    CREATE: "/subscription-plans",
    UPDATE: "/subscription-plans/:id",
    GET_BY_ID: "/subscription-plans/:id",
    GET_ALL: "/subscription-plans",
    UPDATE_NAV_LINKS: "/subscription-plans/:id/nav-links",
    DELETE: "/subscription-plans/:id",
    PUBLIC_PLANS: "/public/subscription-plans",
};

export interface IncludedNavLink {
    navLinkId: number;
    navLinkName?: string;
}

export interface SubscriptionPlanResponseDTO extends AuditableResponse {
    id?: number | null;
    name: string;
    code: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    isDefault: boolean;
    sortOrder: number;
    status: string;
    includedNavLinks: IncludedNavLink[];
}

export interface SubscriptionPlanRequestDTO {
    name: string;
    code: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    isDefault: boolean;
    sortOrder: number;
    status: string;
}

export interface SubscriptionPlanPublicDTO {
    id: number;
    name: string;
    code: string;
    description?: string;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    isDefault: boolean;
    highlights: string[];
}

export interface GetAllSubscriptionPlansParams {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export const useSubscriptionPlanService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const createPlan = (data: SubscriptionPlanRequestDTO) => {
            return request(API_METHOD.POST, SUBSCRIPTION_PLAN_URLS.CREATE, user, data);
        };

        const updatePlan = (id: number | null, data: SubscriptionPlanRequestDTO) => {
            const url = replaceUrlParams(SUBSCRIPTION_PLAN_URLS.UPDATE, { id });
            return request(API_METHOD.PUT, url, user, data);
        };

        const getPlanById = (id: number | null) => {
            const url = replaceUrlParams(SUBSCRIPTION_PLAN_URLS.GET_BY_ID, { id });
            return request(API_METHOD.GET, url, user);
        };

        const getAllPlans = (params?: GetAllSubscriptionPlansParams) => {
            return request(
                API_METHOD.GET,
                SUBSCRIPTION_PLAN_URLS.GET_ALL,
                user,
                null,
                params ? { params } : null
            );
        };

        const updatePlanNavLinks = (id: number | null, navLinkIds: number[]) => {
            const url = replaceUrlParams(SUBSCRIPTION_PLAN_URLS.UPDATE_NAV_LINKS, { id });
            return request(API_METHOD.PUT, url, user, { navLinkIds });
        };

        const deletePlan = (id: number | null) => {
            const url = replaceUrlParams(SUBSCRIPTION_PLAN_URLS.DELETE, { id });
            return request(API_METHOD.DELETE, url, user);
        };

        const getPublicPlans = () => {
            return request(API_METHOD.GET, SUBSCRIPTION_PLAN_URLS.PUBLIC_PLANS, null);
        };

        return {
            createPlan,
            updatePlan,
            getPlanById,
            getAllPlans,
            updatePlanNavLinks,
            deletePlan,
            getPublicPlans,
        };
    }, [user]);
};
