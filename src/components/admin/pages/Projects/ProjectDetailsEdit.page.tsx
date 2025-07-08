import {useEffect} from "react";
import { useProjectService } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectForm.template";

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

const ProjectEditDetailsPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { id } = useParams();
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
                    navigate(ADMIN_ROUTES.PROJECTS);
                } else {
                    alert(response?.message);
                }
            } catch (error) {
                alert(error);
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
                    projectDuration: response.data.data.projectDuration || "",
                    technologiesUsed: response.data.data.technologiesUsed || "",
                    projectStartDate: response.data.data.projectStartDate || new Date(),
                    projectEndDate: response.data.data.projectEndDate || new Date(),
                });
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error fetching education data:", error);
            alert("Failed to load education data");
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

