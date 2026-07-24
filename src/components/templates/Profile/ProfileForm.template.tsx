import React, { useEffect, useState } from "react";
import { InputAdornment, Switch } from "@mui/material";
import type { FormikProps } from "formik";
import { FiUser, FiMail, FiMapPin, FiPhone, FiBriefcase, FiImage, FiInfo, FiCheckCircle, FiCalendar } from "react-icons/fi";
import TextFieldV2 from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useProfileService } from "../../../services/useProfileService";
import type { ProfileRequest, ImageUploadResponse, } from "../../../services/useProfileService";
import { Status, useColors, HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { IoMdCloudUpload } from "react-icons/io";
import DocumentUpload from "../../atoms/DocumentUpload/DocumentUpload";
import { useResumeService, type DocumentUploadResponse, type ResumeSearchParams } from "../../../services/useResumeService";
import { usePublicResumeService } from "../../../services/usePublicResumeService";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

export const SectionCard = ({ title, subtitle, icon: Icon, actions, children, }: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <section className="rounded-2xl border px-3 py-4 sm:p-6 space-y-6" style={{ background: colors.neutral0, borderColor: colors.neutral300, boxShadow: `0 1px 4px rgba(0,0,0,0.04)` }}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: colors.primary50 }}>
            <Icon className="w-8 h-8" style={{ color: colors.primary600 }} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: colors.neutral900 }}>
              {title}
            </h2>
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

const ReadOnlyField = ({ label, value, icon: Icon, }: {
  label: string;
  value?: string | null;
  icon: React.ElementType;
}) => {
  const colors = useColors();
  const hasValue = Boolean(value && value.trim());
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold ml-2 select-none tracking-tight" style={{ color: colors.neutral700 }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 w-full"
        style={{
          borderRadius: 16,
          border: `1.5px solid ${colors.neutral200}`,
          background: colors.neutral50,
          padding: "16px 16px",
        }}
      >
        <Icon style={{ color: colors.neutral400, flexShrink: 0 }} />
        <span
          className="text-base truncate"
          style={{ color: hasValue ? colors.neutral900 : colors.neutral400, fontStyle: hasValue ? "normal" : "italic" }}
        >
          {hasValue ? value : "Not provided"}
        </span>
      </div>
    </div>
  );
};

const formatReadableDate = (value?: string | null): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
  const colors = useColors();

  const profileService = useProfileService();
  const resumeService = useResumeService();
  const publicResumeService = usePublicResumeService();

  const [isUploading, setIsUploading] = useState<{
    profile: boolean;
    logo: boolean;
    resume: boolean;
    aboutMeImage: boolean;
  }>({
    profile: false,
    logo: false,
    resume: false,
    aboutMeImage: false,
  });
  const [activeResume, setActiveResume] = useState<DocumentUploadResponse | null>(null);

  const uploadProfileImage = async (file: File): Promise<ImageUploadResponse> => {
    setIsUploading(prev => ({ ...prev, profile: true }));
    try {
      const response = await profileService.uploadProfileImage(file);
      if (response.status === HTTP_STATUS.OK) {
        const asset = response.data.data;
        formik.setFieldValue("profileImageUrl", asset.path);
        formik.setFieldValue("profileImagePublicId", asset.id);
        showSnackbar("success", "Profile image uploaded");
        return { url: asset.path, publicId: asset.id };
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
        const asset = response.data.data;
        formik.setFieldValue("logoUrl", asset.path);
        formik.setFieldValue("logoPublicId", asset.id);
        showSnackbar("success", "Logo uploaded");
        return { url: asset.path, publicId: asset.id };
      }
      throw new Error();
    } catch {
      showSnackbar("error", "Logo upload failed");
      throw new Error();
    } finally {
      setIsUploading(prev => ({ ...prev, logo: false }));
    }
  };

  const uploadAboutMeImage = async (file: File): Promise<ImageUploadResponse> => {
    setIsUploading(prev => ({ ...prev, aboutMeImage: true }));
    try {
      const response = await profileService.uploadAboutMeImage(file);
      if (response.status === HTTP_STATUS.OK) {
        const asset = response.data.data;
        formik.setFieldValue("aboutMeImageUrl", asset.path);
        formik.setFieldValue("aboutMeImagePublicId", asset.id);
        showSnackbar("success", "About me image uploaded");
        return { url: asset.path, publicId: asset.id };
      }
      throw new Error();
    } catch {
      showSnackbar("error", "About me image upload failed");
      throw new Error();
    } finally {
      setIsUploading(prev => ({ ...prev, aboutMeImage: false }));
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

  const loadActiveResume = React.useCallback(async () => {
    const params: ResumeSearchParams = {
      page: "0",
      size: "1",
      status: Status.ACTIVE,
    };
    const res = await resumeService.getByProfile(params);
    if (res.status === HTTP_STATUS.OK) {
      setActiveResume(res.data.data.content?.[0] || null);
    }
  }, [resumeService]);

  const handleViewResume = async () => {
    const url = publicResumeService.getViewResumeUrl();
    if (url) window.open(url, "_blank");
  };

  const handleDownloadResume = async () => {
    const url = publicResumeService.getDownloadResumeUrl();
    if (url) window.location.href = url;
  };

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
                  : isEditMode
                    ? "JPG / PNG · Max 5MB"
                    : undefined
              }
              error={Boolean(formik.errors.profileImageUrl && formik.touched.profileImageUrl)}
              required={isEditMode}
            />
            <ImageUpload
              label="Profile Image 2"
              value={
                formik.values.aboutMeImageUrl
                  ? {
                    url: formik.values.aboutMeImageUrl,
                    publicId: formik.values.aboutMeImagePublicId,
                  }
                  : null
              }
              onChange={(value) => {
                formik.setFieldValue("aboutMeImageUrl", value?.url || "");
                formik.setFieldValue("aboutMeImagePublicId", value?.publicId || "");
              }}
              onUpload={uploadAboutMeImage}
              disabled={!isEditMode || isUploading.aboutMeImage}
              maxSize={5}
              aspectRatio="square"
              helperText={
                isUploading.aboutMeImage
                  ? "Uploading..."
                  : isEditMode
                    ? "JPG / PNG · Max 5MB"
                    : undefined
              }
              error={Boolean(formik.errors.aboutMeImageUrl && formik.touched.aboutMeImageUrl)}
              required={isEditMode}
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
                  : isEditMode
                    ? "Brand logo · Max 5MB"
                    : undefined
              }
              error={Boolean(formik.errors.logoUrl && formik.touched.logoUrl)}
              required={isEditMode}
            />
          </div>
        </SectionCard>
        <SectionCard
          title="Personal Information"
          subtitle="Basic contact details"
          icon={FiUser}
        >
          {isEditMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <TextFieldV2
                  label="Full Name"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(formik.errors.fullName && formik.touched.fullName)}
                  helperText={Boolean(formik.errors.fullName && formik.touched.fullName) ? formik.errors.fullName : ""}
                  required
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
                  required
                  error={Boolean(formik.errors.email && formik.touched.email)}
                  helperText={Boolean(formik.errors.email && formik.touched.email) ? formik.errors.email : ""}
                />
              </div>
              <TextFieldV2
                label="Professional Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiBriefcase />
                    </InputAdornment>
                  ),
                }}
                error={Boolean(formik.errors.title && formik.touched.title)}
                helperText={Boolean(formik.errors.title && formik.touched.title) ? formik.errors.title : ""}
                required
              />
              <TextFieldV2
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiPhone />
                    </InputAdornment>
                  ),
                }}
                error={Boolean(formik.errors.phone && formik.touched.phone)}
                helperText={Boolean(formik.errors.phone && formik.touched.phone) ? formik.errors.phone : ""}
                required
              />
              <div className="md:col-span-2">
                <TextFieldV2
                  label="Location"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMapPin />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(formik.errors.location && formik.touched.location)}
                  helperText={Boolean(formik.errors.location && formik.touched.location) ? formik.errors.location : ""}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ReadOnlyField label="Full Name" value={formik.values.fullName} icon={FiUser} />
              </div>
              <div className="md:col-span-2">
                <ReadOnlyField label="Email" value={formik.values.email} icon={FiMail} />
              </div>
              <ReadOnlyField label="Professional Title" value={formik.values.title} icon={FiBriefcase} />
              <ReadOnlyField label="Phone" value={formik.values.phone} icon={FiPhone} />
              <div className="md:col-span-2">
                <ReadOnlyField label="Location" value={formik.values.location} icon={FiMapPin} />
              </div>
            </div>
          )}
        </SectionCard>
      </div>
      <SectionCard
        title="About & Social"
        subtitle="Summary and external links"
        icon={FiInfo}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <RichTextEditor
              label="About Me"
              placeholder="Tell about yourself"
              value={formik.values.aboutMe}
              onChange={(value) => formik.setFieldValue("aboutMe", value)}
              isEditMode={isEditMode}
              required={isEditMode}
              error={Boolean(formik.errors.aboutMe && formik.touched.aboutMe)}
              helperText={Boolean(formik.errors.aboutMe && formik.touched.aboutMe) ? formik.errors.aboutMe : ""}
            />
          </div>
        </div>
      </SectionCard>
      <SectionCard
        title="Availability"
        subtitle="Let recruiters know you're open to opportunities"
        icon={FiCheckCircle}
      >
        <div className="flex flex-col gap-5">
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: formik.values.availableForWork ? `${colors.success500}10` : `${colors.neutral100}`, border: `1.5px solid ${formik.values.availableForWork ? colors.success500 : colors.neutral200}`, transition: "all 0.2s" }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>Open to work</p>
              <p className="text-xs mt-0.5" style={{ color: colors.neutral500 }}>Show an "Available" badge on your public profile</p>
            </div>
            <Switch
              checked={formik.values.availableForWork ?? false}
              onChange={(e) => formik.setFieldValue("availableForWork", e.target.checked)}
              disabled={!isEditMode}
              slotProps={{ input: { "aria-label": "Open to work" } as React.InputHTMLAttributes<HTMLInputElement> }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: colors.success500 },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: colors.success500 },
              }}
            />
          </div>
          {formik.values.availableForWork && (
            isEditMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextFieldV2
                    label="Availability Note"
                    name="availabilityNote"
                    value={formik.values.availabilityNote ?? ""}
                    onChange={formik.handleChange}
                    placeholder="e.g. Open to full-time remote roles"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiInfo />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <TextFieldV2
                  label="Available From"
                  name="availableFrom"
                  type="date"
                  value={formik.values.availableFrom ?? ""}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiCalendar />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <ReadOnlyField label="Availability Note" value={formik.values.availabilityNote} icon={FiInfo} />
                </div>
                <ReadOnlyField label="Available From" value={formatReadableDate(formik.values.availableFrom)} icon={FiCalendar} />
              </div>
            )
          )}
        </div>
      </SectionCard>
      <SectionCard
        title="Resume"
        subtitle="Upload your resume to showcase your skills"
        icon={IoMdCloudUpload}
      >
        <DocumentUpload
          label={isEditMode ? "Upload Resume" : "Resume"}
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
          required={isEditMode}
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
              disabled={!formik.dirty}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFormTemplate;
