import {useEffect} from "react";
import { Project, useProjectService } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const validationSchema = Yup.object().shape({
    projectName: Yup.string()
        .required('Project name is required')
        .max(100, 'Project name is too long'),
    projectDescription: Yup.string()
        .required('Project description is required')
        .max(500, 'Project description is too long'),
    projectLink: Yup.string()
        .required('Project link is required')
        .url('Must be a valid URL'),
    technologiesUsed: Yup.array()
        .of(Yup.number())
        .min(1, 'At least one technology is required'),
    projectStartDate: Yup.date()
        .required('Start date is required'),
    projectEndDate: Yup.date()
        .min(Yup.ref('projectStartDate'), 'End date must be after start date')
        .nullable(),
    currentlyWorking: Yup.boolean()
        .required('Currently working status is required'),
    projectImageUrl: Yup.string()
        .url('Must be a valid URL')
        .nullable()
});

const ProjectEditDetailsPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const formik = useFormik<Project>({
        initialValues: {
            projectName: "",
            projectDescription: "",
            projectLink: "",
            technologiesUsed: [],
            projectStartDate: new Date(),
            projectEndDate: new Date(),
            currentlyWorking: false,
            projectImageUrl: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await projectService.update(id!, values);
                if (response?.status === HTTP_STATUS.OK) {
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

    const getData = async (id:string) => {
        try {
            const response = await projectService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                formik.setValues({
                    projectName: response.data.data.projectName || "",
                    projectDescription: response.data.data.projectDescription || "",
                    projectLink: response.data.data.projectLink || "",
                    technologiesUsed: response.data.data.technologiesUsed.map((tech: any) => tech.id) || [],
                    projectStartDate: response.data.data.projectStartDate || new Date(),
                    projectEndDate: response.data.data.projectEndDate || new Date(),
                    currentlyWorking: response.data.data.currentlyWorking || false,
                    projectImageUrl: response.data.data.projectImageUrl || "",
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
            <ProjectFormTemplate formik={formik} mode={MODE.EDIT} onClose={() => navigate(ADMIN_ROUTES.PROJECTS)} />
        </div>
    )
}
export default ProjectEditDetailsPage;

