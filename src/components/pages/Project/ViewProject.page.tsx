import { useEffect, useState } from "react";
import { useProjectService, type ProjectResponse } from "../../../services/useProjectService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import ProjectFormTemplate from "../../templates/Project/ProjectsForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewProjectPage = () => {
    const projectService = useProjectService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [project, setProject] = useState<ProjectResponse | null>(null);

    const getProject = async (id: number | null) => {
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
            getProject(id);
        }
    }, [id]);

    return (
        <div>
            <ProjectFormTemplate
                onSubmit={() => { }}
                mode={MODE.VIEW}
                projects={project}
            />
        </div>
    );
};

export default ViewProjectPage;