import { useEffect } from "react";
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

const SkillViewDetailsPage = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.SKILL);

    const formik = useFormik({
        initialValues: {
            logoId: null,
            logoName: "",
            logoUrl: "",
            level: "",
            category: "",
        },
        validationSchema: validationSchema,
        onSubmit: () => {}
    });

    const getSkill = async (id: string) => {
        try {
            const response = await skillService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                formik.setValues({
                    logoId: response.data.data.id || null,
                    logoUrl: response.data.data.logoUrl || "",
                    logoName: response.data.data.logoName || "",
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
                mode={MODE.VIEW}
                onClose={onClose}
            />
        </div>
    );
};

export default SkillViewDetailsPage;