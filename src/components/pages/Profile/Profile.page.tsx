import { useState, useEffect } from 'react';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { HTTP_STATUS, useColors } from '../../../utils/types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfileService, type ProfileRequest } from '../../../services/useProfileService';
import ProfileFormTemplate from '../../templates/Profile/ProfileForm.template';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import Button from '../../atoms/Button/Button';
import { FiEdit } from 'react-icons/fi';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { useColorThemeService } from '../../../services/useColorThemeService';

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
    profileImagePublicId: Yup.string()
        .required('Profile Image Public ID is required'),
    logoUrl: Yup.string()
        .required('Logo URL is required'),
    logoPublicId: Yup.string()
        .required('Logo Public ID is required'),
    themeName: Yup.string()
        .required('Theme name is required'),
});

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const profileService = useProfileService();
    const colorThemeService = useColorThemeService();
    const { showSnackbar } = useSnackbar();
    const colors = useColors();
    const { setDefaultTheme } = useAuthenticatedUser();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    const loadTheme = async (themeName: string) => {
        try {
            const response = await colorThemeService.getColorThemeByThemeName(themeName);
            if (response.status === HTTP_STATUS.OK) {
                setDefaultTheme(response.data.data);
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
            profileImagePublicId: '',
            logoUrl: '',
            logoPublicId: '',
            themeName: ''
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
    });

    useEffect(() => {
        loadTheme(formik.values.themeName);
    }, [formik.values.themeName]);

    return (
        <div>
            <div className={`mx-auto ${isMobile ? 'w-full px-3' : 'max-w-6xl px-4 sm:px-6 lg:px-8'}`}>
                <div className={`rounded-xl overflow-hidden `}
                     style={{ 
                         backgroundColor: 'white',
                     }}>
                    <div style={{ 
                         background: `linear-gradient(to right, ${colors.primary50}, ${colors.primary500})`,
                         borderBottom: `1px solid ${colors.neutral200}`,
                         padding: isMobile ? '24px 16px' : '32px 24px',
                         position: 'relative'
                    }}>
                        {!isEditMode && (
                            <div className={`absolute top-4 right-4 z-10`}>
                                <Button
                                    variant={isMobile ? 'primaryText' : 'primaryContained'}
                                    onClick={() => navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)}
                                    label={isMobile ? '' : 'Edit Profile'}
                                    iconButton={isMobile ? <FiEdit color='white' /> : ""}
                                />
                            </div>
                        )}
                        
                        <div>
                            <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'}`}
                                style={{ 
                                    color: colors.neutral900,
                                    marginBottom: '8px',
                                    maxWidth: isMobile ? '200px' : 'none'
                                }}>
                                {isMobile ? 'My Profile' : 'Profile'}
                            </h1>
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div style={{ padding: isMobile ? '0' : '24px' }}>
                        <ProfileFormTemplate
                            formik={formik}
                            isEditMode={isEditMode}
                            onEditClick={() => navigate(`${ADMIN_ROUTES.PROFILE}`)}
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;