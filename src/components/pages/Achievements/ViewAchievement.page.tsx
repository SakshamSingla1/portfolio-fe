import { useEffect, useState } from "react";
import { useAchievementService, type Achievement } from "../../../services/useAchievementService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import AchievementFormTemplate from "../../templates/Achievements/AchievementForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewAchievementPage = () => {
    const achievementService = useAchievementService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [achievement, setAchievement] = useState<Achievement | null>(null);

    const getAchievement = async (id: string | null) => {
        try {
            const response = await achievementService.getById(String(id));
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
                onSubmit={() => { }}
                mode={MODE.VIEW}
                achievement={achievement}
            />
        </div>
    );
};

export default ViewAchievementPage;