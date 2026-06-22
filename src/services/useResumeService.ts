import { API_METHOD } from "../utils/constant";
import { request } from ".";
import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const RESUME_URLS = {
  UPLOAD: "/resume/upload",
  GET_BY_PROFILE: "/resume",
  ACTIVATE: "/resume/activate",
  DELETE: "/resume/:resumeId",
};

export interface DocumentUploadResponse {
  id?: number | null;
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
  status?: string;
}

export interface ResumeActivateRequest {
  resumeid: number | null;
}

export const useResumeService = () => {
  const { user } = useAuthenticatedUser();

  const uploadResume = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(
      API_METHOD.POST,
      RESUME_URLS.UPLOAD,
      user,
      formData
    );
  };

  const getByProfile = (params: ResumeSearchParams) => {
    const url = RESUME_URLS.GET_BY_PROFILE;
    return request(API_METHOD.GET, url, user, null, { params });
  };

  const activateResume = (data: ResumeActivateRequest) => {
    const url = RESUME_URLS.ACTIVATE;
    return request(API_METHOD.PUT, url, user, null, { params: { resumeId: data.resumeid } });
  };

  const deleteResume = (resumeid: number | null) => {
    const url = replaceUrlParams(RESUME_URLS.DELETE, { resumeid });
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
