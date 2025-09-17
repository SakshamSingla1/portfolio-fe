import { Education, useEducationService } from "../../../../services/useEducationService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";

const validationSchema = Yup.object().shape({
    institution: Yup.string()
        .required('Institution is required')
        .max(50, 'Institution name is too long'),
    degree: Yup.string()
        .required('Degree is required')
        .max(50, 'Degree name is too long'),
    fieldOfStudy: Yup.string()
        .required('Field of study is required')
        .max(50, 'Field of study is too long'),
    startYear: Yup.number()
        .required('Start year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Invalid year'),
    endYear: Yup.number()
        .min(Yup.ref('startYear'), 'End year must be after start year')
        .max(new Date().getFullYear() + 5, 'Invalid year'),
    location: Yup.string()
        .required('Location is required')
        .max(100, 'Location is too long'),
    description: Yup.string()
        .max(500, 'Description is too long'),
    grade: Yup.string()
        .max(10, 'Grade is too long')
});

const EducationAddDetailsPage = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuthenticatedUser();

    const formik = useFormik<Education>({
        initialValues: {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
            description: "",
            location: "",
            gradeType: "",
            grade: "",
            profileId: user?.id?.toString(),
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const payload={
                    ...values,
                    grade: values.grade + " " + values.gradeType
                }
                const response = await educationService.create(payload);
                if (response?.status === HTTP_STATUS.OK) {
                    navigate(ADMIN_ROUTES.EDUCATION);
                    showSnackbar('success',`${response?.data?.message}`);
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
            <EducationFormTemplate formik={formik} mode={MODE.ADD} onClose={() => navigate(ADMIN_ROUTES.EDUCATION)} />
        </div>
    )
}
export default EducationAddDetailsPage;

