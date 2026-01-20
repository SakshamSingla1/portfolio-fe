import { replaceUrlParams } from "../utils/helper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

export const PUBLIC_RESUME_URLS = {
  VIEW_RESUME: "/public/resume/view/:username",
  DOWNLOAD_RESUME: "/public/resume/download/:username",
};

export const usePublicResumeService = () => {
  const { user } = useAuthenticatedUser();

  const getViewResumeUrl = () =>
    `${import.meta.env.VITE_API_V1_URL}${replaceUrlParams(
      PUBLIC_RESUME_URLS.VIEW_RESUME,
      { username: user?.userName }
    )}`;

  const getDownloadResumeUrl = () =>
    `${import.meta.env.VITE_API_V1_URL}${replaceUrlParams(
      PUBLIC_RESUME_URLS.DOWNLOAD_RESUME,
      { username: user?.userName }
    )}`;

  return {
    getViewResumeUrl,
    getDownloadResumeUrl,
  };
};

export default usePublicResumeService;
