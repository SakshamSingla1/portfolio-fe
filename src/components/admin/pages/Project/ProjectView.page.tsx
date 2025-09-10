import {useEffect} from "react";
import { Project, useProjectService } from "../../../../services/useProjectService";
import { useFormik } from "formik";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const ProjectViewDetailsPage = () => {
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
        onSubmit: async () => { }
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
            <ProjectFormTemplate formik={formik} mode={MODE.VIEW} onClose={() => navigate(ADMIN_ROUTES.PROJECTS)} />
        </div>
    )
}
export default ProjectViewDetailsPage;

