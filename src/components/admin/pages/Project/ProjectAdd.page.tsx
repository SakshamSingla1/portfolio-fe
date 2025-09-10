import { useProjectService, Project } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
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

const ProjectAddDetailsPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    const formik = useFormik<Omit<Project, 'id'>>({
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
                const response = await projectService.create(values);
                if (response?.status === HTTP_STATUS.OK) {
                    onClose();
                    navigate(ADMIN_ROUTES.PROJECTS);
                    showSnackbar('success', `${response?.data?.message}`);
                } else {
                    showSnackbar('error', `${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error', `${error}`);
            }
        }
    });

    return (
        <div>
            <ProjectFormTemplate 
                formik={formik} 
                mode={MODE.ADD} 
                onClose={onClose}
            />
        </div>
    );
};

export default ProjectAddDetailsPage;
