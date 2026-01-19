import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEdit } from 'react-icons/fi';

import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { HTTP_STATUS, useColors } from '../../../utils/types';

import { useProfileService, type ProfileRequest } from '../../../services/useProfileService';
import { useColorThemeService } from '../../../services/useColorThemeService';

import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';

import ProfileFormTemplate from '../../templates/Profile/ProfileForm.template';
import Button from '../../atoms/Button/Button';


const validationSchema = Yup.object({
  userName: Yup.string().required('User name is required'),
  fullName: Yup.string().min(3).required('Full name is required'),
  email: Yup.string().email().required('Email is required'),
  title: Yup.string().required('Title is required'),
  phone: Yup.string().required('Phone is required'),
  location: Yup.string().required('Location is required'),
  aboutMe: Yup.string().required('About is required'),
  githubUrl: Yup.string().required('GitHub URL is required'),
  linkedinUrl: Yup.string().required('LinkedIn URL is required'),
  websiteUrl: Yup.string().required('Website URL is required'),
  profileImageUrl: Yup.string().required('Profile image is required'),
  profileImagePublicId: Yup.string().required(),
  logoUrl: Yup.string().required('Logo is required'),
  logoPublicId: Yup.string().required(),
  themeName: Yup.string().required('Theme is required'),
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const colors = useColors();
  const { showSnackbar } = useSnackbar();

  const profileService = useProfileService();
  const colorThemeService = useColorThemeService();
  const { setDefaultTheme } = useAuthenticatedUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsEditMode(searchParams.get('mode') === MODE.EDIT);
  }, [searchParams]);

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
      themeName: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await profileService.update(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar('success', response.data.message);
          navigate(ADMIN_ROUTES.PROFILE);
        }
      } catch (err) {
        showSnackbar('error', 'Failed to update profile');
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await profileService.get();
        if (response.status === HTTP_STATUS.OK) {
          formik.setValues(response.data.data);
        }
      } catch {
        showSnackbar('error', 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!formik.values.themeName) return;

    const loadTheme = async () => {
      try {
        const response =
          await colorThemeService.getColorThemeByThemeName(
            formik.values.themeName
          );
        if (response.status === HTTP_STATUS.OK) {
          setDefaultTheme(response.data.data);
        }
      } catch {
        showSnackbar('error', 'Failed to apply theme');
      }
    };

    loadTheme();
  }, [formik.values.themeName]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full">
        <div
          className="rounded-2xl overflow-hidden shadow-sm border"
          style={{ borderColor: colors.neutral200 }}
        >
          <div
            className="relative"
            style={{
              background: `linear-gradient(135deg, ${colors.primary100}, ${colors.primary500})`,
              padding: isMobile ? '20px 16px' : '32px 24px',
            }}
          >
            {!isEditMode && (
              <div className="absolute top-4 right-4">
                <Button
                  variant={isMobile ? 'primaryText' : 'primaryContained'}
                  label={isMobile ? '' : 'Edit Profile'}
                  iconButton={isMobile ? <FiEdit color="white" /> : undefined}
                  onClick={() =>
                    navigate(`${ADMIN_ROUTES.PROFILE}?mode=${MODE.EDIT}`)
                  }
                />
              </div>
            )}

            <h1
              className={`font-bold ${
                isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'
              }`}
              style={{ color: colors.neutral900 }}
            >
              {isEditMode ? 'Edit Profile' : 'My Profile'}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: colors.neutral700 }}
            >
              Manage your personal & professional information
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="p-6 text-center text-neutral-500">
                Loading profile…
              </div>
            ) : (
              <ProfileFormTemplate
                formik={formik}
                isEditMode={isEditMode}
                isMobile={isMobile}
                onEditClick={() => navigate(ADMIN_ROUTES.PROFILE)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
