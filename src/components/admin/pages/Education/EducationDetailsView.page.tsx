import { useEffect } from "react";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { Education, useEducationService } from "../../../../services/useEducationService";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HTTP_STATUS, MODE , ADMIN_ROUTES} from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
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

const EducationDetailsViewPage = () => {
    const educationService = useEducationService();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { degree } = useParams<{ degree: string }>();
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
            grade: "",
            gradeType: "",
            profileId: user?.id?.toString(),
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    useEffect(() => {
        const fetchEducationData = async () => {
            if (!degree) {
                console.error("No degree provided in URL");
                return;
            }

            try {
                const response = await educationService.getByDegree(degree);
                if (response?.status === HTTP_STATUS.OK && response.data) {
                    formik.setValues({
                        institution: response.data.data.institution || "",
                        degree: response.data.data.degree || "",
                        fieldOfStudy: response.data.data.fieldOfStudy || "",
                        startYear: response.data.data.startYear?.toString() || "",
                        endYear: response.data.data.endYear?.toString() || "",
                        description: response.data.data.description || "",
                        location: response.data.data.location || "",
                        grade: response.data.data.grade.trim().split(" ")[0] || "",
                        gradeType: response.data.data.grade.trim().split(" ")[1] || "",
                    });
                    showSnackbar('success',`${response?.data?.message}`);
                }
            } catch (error) {
                showSnackbar('error',`${error}`);
            }
        };

        fetchEducationData();
    }, [degree]);

    return (
        <div>
            <EducationFormTemplate formik={formik} mode={MODE.VIEW} onClose={() => navigate(ADMIN_ROUTES.EDUCATION)} />
        </div>
    );
};

export default EducationDetailsViewPage;