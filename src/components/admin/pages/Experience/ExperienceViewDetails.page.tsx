import React, { useEffect } from "react";
import { useExperienceService } from "../../../../services/useExperienceService";
import { useFormik } from "formik";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceFormTemplate from '../../templates/Experience/ExperienceForm.template'
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const ExperienceViewDetailsPage = () => {
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
        onSubmit: () => { }
    });

    const getExperience = async (id: string) => {
        try {
            const response = await experienceService.getById(id);
            if (response?.status === HTTP_STATUS.OK) {
                formik.setValues({
                    companyName: response.data.data.companyName,
                    jobTitle: response.data.data.jobTitle,
                    location: response.data.data.location,
                    startDate: response.data.data.startDate,
                    endDate: response.data.data.endDate,
                    description: response.data.data.description,
                    technologiesUsed: response.data.data.technologiesUsed.map((tech: any) => tech.id),
                    currentlyWorking: response.data.data.currentlyWorking
                });
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
            <ExperienceFormTemplate formik={formik} mode={MODE.VIEW} onClose={() => navigate(ADMIN_ROUTES.EXPERIENCE)} />
        </div>
    )
}
export default ExperienceViewDetailsPage;

