import { useAchievementService, type AchievementRequest } from "../../../services/useAchievementService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import AchievementFormTemplate from "../../templates/Achievements/AchievementForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

const AddAchievementPage = () => {
    const achievementService = useAchievementService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuthenticatedUser();

    const onClose = () => navigate(ADMIN_ROUTES.ACHIEVEMENTS);

    const handleSubmit = async (values: AchievementRequest) => {
        try {
            const response = await achievementService.create({
                ...values,
                profileId: user?.id?.toString() || "",
            });
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.ACHIEVEMENTS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <AchievementFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddAchievementPage;
