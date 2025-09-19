import { useProjectService, type Project } from "../../../services/useProjectService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import ProjectsFormTemplate from "../../templates/Project/ProjectsForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddProjectPage = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.PROJECTS);

    const handleSubmit = async (values: Project) => {
        try {
            const response = await projectService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.PROJECTS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <ProjectsFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddProjectPage;
