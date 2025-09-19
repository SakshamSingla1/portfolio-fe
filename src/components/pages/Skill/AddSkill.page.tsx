import { useSkillService, type Skill } from "../../../services/useSkillService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import SkillFormTemplate from "../../templates/Skill/SkillForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const SkillAddDetailsPage = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.SKILL);

    const handleSubmit = async (values: Skill) => {
        try {
            const response = await skillService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.SKILL);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <SkillFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default SkillAddDetailsPage;
