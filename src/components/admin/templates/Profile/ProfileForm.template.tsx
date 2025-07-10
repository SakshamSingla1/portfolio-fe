import React, { useState } from 'react';
import TextFieldV2 from "../../../atoms/TextField/TextField";
import Button from "../../../atoms/Button/Button";
import { FormikProps } from "formik";
import { ProfileRequest } from "../../../../services/useProfileService";
import { FiUser, FiMail, FiGithub, FiLinkedin, FiGlobe, FiMapPin, FiPhone, FiBriefcase, FiCamera } from 'react-icons/fi';
import ProfileImage from "../../../atoms/ProfileImage/ProfileImage";
import { InputAdornment } from '@mui/material';
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../../utils/constant";

const useStyles = createUseStyles((theme: any) => ({
        profileImageContainer: {
            position: 'relative',
            width: '26rem',
            height: '32rem',
            '&:hover $profileImageOverlay': {
                opacity: 1,
            },
            '&:hover $profileImage': {
                transform: 'scale(1.05)',
            },
            '&:hover $profileImageWrapper::before': {
                transform: 'rotate(360deg)',
            },
        },
        profileImageWrapper: {
            position: 'absolute',
            inset: 0,
            borderRadius: '10%',
            padding: '0.5rem',
            background: `linear-gradient(135deg, 
                ${theme.palette.background.primary.primary100} 0%, 
                ${theme.palette.background.primary.primary500} 50%, 
                ${theme.palette.background.primary.primary900} 100%)`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                padding: '0.5rem',
                borderRadius: 'inherit',
                background: 'inherit',
                backgroundSize: '200% 200%',
                animation: '$rotate 4s linear infinite',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                zIndex: -1,
            },
        },
        '@keyframes rotate': {
            '0%': {
                backgroundPosition: '0% 50%',
            },
            '100%': {
                backgroundPosition: '200% 50%',
            },
        },
    profileImageInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '10%',
        overflow: 'hidden',
        '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
        },
    },
    profileImageOverlay: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10%',
        backgroundColor: 'rgba(10, 25, 41, 0.7)',
        color: 'white',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(10, 25, 41, 0.8)',
        },
    },
    cameraIcon: {
        backgroundColor: 'rgba(26, 188, 156, 0.9)',
        padding: '0.75rem',
        borderRadius: '10%',
        marginBottom: '0.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    changeText: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
}));

interface ProfileFormProps {
    formik: FormikProps<ProfileRequest>;
    isEditMode: boolean;
    onEditClick?: () => void;
}

const ProfileFormTemplate: React.FC<ProfileFormProps> = ({ formik, isEditMode, onEditClick }) => {
    const classes = useStyles();

    const navigate = useNavigate();

    const handleEditPicture = () => {
        navigate(ADMIN_ROUTES.PROFILE + "?mode=edit");
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {isEditMode && <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Edit Profile
                </h2>
            </div>}
            <div className="px-8 pt-8 pb-6 flex flex-col items-center">
                {isEditMode ? (
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
                />
                ) : (
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImageWrapper}>
                            <div className={classes.profileImageInner}>
                                <img
                                    src={formik.values.profileImageUrl}
                                    alt="Profile"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = formik.values.profileImageUrl;
                                    }}
                                />
                            </div>
                        </div>
                        {onEditClick && (
                            <div
                                className={classes.profileImageOverlay}
                                onClick={handleEditPicture}
                                aria-label="Change profile picture"
                            >
                                <div className={classes.cameraIcon}>
                                    <FiCamera size={24} />
                                </div>
                                <span className={classes.changeText}>Change Photo</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700">Personal Information</h3>
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
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700">About & Social</h3>
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
                    <div className={`flex justify-between mt-10 pt-6 border-t border-gray-100`}>
                        <Button
                            label="Cancel"
                            type="button"
                            variant="secondaryContained"
                            onClick={onEditClick}
                        />
                        <Button
                            label="Save Changes"
                            type="submit"
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