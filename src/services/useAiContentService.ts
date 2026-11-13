import { useMemo } from "react";
import { request } from ".";
import { API_METHOD } from "../utils/constant";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const AI_CONTENT_URLS = {
    DRAFT: "/ai/draft",
};

export type ContentDraftType = "BIO" | "PROJECT_DESCRIPTION" | "EXPERIENCE_DESCRIPTION";

export interface ContentDraftRequest {
    contentType: ContentDraftType;
    prompt: string;
}

export const useAiContentService = () => {
    const { user } = useAuthenticatedUser();

    return useMemo(() => {
        const draftContent = (body: ContentDraftRequest) => {
            return request(API_METHOD.POST, AI_CONTENT_URLS.DRAFT, user, body);
        };

        return { draftContent };
    }, [user]);
};

export default useAiContentService;
