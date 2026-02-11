import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEdit } from "react-icons/fi";

import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS, useColors } from "../../../utils/types";

import {
  useProfileService,
  type ProfileRequest,
} from "../../../services/useProfileService";
import { useColorThemeService } from "../../../services/useColorThemeService";

import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

import ProfileFormTemplate from "../../templates/Profile/ProfileForm.template";
import Button from "../../atoms/Button/Button";

const validationSchema = Yup.object({
  userName: Yup.string().required("User name is required"),
  fullName: Yup.string().min(3).required("Full name is required"),
  email: Yup.string().email().required("Email is required"),
  title: Yup.string().required("Title is required"),
  phone: Yup.string().required("Phone is required"),
  location: Yup.string().required("Location is required"),
<<<<<<< Updated upstream
  aboutMe: Yup.string().required("About is required").min(160, "About is too short"),
=======
  aboutMe: Yup.string().required("About is required"),
>>>>>>> Stashed changes
  profileImageUrl: Yup.string().required("Profile image is required"),
  profileImagePublicId: Yup.string().required(),
  logoUrl: Yup.string().required("Logo is required"),
  logoPublicId: Yup.string().required(),
  themeName: Yup.string().required("Theme is required"),
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const colors = useColors();
  const { showSnackbar } = useSnackbar();

  const profileService = useProfileService();
  const colorThemeService = useColorThemeService();
  const { setDefaultTheme } = useAuthenticatedUser();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formik = useFormik<ProfileRequest>({
    initialValues: {
      userName: "",
      fullName: "",
      email: "",
      title: "",
      phone: "",
      location: "",
      aboutMe: "",
      githubUrl: "",
      linkedinUrl: "",
      websiteUrl: "",
      profileImageUrl: "",
      profileImagePublicId: "",
      aboutMeImageUrl: "",
      aboutMeImagePublicId: "",
      logoUrl: "",
      logoPublicId: "",
      themeName: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await profileService.update(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar("success", response.data.message);
          navigate(ADMIN_ROUTES.PROFILE);
        }
      } catch {
        showSnackbar("error", "Failed to update profile");
      }
    },
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.get();
      if (response.status === HTTP_STATUS.OK) {
        formik.setValues(response.data.data);
      }
    } catch {
      showSnackbar("error", "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = async () => {
    try {
      const response =
        await colorThemeService.getColorThemeByThemeName(
          formik.values.themeName
        );
      if (response.status === HTTP_STATUS.OK) {
        setDefaultTheme(response.data.data);
      }
    } catch {
      showSnackbar("error", "Failed to apply theme");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (formik.values.themeName) {
      applyTheme();
    }
  }, [formik.values.themeName]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsEditMode(searchParams.get("mode") === MODE.EDIT);
  }, [searchParams]);
  
  return (
    <div className="relative">
      <div className="relative" style={{ padding: isMobile ? "20px 0px" : "32px 24px" }}>
        {!isEditMode && (
          isMobile ? (
            <button
              onClick={() =>
                navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)
              }
              className="absolute top-4 right-4 z-10"
              style={{ backgroundColor: colors.primary50 , border: `1px solid ${colors.primary200}` , borderRadius: 12 , padding: 8 , cursor: "pointer" ,color: colors.primary500}}
            >
              <FiEdit />
            </button>
          ) : (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="primaryContained"
                label="Edit Profile"
                onClick={() =>
                  navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)
                }
              />
            </div>
          )
        )}
        <h1 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>
          {isEditMode ? "Edit Profile" : "My Profile"}
        </h1>
        <p className="mt-1" style={{ color: colors.neutral700 }}>
          Manage your personal & professional information
        </p>
      </div>
      <div className="pb-10">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading profile…
          </div>
        ) : (
          <ProfileFormTemplate
            formik={formik}
            isEditMode={isEditMode}
            onEditClick={() => navigate(ADMIN_ROUTES.PROFILE)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
