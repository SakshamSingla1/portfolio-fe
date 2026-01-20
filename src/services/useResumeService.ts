import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const RESUME_URLS = {
  UPLOAD: "/resume/upload/:profileId",
  GET_BY_PROFILE: "/resume/:profileId",
  ACTIVATE: "/resume/activate",
  DELETE: "/resume/:resumeId",
};

export interface DocumentUploadResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  status: string;
  updatedAt: string;
}

export interface ResumeSearchParams {
    search?: string;
    page?: string;
    size?: string;
    sortDir?: string;
    sortBy?: string;
    profileId?: string;
    status?: string;
}

export interface ResumeActivateRequest {
  resumeId: string;
}

export const useResumeService = () => {
  const { user } = useAuthenticatedUser();

  const uploadResume = (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request(
          API_METHOD.POST,
          replaceUrlParams(RESUME_URLS.UPLOAD, { profileId: user?.id }),
          user,
          formData
      );
  };

  const getByProfile = (params: ResumeSearchParams) => {
    const url = replaceUrlParams(RESUME_URLS.GET_BY_PROFILE, { profileId: user?.id });
    return request(API_METHOD.GET, url, user, null, { params: { ...params, profileId: user?.id } });
  };

  const activateResume = (data: ResumeActivateRequest) => {
    const url = RESUME_URLS.ACTIVATE;
    return request(API_METHOD.PUT, url, user, null, { params: { profileId: user?.id, resumeId: data.resumeId } });
  };

  const deleteResume = (resumeId: string) => {
    const url = replaceUrlParams(RESUME_URLS.DELETE, { resumeId });
    return request(API_METHOD.DELETE, url, user, null);
  };

  return {
    uploadResume,
    getByProfile,
    activateResume,
    deleteResume,
  };
};

export default useResumeService;
