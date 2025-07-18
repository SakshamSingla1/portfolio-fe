import React,{useEffect} from "react";
import { useProjectService } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
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

const ProjectViewDetailsPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
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
        onSubmit: () => {},
    });

    const getData = async (id:string) => {
        try {
            const response = await projectService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                formik.setValues({
                    projectName: response.data.data.projectName || "",
                    projectDescription: response.data.data.projectDescription || "",
                    projectLink: response.data.data.projectLink || "",
                    projectDuration: response.data.data.projectDuration || "",
                    technologiesUsed: response.data.data.technologiesUsed || "",
                    projectStartDate: response.data.data.projectStartDate || new Date(),
                    projectEndDate: response.data.data.projectEndDate || new Date(),
                });
                showSnackbar('success','Project fetched successfully');
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
        }
    }

    useEffect(() => {
        if (id) {
            getData(id);
        }
    }, [id]);

    return (
        <div>
            <ProjectFormTemplate formik={formik} mode={MODE.VIEW} onClose={() => navigate(ADMIN_ROUTES.PROJECTS)} />
        </div>
    )
}
export default ProjectViewDetailsPage;

