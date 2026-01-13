import { useEffect, useState } from "react";
import { useExperienceService, type ExperienceResponse } from "../../../services/useExperienceService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import ExperienceFormTemplate from "../../templates/Experience/ExperienceForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewExperiencePage = () => {
    const experienceService = useExperienceService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [experience, setExperience] = useState<ExperienceResponse | null>(null);

    const getExperience = async (id: string | null) => {
        try {
            const response = await experienceService.getById(String(id));
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setExperience(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getExperience(String(id));
        }
    }, [id]);

    return (
        <div>
            <ExperienceFormTemplate
                onSubmit={() => { }}
                mode={MODE.VIEW}
                experience={experience}
            />
        </div>
    );
};

export default ViewExperiencePage;