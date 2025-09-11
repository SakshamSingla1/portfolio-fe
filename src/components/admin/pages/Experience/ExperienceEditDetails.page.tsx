import React, { useEffect } from "react";
import { useExperienceService , ExperienceRequest} from "../../../../services/useExperienceService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceFormTemplate from '../../templates/Experience/ExperienceForm.template'
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const validationSchema = Yup.object().shape({
    companyName: Yup.string()
        .required('Company name is required')
        .max(100, 'Company name is too long'),
    jobTitle: Yup.string()
        .required('Job title is required')
        .max(100, 'Job title is too long'),
    location: Yup.string()
        .required('Location is required')
        .max(100, 'Location is too long'),
    startDate: Yup.date()
        .required('Start date is required'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End date must be after start date')
        .nullable(),
    currentlyWorking: Yup.boolean()
        .required('Currently working status is required'),
    description: Yup.string()
        .required('Description is required')
        .max(500, 'Description is too long'),
    technologiesUsed: Yup.array()
        .of(Yup.number())
        .min(1, 'At least one technology is required'),
});

const ExperienceEditDetailsPage = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();

    const formik = useFormik<ExperienceRequest>({
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
                const response = await experienceService.update(id!, values);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate(ADMIN_ROUTES.EXPERIENCE);
                    showSnackbar('success',`${response?.data?.message}`);
                } else {
                    showSnackbar('error',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        }
    });

    const getExperience = async (id: string) => {
        try {
            const response = await experienceService.getById(id);
            if (response?.status === HTTP_STATUS.OK) {
                formik.setValues(
                    {
                        companyName: response.data.data.companyName,
                        jobTitle: response.data.data.jobTitle,
                        location: response.data.data.location,
                        startDate: response.data.data.startDate,
                        endDate: response.data.data.endDate,
                        description: response.data.data.description,
                        technologiesUsed: response.data.data.technologiesUsed.map((tech: any) => tech.id),
                        currentlyWorking: response.data.data.currentlyWorking
                    }
                );
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

