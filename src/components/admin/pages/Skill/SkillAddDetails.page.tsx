import { useSkillService } from "../../../../services/useSkillService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
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

const SkillAddDetailsPage = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
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
                const response = await skillService.create(values);
                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar('success',`${response?.data?.message}`);
                    onClose();
                    navigate(ADMIN_ROUTES.SKILL);
                } else {
                    showSnackbar('error',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        }
    });

    return (
        <div>
            <SkillFormTemplate
                formik={formik}
                mode={MODE.ADD}
                onClose={onClose}
            />
        </div>
    )
}
export default SkillAddDetailsPage;
