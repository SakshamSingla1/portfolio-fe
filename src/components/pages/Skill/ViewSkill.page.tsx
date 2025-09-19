import { useEffect, useState } from "react";
import { useSkillService, type Skill } from "../../../services/useSkillService";
import { MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import SkillFormTemplate from "../../templates/Skill/SkillForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const SkillViewDetailsPage = () => {
    const skillService = useSkillService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [skill, setSkill] = useState<Skill | null>(null);

    const getSkill = async (id: string) => {
        try {
            const response = await skillService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setSkill(response.data.data);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getSkill(id);
        }
    }, [id]);

    return (
        <div>
            <SkillFormTemplate
                onSubmit={() => {}}
                mode={MODE.VIEW}
                skill={skill}
            />
        </div>
    );
};

export default SkillViewDetailsPage;