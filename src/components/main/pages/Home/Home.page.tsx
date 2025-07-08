import React, { useEffect } from 'react';
import { useProfileService, ProfileRequest } from '../../../../services/useProfileService';
import { HTTP_STATUS } from '../../../../utils/constant';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import HomeTemplate from '../../templates/Home/Home.template';

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    title: Yup.string().required('Title is required'),
    aboutMe: Yup.string().required('About me is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    location: Yup.string().required('Location is required'),
    githubUrl: Yup.string().required('Github URL is required'),
    linkedinUrl: Yup.string().required('Linkedin URL is required'),
    websiteUrl: Yup.string().required('Website URL is required'),
});

const HomePage = () => {
    const profileService = useProfileService();

    const formik = useFormik<ProfileRequest>({
        initialValues: {
            fullName: "",
            title: "",
            aboutMe: "",
            email: "",
            phone: "",
            location: "",
            githubUrl: "",
            linkedinUrl: "",
            websiteUrl: "",
        },
        validationSchema,
        onSubmit: ()=>{ }
    });
        

    const getData = async () => {
        try {
            const response = await profileService.get();
            if (response?.status === HTTP_STATUS.OK) {
                console.log(response?.data);
            } else {
                alert(response?.message || "Failed to get profile");
            }
        } catch (error) {
            console.error("Error getting profile:", error);
            alert("An error occurred while getting the profile");
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <HomeTemplate />
        </div>
    )
}
export default HomePage;