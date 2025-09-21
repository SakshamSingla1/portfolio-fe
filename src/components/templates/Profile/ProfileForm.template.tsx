import React from 'react';
import TextFieldV2 from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import type { FormikProps } from "formik";
import type { ProfileRequest } from "../../../services/useProfileService";
import { FiUser, FiMail, FiGithub, FiLinkedin, FiGlobe, FiMapPin, FiPhone, FiBriefcase } from 'react-icons/fi';
import { InputAdornment } from '@mui/material';
import ProfileImage from "../../atoms/ProfileImage/ProfileImage";

interface ProfileFormProps {
    formik: FormikProps<ProfileRequest>;
    isEditMode: boolean;
    onEditClick?: () => void;
}

const ProfileFormTemplate: React.FC<ProfileFormProps> = ({ formik, isEditMode, onEditClick }) => {
    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isEditMode ? "Edit Profile" : "Profile"}
                </h2>
                <p className="text-gray-600">
                    {isEditMode ? "Update your personal information and social links" : "Your profile information and social presence"}
                </p>
            </div>
            <div className="px-2 md:px-6 pt-2 pb-6 flex flex-col items-center">
                <ProfileImage
                    value={formik.values.profileImageUrl}
                    onChange={(url) => formik.setFieldValue('profileImageUrl', url)}
                    accept="image/jpeg, image/png, image/webp"
                    maxSizeMB={5}
                    error={!!formik.errors.profileImageUrl}
                    helperText={formik.errors.profileImageUrl || "Upload a profile image (max 5MB)"}
                    width="100%"
                    height="auto"
                    aspectRatio="3/4"
                    disabled={!isEditMode}
                />
            </div>

            <div className="p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Personal Information
                        </h3>
                        <TextFieldV2
                            label="Full Name"
                            name="fullName"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                            className="bg-gray-50"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiUser className="w-5 h-5" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextFieldV2
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            disabled={true}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            className="bg-gray-100"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiMail className="w-5 h-5" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextFieldV2
                            label="Professional Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            className="bg-gray-50"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiBriefcase className="w-5 h-5" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextFieldV2
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            className="bg-gray-50"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiPhone className="w-5 h-5" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextFieldV2
                            label="Location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            disabled={!isEditMode}
                            onBlur={formik.handleBlur}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                            className="bg-gray-50"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiMapPin className="w-5 h-5" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    {/* About & Social */}
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            About & Social
                        </h3>
                        <div>
                            <TextFieldV2
                                label="About Me"
                                name="aboutMe"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                disabled={!isEditMode}
                                value={formik.values.aboutMe}
                                onChange={formik.handleChange}
                                error={formik.touched.aboutMe && Boolean(formik.errors.aboutMe)}
                                helperText={formik.touched.aboutMe && formik.errors.aboutMe}
                                className="bg-gray-50"
                            />
                        </div>
                        <div className="space-y-4 pt-2">
                            <div>
                                <TextFieldV2
                                    label="GitHub URL"
                                    name="githubUrl"
                                    type="url"
                                    disabled={!isEditMode}
                                    value={formik.values.githubUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.githubUrl && Boolean(formik.errors.githubUrl)}
                                    helperText={formik.touched.githubUrl && formik.errors.githubUrl}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FiGithub className="w-5 h-5" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <TextFieldV2
                                    label="LinkedIn URL"
                                    name="linkedinUrl"
                                    type="url"
                                    disabled={!isEditMode}
                                    value={formik.values.linkedinUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.linkedinUrl && Boolean(formik.errors.linkedinUrl)}
                                    helperText={formik.touched.linkedinUrl && formik.errors.linkedinUrl}
                                    className="bg-gray-50"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FiLinkedin className="w-5 h-5" />
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
                                />
                            </div>
                            <div>
                                <TextFieldV2
                                    label="Personal Website"
                                    name="websiteUrl"
                                    type="url"
                                    disabled={!isEditMode}
                                    value={formik.values.websiteUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
                                    helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
                                    className="bg-gray-50 w-full"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FiGlobe className="w-5 h-5" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {isEditMode && (
                    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
                        <Button
                            label="Cancel"
                            type="button"
                            variant="tertiaryContained"
                            onClick={onEditClick}
                        />
                        <div className="flex gap-3">
                            <Button
                                label="Save Changes"
                                type="submit"
                                variant="primaryContained"
                                onClick={() => formik.handleSubmit()}
                                loading={formik.isSubmitting}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="mt-8 pt-6 border-t border-gray-200"><ProfileCard profile={formik.values} /></div>
            <div className="mt-8 pt-6 border-t border-gray-200"><AboutCard aboutMe={formik.values.aboutMe} profileImageUrl={formik.values.profileImageUrl} /></div> */}
        </div>
    );
};

export default ProfileFormTemplate;