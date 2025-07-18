import { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES,HTTP_STATUS } from '../../../../utils/constant';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfileService } from '../../../../services/useProfileService';
import ProfileFormTemplate from '../../templates/Profile/ProfileForm.template';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const validationSchema = Yup.object().shape({
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
    profileImageUrl: Yup.mixed()
        .required('Profile Image is required'),
});

const ProfilePage: React.FC = () => {
    const { user } = useAuthenticatedUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const mode = searchParams.get('mode');
        setIsEditMode(mode === 'edit');
    }, [searchParams]);

    const getProfileData = async () => {
        try{
            const response = await profileService.get();
            if (response.status === HTTP_STATUS.OK) {
                formik.setValues(response.data.data);
                showSnackbar('success','Profile fetched successfully');
            }
        }catch(error){
            showSnackbar('error',`${error}`);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    const formik = useFormik({
        initialValues: {
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
        },
        validationSchema,
        onSubmit: async (values) => {
            const response = await profileService.update(user?.id ?? '', values);
            if (response.status === HTTP_STATUS.OK) {
                navigate(ADMIN_ROUTES.PROFILE);
                showSnackbar('success',`${response?.data?.message}`);
            } else {
                showSnackbar('error',`${response?.data?.message}`);
            }
        },
        enableReinitialize: true
    });

    return (
        <div>
            <ProfileFormTemplate 
                formik={formik}
                isEditMode={isEditMode}
                onEditClick={() => navigate(`${ADMIN_ROUTES.PROFILE}`)}
            />
        </div>
    );
};

export default ProfilePage;
