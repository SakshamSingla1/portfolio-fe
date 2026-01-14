import React from "react";
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

interface ProfileFormProps {
    formik: FormikProps<ProfileRequest>;
    isEditMode: boolean;
    onEditClick?: () => void;
}

const ProfileFormTemplate: React.FC<ProfileFormProps> = ({
    formik,
    isEditMode,
    onEditClick,
}) => {
    const { uploadProfileImage } = useProfileService();

    return (
        <div>
            <div className="px-2 md:px-6 pt-2 pb-6 flex flex-col items-center">
                <ImageUpload
                    label="Profile Image"
                    disabled={!isEditMode}
                    value={
                        formik.values.profileImageUrl
                            ? {
                                  url: formik.values.profileImageUrl,
                                  publicId: formik.values.profileImagePublicId!,
                              }
                            : null
                    }
                    onUpload={async ([file]) => uploadProfileImage(file)}
                    onChange={(res) => {
                        if (Array.isArray(res)) {
                            if (res.length > 0) {
                                formik.setFieldValue("profileImageUrl", res[0].url);
                                formik.setFieldValue("profileImagePublicId", res[0].publicId);
                            }
                        } else {
                            formik.setFieldValue("profileImageUrl", res.url);
                            formik.setFieldValue("profileImagePublicId", res.publicId);
                        }
                    }}
                />
            </div>

            <div className="p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                ),
                            }}
                        />

                        <TextFieldV2
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            disabled
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            className="bg-gray-100"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiMail className="w-5 h-5" />
                                    </InputAdornment>
                                ),
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
                            className="bg-gray-50"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiPhone className="w-5 h-5" />
                                    </InputAdornment>
                                ),
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
                                ),
                            }}
                        />
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            About & Social
                        </h3>

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
                            className="bg-gray-50"
                        />

                        <TextFieldV2
                            label="GitHub URL"
                            name="githubUrl"
                            disabled={!isEditMode}
                            value={formik.values.githubUrl}
                            onChange={formik.handleChange}
                            error={formik.touched.githubUrl && Boolean(formik.errors.githubUrl)}
                            helperText={formik.touched.githubUrl && formik.errors.githubUrl}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiGithub className="w-5 h-5" />
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiLinkedin className="w-5 h-5" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextFieldV2
                            label="Personal Website"
                            name="websiteUrl"
                            disabled={!isEditMode}
                            value={formik.values.websiteUrl}
                            onChange={formik.handleChange}
                            error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
                            helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiGlobe className="w-5 h-5" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>

                {isEditMode && (
                    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
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
                )}
            </div>
        </div>
    );
};

export default ProfileFormTemplate;
