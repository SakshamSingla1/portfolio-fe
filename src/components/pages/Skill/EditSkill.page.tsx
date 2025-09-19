import React, { useEffect, useState } from "react";
import { useSkillService, type Skill } from "../../../services/useSkillService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import SkillFormTemplate from "../../templates/Skill/SkillForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const SkillEditDetailsPage = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [skill, setSkill] = useState<Skill | null>(null);

    const handleSubmit = async (values: Skill) => {
            try {
                if (!id) return;
                const response = await skillService.update(id, values);
                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar('success',`${response?.data?.message}`);
                    navigate(ADMIN_ROUTES.SKILL);
                } else {
                    showSnackbar('error',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        }

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
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                skill={skill}
            />
        </div>
    );
};

export default SkillEditDetailsPage;