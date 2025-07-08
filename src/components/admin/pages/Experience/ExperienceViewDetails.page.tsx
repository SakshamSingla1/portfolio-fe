import React, { useEffect } from "react";
import { useExperienceService } from "../../../../services/useExperienceService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceFormTemplate from '../../templates/Experience/ExperienceForm.template'
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const validationSchema = Yup.object().shape({
    companyName: Yup.string()
        .required('Company name is required')
        .max(50, 'Company name is too long'),
    jobTitle: Yup.string()
        .required('Job title is required')
        .max(50, 'Job title is too long'),
    location: Yup.string()
        .required('Location is required')
        .max(100, 'Location is too long'),
    startDate: Yup.date()
        .required('Start year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Invalid year'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End year must be after start year')
        .max(new Date().getFullYear() + 5, 'Invalid year'),
    description: Yup.string()
        .max(500, 'Description is too long'),
});

const ExperienceEditDetailsPage = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            companyName: "",
            jobTitle: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            technologiesUsed: [],
            currentlyWorking: false
        },
        validationSchema: validationSchema,
        onSubmit: () => { }
    });

    const getExperience = async (id: string) => {
        try {
            const response = await experienceService.getById(id);
            if (response?.status === HTTP_STATUS.OK) {
                formik.setValues(response.data.data);
                showSnackbar('success',`${response?.data?.message}`);
            } else {
                showSnackbar('error',`${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
        }
    }

    useEffect(() => {
        if (id) {
            getExperience(id);
        }
    }, [id]);

    return (
        <div>
            <ExperienceFormTemplate formik={formik} mode={MODE.EDIT} onClose={() => navigate(ADMIN_ROUTES.EXPERIENCE)} />
        </div>
    )
}
export default ExperienceEditDetailsPage;

