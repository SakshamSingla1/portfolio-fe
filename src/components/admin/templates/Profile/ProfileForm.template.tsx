import TextFieldV2 from "../../../atoms/TextField/TextField";
import Button from "../../../atoms/Button/Button";
import { FormikProps } from "formik";
import { ProfileRequest } from "../../../../services/useProfileService";
import { FiUser, FiMail, FiGithub, FiLinkedin, FiGlobe , FiMapPin, FiPhone , FiBriefcase } from 'react-icons/fi';
import { InputAdornment } from '@mui/material';

interface ProfileFormProps {
    formik: FormikProps<ProfileRequest>;
    isEditMode: boolean;
    onEditClick?: () => void;
}

const ProfileFormTemplate: React.FC<ProfileFormProps> = ({ formik, isEditMode, onEditClick }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {isEditMode ? 'Edit Profile' : 'Profile Information'}
                </h2>
                {!isEditMode && (
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage your profile information
                    </p>
                )}
            </div>

            <form onSubmit={formik.handleSubmit} className="p-8">
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
                            <div className="flex items-center w-full">
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

                            <div className="flex items-center w-full">
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
                                />
                            </div>

                            <div className="flex items-center w-full">
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
                                    className="bg-gray-50"
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
                            className="px-6 py-2.5 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
                        <Button
                            label="Save Changes"
                            type="submit"
                            variant="primaryContained"
                            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                            className="px-6 py-2.5 text-sm font-medium"
                            loading={formik.isSubmitting}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileFormTemplate;