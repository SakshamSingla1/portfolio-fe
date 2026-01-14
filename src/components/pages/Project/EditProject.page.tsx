import { useEffect, useState } from "react";
import { useProjectService, type Project, type ProjectResponse } from "../../../services/useProjectService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectsForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditProjectPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [project, setProject] = useState<ProjectResponse | null>(null);

    const handleSubmit = async (values: Project) => {
        try {
            if (!id) return;
            const response = await projectService.update(String(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.PROJECTS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getProject = async (id: string | null) => {
        try {
            const response = await projectService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setProject(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getProject(String(id));
        }
    }, [id]);

    return (
        <div>
            <ProjectFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                projects={project}
            />
        </div>
    );
};

export default EditProjectPage;