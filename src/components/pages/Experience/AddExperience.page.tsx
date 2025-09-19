import { useExperienceService, type ExperienceRequest } from "../../../services/useExperienceService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import ExperienceFormTemplate from "../../templates/Experience/ExperienceForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddExperiencePage = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.EXPERIENCE);

    const handleSubmit = async (values: ExperienceRequest) => {
        try {
            const response = await experienceService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.EXPERIENCE);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <ExperienceFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddExperiencePage;
