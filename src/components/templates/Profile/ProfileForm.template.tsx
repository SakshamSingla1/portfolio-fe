import React, { useEffect, useMemo, useState } from "react";
import { InputAdornment } from "@mui/material";
import type { FormikProps } from "formik";
import { FiUser,FiMail,FiMapPin,FiPhone,FiBriefcase,FiImage,FiInfo} from "react-icons/fi";
import TextFieldV2 from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import AutoCompleteInput, { type AutoCompleteOption } from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import { useProfileService } from "../../../services/useProfileService";
import { useColorThemeService, type ColorTheme, type ColorThemeFilterRequest} from "../../../services/useColorThemeService";
import type { ProfileRequest, ImageUploadResponse,} from "../../../services/useProfileService";
import { Status, useColors, HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { IoMdCloudUpload } from "react-icons/io";
import DocumentUpload from "../../atoms/DocumentUpload/DocumentUpload";
import { useResumeService, type DocumentUploadResponse, type ResumeSearchParams } from "../../../services/useResumeService";
import { usePublicResumeService } from "../../../services/usePublicResumeService";

const SectionCard = ({ title, subtitle, icon: Icon, actions, children,}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 space-y-6" style={{ borderColor: colors.neutral200 }}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: colors.primary50 }}>
            <Icon className="w-8 h-8" style={{ color: colors.primary600 }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: colors.neutral900 }}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.neutral500 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </header>
      <div>{children}</div>
    </section>
  );
};

interface ProfileFormProps {
  formik: FormikProps<ProfileRequest>;
  isEditMode: boolean;
  isMobile?: boolean;
  onEditClick?: () => void;
}

const ProfileFormTemplate: React.FC<ProfileFormProps> = ({
  formik,
  isEditMode,
  onEditClick,
}) => {
  const { showSnackbar } = useSnackbar();

  const profileService = useProfileService();
  const colorThemeService = useColorThemeService();
  const resumeService = useResumeService();
  const publicResumeService = usePublicResumeService();

  const [isUploading, setIsUploading] = useState<{
    profile: boolean;
    logo: boolean;
    resume: boolean;
  }>({
    profile: false,
    logo: false,
    resume: false,
  });
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);
  const [activeResume, setActiveResume] = useState<DocumentUploadResponse | null>(null);

  const uploadProfileImage = async (file: File): Promise<ImageUploadResponse> => {
    setIsUploading(prev => ({ ...prev, profile: true }));
    try {
      const response = await profileService.uploadProfileImage(file);
      if (response.status === HTTP_STATUS.OK) {
        formik.setFieldValue("profileImageUrl", response.data.data.url);
        formik.setFieldValue("profileImagePublicId", response.data.data.publicId);
        showSnackbar("success", "Profile image uploaded");
        return response.data.data;
      }
      throw new Error();
    } catch {
      showSnackbar("error", "Profile image upload failed");
      throw new Error();
    } finally {
      setIsUploading(prev => ({ ...prev, profile: false }));
    }
  };

  const uploadLogo = async (file: File): Promise<ImageUploadResponse> => {
    setIsUploading(prev => ({ ...prev, logo: true }));
    try {
      const response = await profileService.uploadLogo(file);
      if (response.status === HTTP_STATUS.OK) {
        formik.setFieldValue("logoUrl", response.data.data.url);
        formik.setFieldValue("logoPublicId", response.data.data.publicId);
        showSnackbar("success", "Logo uploaded");
        return response.data.data;
      }
      throw new Error();
    } catch {
      showSnackbar("error", "Logo upload failed");
      throw new Error();
    } finally {
      setIsUploading(prev => ({ ...prev, logo: false }));
    }
  };

  const uploadResume = async (
    file: File
  ): Promise<DocumentUploadResponse> => {
    setIsUploading((s) => ({ ...s, resume: true }));
    try {
      const res = await resumeService.uploadResume(file);
      if (res.status === HTTP_STATUS.OK) {
        showSnackbar("success", "Resume uploaded");
        await loadActiveResume();
        return res.data.data;
      }
      throw new Error();
    } finally {
      setIsUploading((s) => ({ ...s, resume: false }));
    }
  };

  const loadActiveResume = async () => {
    const params: ResumeSearchParams = {
      page: "0",
      size: "1",
      status: Status.ACTIVE,
    };
    const res = await resumeService.getByProfile(params);
    if (res.status === HTTP_STATUS.OK) {
      setActiveResume(res.data.data.content?.[0] || null);
    }
  };

  const loadColorThemes = async (search = "") => {
    const params: ColorThemeFilterRequest = {
      page: "0",
      size: "10",
      search,
      status: Status.ACTIVE,
    };
    const res = await colorThemeService.getColorTheme(params);
    if (res.status === HTTP_STATUS.OK) {
      setColorThemes(res.data.data.content || []);
    }
  };

  const handleViewResume = async () => {
    const url = publicResumeService.getViewResumeUrl();
    window.open(url, "_blank");
  };

  const handleDownloadResume = async () => {
    const url = publicResumeService.getDownloadResumeUrl();
    window.location.href = url;
  };

  const themeOptions = useMemo<AutoCompleteOption[]>(
    () =>
      colorThemes.map((theme) => ({
        label: theme.themeName,
        value: theme.themeName,
      })),
    [colorThemes]
  );

  useEffect(() => {
    loadColorThemes();
  }, []);

  useEffect(() => {
    if (formik.values.userName) {
      loadActiveResume();
    }
  }, [formik.values.userName]);

  return (
    <div className="pb-6 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
        <SectionCard
          title="Profile Images"
          subtitle="Profile & branding visuals"
          icon={FiImage}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUpload
              label="Profile Image"
              value={
                formik.values.profileImageUrl
                  ? {
                      url: formik.values.profileImageUrl,
                      publicId: formik.values.profileImagePublicId,
                    }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("profileImageUrl", value?.url || "");
                formik.setFieldValue("profileImagePublicId", value?.publicId || "");
              }}
              onUpload={uploadProfileImage}
              disabled={!isEditMode || isUploading.profile}
              maxSize={5}
              aspectRatio="square"
              helperText={
                isUploading.profile
                  ? "Uploading..."
                  : "JPG / PNG · Max 5MB"
              }
            />
            <ImageUpload
              label="Logo"
              value={
                formik.values.logoUrl
                  ? {
                      url: formik.values.logoUrl,
                      publicId: formik.values.logoPublicId,
                    }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("logoUrl", value?.url || "");
                formik.setFieldValue("logoPublicId", value?.publicId || "");
              }}
              onUpload={uploadLogo}
              disabled={!isEditMode || isUploading.logo}
              maxSize={5}
              aspectRatio="wide"
              helperText={
                isUploading.logo
                  ? "Uploading..."
                  : "Brand logo · Max 5MB"
              }
            />
          </div>
        </SectionCard>
        <SectionCard
          title="Personal Information"
          subtitle="Basic contact details"
          icon={FiUser}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <TextFieldV2
                label="Full Name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                disabled={!isEditMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="md:col-span-2">
              <TextFieldV2
                label="Email"
                name="email"
                value={formik.values.email}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMail />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <TextFieldV2
              label="Professional Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              disabled={!isEditMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiBriefcase />
                  </InputAdornment>
                ),
              }}
            />
            <TextFieldV2
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              disabled={!isEditMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiPhone />
                  </InputAdornment>
                ),
              }}
            />
            <div className="md:col-span-2">
              <TextFieldV2
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                disabled={!isEditMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMapPin />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="md:col-span-2">
              <AutoCompleteInput
                label="Color Theme"
                placeHolder="Search theme"
                options={themeOptions}
                value={
                  themeOptions.find(
                    (o) => o.value === formik.values.themeName
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("themeName", option?.value || "")
                }
                onSearch={loadColorThemes}
                isDisabled={!isEditMode}
              />
            </div>
          </div>
        </SectionCard>
      </div>
      <SectionCard
        title="About & Social"
        subtitle="Summary and external links"
        icon={FiInfo}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <TextFieldV2
              label="About Me"
              name="aboutMe"
              multiline
              rows={4}
              value={formik.values.aboutMe}
              onChange={formik.handleChange}
              disabled={!isEditMode}
              helperText={`${formik.values.aboutMe?.length || 0}/500 characters`}
              inputProps={{ maxLength: 500 }}
            />
          </div>
        </div>
      </SectionCard>
      <SectionCard
        title="Resume"
        subtitle="Upload your resume to showcase your skills"
        icon={IoMdCloudUpload}
      >
        <DocumentUpload
          label="Upload Resume"
          accept=".pdf,.doc,.docx"
          disabled={!isEditMode || isUploading.resume}
          value={
            activeResume
              ? {
                  id: activeResume.id,
                  name: activeResume.fileName,
                  url: activeResume.fileUrl,
                }
              : null
          }
          onUpload={uploadResume}
          onChange={(value) => {
            if (value === null) {
              setActiveResume(null);
            }
          }}
        />

        {formik.values.userName && activeResume && (
          <div className="flex justify-between mt-4">
            <Button
              label="View Resume"
              variant="primaryContained"
              onClick={handleViewResume}
            />
            <Button
              label="Download Resume"
              variant="secondaryContained"
              onClick={handleDownloadResume}
            />
          </div>
        )}
      </SectionCard>
      {isEditMode && (
        <div className="pt-6">
          <div className="flex gap-3">
            <Button
              fullWidth
              label="Cancel"
              variant="tertiaryContained"
              onClick={onEditClick}
            />
            <Button
              fullWidth
              label="Save"
              variant="primaryContained"
              onClick={() => formik.handleSubmit()}
              loading={formik.isSubmitting}
              disabled={!formik.isValid || !formik.dirty}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFormTemplate;
