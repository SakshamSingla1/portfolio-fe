import React from "react";
import { useProjectService } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const validationSchema = Yup.object().shape({
    projectName: Yup.string()
        .required('Project name is required')
        .max(50, 'Project name is too long'),
    projectDescription: Yup.string()
        .required('Project description is required')
        .max(50, 'Project description is too long'),
    projectLink: Yup.string()
        .required('Project link is required')
        .max(50, 'Project link is too long'),
    projectDuration: Yup.number()
        .required('Project duration is required'),
    technologiesUsed: Yup.string()
        .required('Technologies used are required'),
    projectStartDate: Yup.date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),
    projectEndDate: Yup.date()
        .min(Yup.ref('projectStartDate'), 'End date must be after start date')
        .nullable()
});

const ProjectAddDetailsPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    const formik = useFormik({
        initialValues: {
            projectName: "",
            projectDescription: "",
            projectLink: "",
            projectDuration: "",
            technologiesUsed: "",
            projectStartDate: new Date(),
            projectEndDate: new Date(),
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await projectService.create(values);
                if (response?.status === HTTP_STATUS.OK) {
                    onClose(); // Call onClose after successful submission
                    navigate(ADMIN_ROUTES.PROJECTS);
                    showSnackbar('success',`${response?.data?.message}`);
                } else {
                    showSnackbar('error',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        }
    });

    return (
        <div>
            <ProjectFormTemplate 
                formik={formik} 
                mode={MODE.ADD} 
                onClose={onClose} // Pass onClose to the template
            />
        </div>
    )
}
export default ProjectAddDetailsPage;
