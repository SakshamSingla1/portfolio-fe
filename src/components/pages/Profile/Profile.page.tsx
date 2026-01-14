import { useState, useEffect } from 'react';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfileService, type ProfileRequest } from '../../../services/useProfileService';
import ProfileFormTemplate from '../../templates/Profile/ProfileForm.template';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import Button from '../../atoms/Button/Button';

const validationSchema = Yup.object().shape({
    userName: Yup.string()
        .required('User name is required'),
    fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    title: Yup.string()
        .required('Title is required'),
    phone: Yup.string()
        .required('Phone is required'),
    location: Yup.string()
        .required('Location is required'),
    aboutMe: Yup.string()
        .required('About is required'),
    githubUrl: Yup.string()
        .required('Github URL is required'),
    linkedinUrl: Yup.string()
        .required('Linkedin URL is required'),
    websiteUrl: Yup.string()
        .required('Website URL is required'),
    profileImageUrl: Yup.string()
        .required('Profile image URL is required'),
    logoUrl: Yup.string()
        .required('Logo URL is required'),
});

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const mode = searchParams.get('mode');
        setIsEditMode(mode === MODE.EDIT);
    }, [searchParams]);

    const getProfileData = async () => {
        try {
            const response = await profileService.get();
            if (response.status === HTTP_STATUS.OK) {
                formik.setValues(response.data.data);
                showSnackbar('success', 'Profile fetched successfully');
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    const formik = useFormik<ProfileRequest>({
        initialValues: {
            userName: '',
            fullName: '',
            email: '',
            title: '',
            phone: '',
            location: '',
            aboutMe: '',
            githubUrl: '',
            linkedinUrl: '',
            websiteUrl: '',
            profileImageUrl: '',
            logoUrl: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const response = await profileService.update(values);
            if (response.status === HTTP_STATUS.OK) {
                navigate(ADMIN_ROUTES.PROFILE);
                showSnackbar('success', `${response?.data?.message}`);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        },
        enableReinitialize: true
    });

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your profile information</p>
                        </div>
                        {!isEditMode && (
                            <Button
                                variant="primaryContained"
                                onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)}
                                label="Edit Profile"
                                className="whitespace-nowrap"
                            />
                        )}
                    </div>
                </div>
                <div className="p-6">
                    <ProfileFormTemplate
                        formik={formik}
                        isEditMode={isEditMode}
                        onEditClick={() => navigate(`${ADMIN_ROUTES.PROFILE}`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
