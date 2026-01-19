import React, { useEffect, useMemo, useState } from "react";
import { InputAdornment } from "@mui/material";
import type { FormikProps } from "formik";
import {
    FiUser,
    FiMail,
    FiGithub,
    FiLinkedin,
    FiGlobe,
    FiMapPin,
    FiPhone,
    FiBriefcase,
    FiImage,
    FiInfo,
} from "react-icons/fi";

import TextFieldV2 from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import AutoCompleteInput, {
    type AutoCompleteOption,
} from "../../atoms/AutoCompleteInput/AutoCompleteInput";

import { useProfileService } from "../../../services/useProfileService";
import {
    useColorThemeService,
    type ColorTheme,
    type ColorThemeFilterRequest,
} from "../../../services/useColorThemeService";

import type {
    ProfileRequest,
    ImageUploadResponse,
} from "../../../services/useProfileService";

import { Status, useColors, HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const SectionCard = ({ title, subtitle, icon: Icon, children,
}: {
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) => {
    const colors = useColors();

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 space-y-5" style={{ borderColor: colors.neutral200 }}>
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary50 }}>
                    <Icon className="w-8 h-8" style={{ color: colors.primary600 }} />
                </div>
                <div>
                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: colors.neutral900 }}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs sm:text-sm" style={{ color: colors.neutral500 }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {children}
        </div>
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
    isMobile,
    onEditClick,
}) => {
    const { showSnackbar } = useSnackbar();
    const profileService = useProfileService();
    const colorThemeService = useColorThemeService();

    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);

    const uploadProfileImage = async ( file: File ): Promise<ImageUploadResponse> => {
        setIsUploadingProfile(true);
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
            setIsUploadingProfile(false);
        }
    };

    const uploadLogo = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploadingLogo(true);
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
            setIsUploadingLogo(false);
        }
    };

    const loadColorThemes = async (search = "") => {
        const params: ColorThemeFilterRequest = {
            page: "0",
            size: "10",
            search,
            status: Status.ACTIVE,
        };
        try {
            const response = await colorThemeService.getColorTheme(params);
            if (response.status === HTTP_STATUS.OK) {
                setColorThemes(response.data.data.content || []);
            }
        } catch {
            setColorThemes([]);
        }
    };

    const themeOptions = useMemo<AutoCompleteOption[]>(
        () => colorThemes.map((theme) => ({ label: theme.themeName, value: theme.themeName })),
        [colorThemes]
    );

    useEffect(() => {
        loadColorThemes();
    }, []);

    return (
        <div className={isMobile ? "px-3 pb-24 space-y-6" : "pb-6 space-y-6"}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SectionCard title="Profile Images" subtitle="Profile & branding visuals" icon={FiImage}>
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
                            disabled={!isEditMode || isUploadingProfile}
                            maxSize={5}
                            aspectRatio="square"
                            helperText="JPG / PNG · Max 5MB"
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
                            disabled={!isEditMode || isUploadingLogo}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText="Brand logo · Max 5MB"
                        />
                    </div>
                </SectionCard>
                <SectionCard title="Personal Information" subtitle="Basic contact details" icon={FiUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    formik.setFieldValue(
                                        "themeName",
                                        option?.value || ""
                                    )
                                }
                                onSearch={loadColorThemes}
                                isDisabled={!isEditMode}
                            />
                        </div>
                    </div>
                </SectionCard>
            </div>
            <div>
                <SectionCard title="About & Social" subtitle="Summary and links" icon={FiInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <TextFieldV2
                                label="About Me"
                                name="aboutMe"
                                multiline
                                rows={4}
                                value={formik.values.aboutMe}
                                onChange={formik.handleChange}
                                disabled={!isEditMode}
                                helperText={`${formik.values.aboutMe?.length || 0}/500`}
                                inputProps={{ maxLength: 500 }}
                            />
                        </div>
                        <TextFieldV2
                            label="GitHub"
                            name="githubUrl"
                            value={formik.values.githubUrl}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiGithub />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextFieldV2
                            label="LinkedIn"
                            name="linkedinUrl"
                            value={formik.values.linkedinUrl}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiLinkedin />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="md:col-span-2">
                            <TextFieldV2
                                label="Website"
                                name="websiteUrl"
                                value={formik.values.websiteUrl}
                                onChange={formik.handleChange}
                                disabled={!isEditMode}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiGlobe />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </SectionCard>
            </div>
            {isEditMode && (
                <div className="mt-6">
                    <div className="flex gap-3">
                        <Button
                            fullWidth
                            label="Cancel"
                            variant="tertiaryContained"
                            onClick={onEditClick}
                        />
                        <Button
                            fullWidth
                            label="Save Changes"
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
