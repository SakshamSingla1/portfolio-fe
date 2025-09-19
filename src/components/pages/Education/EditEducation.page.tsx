import { useEffect, useState } from "react";
import { useEducationService, type Education } from "../../../services/useEducationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditEducationPage = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [education, setEducation] = useState<Education | null>(null);

    const handleSubmit = async (values: Education) => {
        try {
            if (!id) return;
            const response = await educationService.update(id, values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.EDUCATION);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getEducation = async (id: string) => {
        try {
            const response = await educationService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setEducation(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getEducation(id);
        }
    }, [id]);

    return (
        <div>
            <EducationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                education={education}
            />
        </div>
    );
};

export default EditEducationPage;