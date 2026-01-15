import React, { useEffect, useState } from "react";
import TextFieldV2 from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import type { FormikProps } from "formik";
import type { ProfileRequest } from "../../../services/useProfileService";
import {
    FiUser,
    FiMail,
    FiGithub,
    FiLinkedin,
    FiGlobe,
    FiMapPin,
    FiPhone,
    FiBriefcase
} from "react-icons/fi";
import { InputAdornment } from "@mui/material";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useProfileService } from "../../../services/useProfileService";
import { useColors } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";

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
    const colors = useColors();
    const {showSnackbar} = useSnackbar();
    const profileService = useProfileService();
    const [isUploadingLogo,setIsUploadingLogo]=useState<boolean>(false);
    const [isUploadingProfile,setIsUploadingProfile]=useState<boolean>(false);


    const uploadProfileImage = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploadingProfile(true);
        try {
            const response = await profileService.uploadProfileImage(file);
            if (response.status === HTTP_STATUS.OK) {
                formik.setFieldValue('profileImageUrl', response.data.data.url);
                formik.setFieldValue('profileImagePublicId', response.data.data.publicId);
                showSnackbar('success', 'Profile image uploaded successfully!');
                return response.data.data;
            }
            throw new Error('Upload failed');
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to upload profile image. Please try again.');
            throw error;
        } finally {
            setIsUploadingProfile(false);
        }
    };

    const uploadLogo = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploadingLogo(true);
        try {
            const response = await profileService.uploadLogo(file);
            if (response.status === HTTP_STATUS.OK) {
                formik.setFieldValue('logoUrl', response.data.data.url);
                formik.setFieldValue('logoPublicId', response.data.data.publicId);
                showSnackbar('success', 'Logo image uploaded successfully!');
                return response.data.data;
            }
            throw new Error('Upload failed');
        } catch (error) {
            console.error(error);
            showSnackbar('error', 'Failed to upload logo image. Please try again.');
            throw error;
        } finally {
            setIsUploadingLogo(false);
        }
    };

    useEffect(() => {
        console.log(formik)
    },[formik])

    return (
        <div className={isMobile ? 'px-3' : ''}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl" 
                     style={{ 
                         borderColor: colors.neutral200,
                     }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-lg font-semibold flex items-center"
                            style={{ color: colors.neutral900 }}>
                            <span className="w-2 h-2 rounded-full mr-3" 
                                  style={{ backgroundColor: colors.primary500 }}></span>
                            Profile Images
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <ImageUpload
                                label="Profile Image"
                                value={formik.values.profileImageUrl || null}
                                onChange={(url) => {
                                    formik.setFieldValue("profileImageUrl", url);
                                    if (!url) {
                                        formik.setFieldValue("profileImagePublicId", "");
                                    }
                                }}
                                onUpload={uploadProfileImage}
                                disabled={!isEditMode || isUploadingProfile}
                                maxSize={5}
                                aspectRatio="square"
                                error={Boolean(formik.errors.profileImageUrl) && formik.touched.profileImageUrl}
                                helperText={formik.errors.profileImageUrl && formik.touched.profileImageUrl ? formik.errors.profileImageUrl : ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <ImageUpload
                                label="Logo"
                                value={formik.values.logoUrl || null}
                                onChange={(url) => {
                                    formik.setFieldValue("logoUrl", url);
                                    if (!url) {
                                        formik.setFieldValue("logoPublicId", "");
                                    }
                                }}
                                onUpload={uploadLogo}
                                disabled={!isEditMode || isUploadingLogo}
                                maxSize={5}
                                aspectRatio="wide"
                                error={Boolean(formik.errors.logoUrl) && formik.touched.logoUrl}
                                helperText={formik.errors.logoUrl && formik.touched.logoUrl ? formik.errors.logoUrl : ""}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl"
                     style={{ 
                         borderColor: colors.neutral200,
                     }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-lg font-semibold flex items-center"
                            style={{ color: colors.neutral900 }}>
                            <span className="w-2 h-2 rounded-full mr-3" 
                                  style={{ backgroundColor: colors.primary500 }}></span>
                            Personal Information
                        </h3>
                        <div className="text-xs sm:text-sm" 
                             style={{ color: colors.neutral500 }}>
                            Basic contact details
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="col-span-1 sm:col-span-2">
                            <TextFieldV2
                                label="Full Name"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                disabled={!isEditMode}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                style={{ backgroundColor: colors.neutral50 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiUser className="w-4 h-4 sm:w-5 sm:h-5" 
                                                    style={{ color: colors.neutral400 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                            <TextFieldV2
                                label="Email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                disabled
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                style={{ backgroundColor: colors.neutral100 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiMail className="w-4 h-4 sm:w-5 sm:h-5" 
                                                   style={{ color: colors.neutral400 }} />
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
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            style={{ backgroundColor: colors.neutral50 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5" 
                                                     style={{ color: colors.neutral400 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextFieldV2
                            label="Phone Number"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            style={{ backgroundColor: colors.neutral50 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiPhone className="w-4 h-4 sm:w-5 sm:h-5" 
                                                  style={{ color: colors.neutral400 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <div className="col-span-1 sm:col-span-2">
                            <TextFieldV2
                                label="Location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                disabled={!isEditMode}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                                style={{ backgroundColor: colors.neutral50 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5" 
                                                      style={{ color: colors.neutral400 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* About & Social Section */}
                <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl xl:col-span-2"
                     style={{ 
                         borderColor: colors.neutral200,
                     }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-lg font-semibold flex items-center"
                            style={{ color: colors.neutral900 }}>
                            <span className="w-2 h-2 rounded-full mr-3" 
                                  style={{ backgroundColor: colors.success500 }}></span>
                            About & Social
                        </h3>
                        <div className="text-xs sm:text-sm" 
                             style={{ color: colors.neutral500 }}>
                            Professional summary and social links
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="col-span-1 lg:col-span-2">
                            <TextFieldV2
                                label="About Me"
                                name="aboutMe"
                                multiline
                                rows={4}
                                disabled={!isEditMode}
                                value={formik.values.aboutMe}
                                onChange={formik.handleChange}
                                error={formik.touched.aboutMe && Boolean(formik.errors.aboutMe)}
                                helperText={formik.touched.aboutMe && formik.errors.aboutMe}
                                style={{ backgroundColor: colors.neutral50 }}
                            />
                        </div>

                        <TextFieldV2
                            label="GitHub URL"
                            name="githubUrl"
                            disabled={!isEditMode}
                            value={formik.values.githubUrl}
                            onChange={formik.handleChange}
                            error={formik.touched.githubUrl && Boolean(formik.errors.githubUrl)}
                            helperText={formik.touched.githubUrl && formik.errors.githubUrl}
                            style={{ backgroundColor: colors.neutral50 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" 
                                                   style={{ color: colors.neutral400 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextFieldV2
                            label="LinkedIn URL"
                            name="linkedinUrl"
                            disabled={!isEditMode}
                            value={formik.values.linkedinUrl}
                            onChange={formik.handleChange}
                            error={formik.touched.linkedinUrl && Boolean(formik.errors.linkedinUrl)}
                            helperText={formik.touched.linkedinUrl && formik.errors.linkedinUrl}
                            style={{ backgroundColor: colors.neutral50 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" 
                                                     style={{ color: colors.neutral400 }} />
                                    </InputAdornment>
                                    ),
                            }}
                        />

                        <div className="col-span-1 lg:col-span-2">
                            <TextFieldV2
                                label="Personal Website"
                                name="websiteUrl"
                                disabled={!isEditMode}
                                value={formik.values.websiteUrl}
                                onChange={formik.handleChange}
                                error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
                                helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
                                style={{ backgroundColor: colors.neutral50 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5" 
                                                      style={{ color: colors.neutral400 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isEditMode && (
                <div className="my-6">
                    <div className="flex flex-row justify-between gap-3">
                        <Button
                            label="Cancel"
                            variant="tertiaryContained"
                            onClick={onEditClick}
                        />
                        <Button
                            label="Save Changes"
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            loading={formik.isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileFormTemplate;