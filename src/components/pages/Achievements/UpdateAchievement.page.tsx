import { useEffect, useState } from "react";
import { useAchievementService, type Achievement, type AchievementRequest } from "../../../services/useAchievementService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import AchievementFormTemplate from "../../templates/Achievements/AchievementForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditAchievementPage = () => {
    const achievementService = useAchievementService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [achievement, setAchievement] = useState<Achievement | null>(null);

    const handleSubmit = async (values: AchievementRequest) => {
        try {
            if (!id) return;
            const response = await achievementService.update(String(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.ACHIEVEMENTS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getAchievement = async (id: string | null) => {
        try {
            const response = await achievementService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setAchievement(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getAchievement(String(id));
        }
    }, [id]);

    return (
        <div>
            <AchievementFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                achievement={achievement}
            />
        </div>
    );
};

export default EditAchievementPage;