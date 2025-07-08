import React,{useEffect, useRef} from "react";
import { useEducationService } from "../../../../services/useEducationService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ADMIN_ROUTES, HTTP_STATUS, MODE } from "../../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

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
        .max(500, 'Description is too long')
});

const EducationEditDetailsPage = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const { degree } = useParams();
    const formikRef = useRef<any>(null);
    const { showSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
            description: "",
            location: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (!degree) {
                    alert("Degree is required");
                    return;
                }
                const response = await educationService.update(degree, values);
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

    const getData = async (degree: string) => {
        try {
            const response = await educationService.getByDegree(degree);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                formik.setValues({
                    institution: response.data.data.institution || "",
                    degree: response.data.data.degree || "",
                    fieldOfStudy: response.data.data.fieldOfStudy || "",
                    startYear: response.data.data.startYear || "",
                    endYear: response.data.data.endYear || "",
                    description: response.data.data.description || "",
                    location: response.data.data.location || "",
                });
                showSnackbar('success',`${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
        }
    }

    useEffect(() => {
        if (degree) {
            getData(degree);
        }
    }, [degree]);

    return (
        <div>
            <EducationFormTemplate formik={formik} mode={MODE.EDIT} onClose={() => navigate(ADMIN_ROUTES.EDUCATION)} />
        </div>
    )
}
export default EducationEditDetailsPage;