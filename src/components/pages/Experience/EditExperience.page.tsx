import { useEffect, useState } from "react";
import { useExperienceService, type ExperienceRequest, type ExperienceResponse } from "../../../services/useExperienceService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import ExperienceFormTemplate from "../../templates/Experience/ExperienceForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditExperiencePage = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [experience, setExperience] = useState<ExperienceResponse | null>(null);

    const handleSubmit = async (values: ExperienceRequest) => {
        try {
            if (!id) return;
            const response = await experienceService.update(id, values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.EXPERIENCE);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getExperience = async (id: number | null) => {
        try {
            const response = await experienceService.getById(Number(id));
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setExperience(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getExperience(Number(id));
        }
    }, [id]);

    return (
        <div>
            <ExperienceFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                experience={experience}
            />
        </div>
    );
};

export default EditExperiencePage;