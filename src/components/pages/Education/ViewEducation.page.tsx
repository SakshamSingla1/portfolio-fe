import React, { useEffect, useState } from "react";
import { useEducationService, type Education } from "../../../services/useEducationService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewEducationPage = () => {
    const educationService = useEducationService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [education, setEducation] = useState<Education | null>(null);

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
                onSubmit={() => { }}
                mode={MODE.VIEW}
                education={education}
            />
        </div>
    );
};

export default ViewEducationPage;