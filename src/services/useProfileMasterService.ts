import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { ProfileRequest } from "./useProfileService";
import { ProjectResponse } from "./useProjectService";
import { ExperienceResponse } from "./useExperienceService";
import { Education } from "./useEducationService";
import { SkillDropdown } from "./useSkillService";

export const PROFILE_MASTER_URLS = {
    GET: "/profile-master/:profileId",
};

export interface ProfileMasterResponse {
    profile: ProfileRequest;
    projects: ProjectResponse[];
    experiences: ExperienceResponse[];
    educations: Education[];
    skills: SkillDropdown[];
}

export const useProfileMasterService = () => {
    const { user } = useAuthenticatedUser();

    const getProfileMaster = async (profileId: string, page = 0, size = 10, search?: string) => {
        const url = replaceUrlParams(PROFILE_MASTER_URLS.GET, { profileId });
        const params: any = { page, size };
        if (search) params.search = search;

        return request(API_METHOD.GET, url, user, null, { params });
    };

    return {
        getProfileMaster,
    };
};

export default useProfileMasterService;
