import React, { useEffect } from "react";
import { useSkillService } from "../../../../services/useSkillService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import SkillFormTemplate from "../../templates/Skill/SkillForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Skill name is required')
        .max(50, 'Skill name is too long'),
    level: Yup.string()
        .required('Skill level is required')
        .max(50, 'Skill level is too long'),
    category: Yup.string()
        .required('Skill category is required')
        .max(50, 'Skill category is too long'),
});

const SkillEditDetailsPage = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.SKILL);

    const formik = useFormik({
        initialValues: {
            name: "",
            level: "",
            category: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (!id) return;
                const response = await skillService.update(id, values);
                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar('success',`${response?.data?.message}`);
                    onClose();
                } else {
                    showSnackbar('error',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        }
    });

    const getSkill = async (id: string) => {
        try {
            const response = await skillService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                formik.setValues({
                    name: response.data.data.name || "",
                    level: response.data.data.level || "",
                    category: response.data.data.category || "",
                });
                showSnackbar('success',`${response?.data?.message}`);
            } else {
                showSnackbar('error',`${response?.data?.message}`);
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
                formik={formik}
                mode={MODE.EDIT}  // Changed from MODE.ADD to MODE.EDIT
                onClose={onClose}
            />
        </div>
    );
};

export default SkillEditDetailsPage;