import { useMemo } from "react";
import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

const URLS = {
    FAQS:        "/help-faqs",
    FAQS_MANAGE: "/help-faqs/manage",
    FAQ_ID:      "/help-faqs/:id",
};

export interface HelpFaq {
    id?: number;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
}

export const useHelpFaqService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const getFaqs           = ()                            => request(API_METHOD.GET,    URLS.FAQS, user, null);
        const getFaqsForManage  = ()                            => request(API_METHOD.GET,    URLS.FAQS_MANAGE, user, null);
        const createFaq         = (data: HelpFaq)               => request(API_METHOD.POST,   URLS.FAQS, user, data);
        const updateFaq         = (id: number, data: HelpFaq)   => request(API_METHOD.PUT,    replaceUrlParams(URLS.FAQ_ID, { id }), user, data);
        const deleteFaq         = (id: number)                  => request(API_METHOD.DELETE, replaceUrlParams(URLS.FAQ_ID, { id }), user, null);

        return { getFaqs, getFaqsForManage, createFaq, updateFaq, deleteFaq };
    }, [user]);
};

export default useHelpFaqService;
