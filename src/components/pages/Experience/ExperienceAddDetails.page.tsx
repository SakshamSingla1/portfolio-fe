import React from "react";
import { useExperienceService } from "../../../services/useExperienceService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import ExperienceFormTemplate from '../../templates/Experience/ExperienceForm.template'

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

const ExperienceAddDetailsPage = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();

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
        onSubmit: async (values) => {
            try {
                const response = await experienceService.create(values);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate(ADMIN_ROUTES.EXPERIENCE);
                } else {
                    alert(response?.message);
                }
            } catch (error) {
                alert(error);
            }
        }
    });

    return (
        <div>
            <ExperienceFormTemplate formik={formik} mode={MODE.ADD} onClose={() => navigate(ADMIN_ROUTES.EXPERIENCE)} />
        </div>
    )
}
export default ExperienceAddDetailsPage;

