import TextField from "../../atoms/TextField/TextField";
import { DEGREE_OPTIONS, MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import { GradeType, type Education } from "../../../services/useEducationService";
import { InputAdornment } from "@mui/material";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";

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
        .required('Description is required')
        .min(120, 'Description must be at least 120 characters long')
        .max(500, 'Description is too long'),
    grade: Yup.string()
        .required('Grade is required')
        .max(10, 'Grade is too long')
});

interface EducationFormProps {
    onSubmit: (values: Education) => void;
    mode: string;
    education?: Education | null;
}

const EducationFormTemplate: React.FC<EducationFormProps> = ({ onSubmit, mode, education }) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const onClose = () => navigate(ADMIN_ROUTES.EDUCATION);

    const formik = useFormik<Education>({
        initialValues: {
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startYear: '',
            endYear: '',
            location: '',
            description: '',
            grade: '',
            profileId: user?.id?.toString(),
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const payload={
                ...values,
                grade: values.grade + " " + values.gradeType
            }
            setSubmitting(true);
            if (mode !== MODE.VIEW) {
                await onSubmit(payload);
            } else {
                onClose();
            }
            setSubmitting(false);
        },
    });

    useEffect(() => {
        if (education) {
            formik.setFieldValue("institution", education.institution);
            formik.setFieldValue("degree", education.degree);
            formik.setFieldValue("fieldOfStudy", education.fieldOfStudy);
            formik.setFieldValue("startYear", education.startYear);
            formik.setFieldValue("endYear", education.endYear);
            formik.setFieldValue("location", education.location);
            formik.setFieldValue("description", education.description);
            formik.setFieldValue("grade", education.grade?.trim().split(" ")[0] || "");
            formik.setFieldValue("gradeType", education.grade?.trim().split(" ")[1] || "");
        }
    }, [education]);
    
    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add Education" : mode === MODE.EDIT ? "Edit Education" : "Education Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD? "Add your academic achievement to your profile": mode === MODE.EDIT? "Update your education information": "View education details"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Institution"
                            placeholder='Enter institution name'
                            {...formik.getFieldProps("institution")}
                            error={formik.touched.institution && Boolean(formik.errors.institution)}
                            onChange={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('institution', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <AutoCompleteInput
                            label="Degree"
                            placeHolder="Search and select a degree"
                            options={DEGREE_OPTIONS}
                            value={DEGREE_OPTIONS.find(option => option.value === formik.values.degree) || null}
                            onSearch={() => { }}
                            onChange={(value: any) => {
                                formik.setFieldValue("degree", value?.value ?? null);
                            }}
                            isDisabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Field of Study"
                            placeholder='Enter field of study'
                            {...formik.getFieldProps("fieldOfStudy")}
                            error={formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)}
                            onChange={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('fieldOfStudy', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Location"
                            placeholder='City, Country'
                            {...formik.getFieldProps("location")}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('location', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <AutoCompleteInput
                            label="Grade Type"
                            placeHolder="Search and select a grade type"
                            options={GradeType}
                            value={GradeType.find(option => option.value === formik.values.gradeType) || null}
                            onSearch={() => { }}
                            onChange={value => {
                                formik.setFieldValue('gradeType', value?.value ?? '');
                            }}
                            isDisabled={false}
                        />
                        <TextField
                            label="Grade"
                            placeholder='e.g., 8.75 or A+'
                            value={formik.values.grade}
                            error={formik.touched.grade && Boolean(formik.errors.grade)}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('grade', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                            InputProps={{
                                endAdornment: formik.values.gradeType && (
                                    <InputAdornment position="end">
                                        {formik.values.gradeType === "Percentage" ? "%" : formik.values.gradeType}
                                    </InputAdornment>
                                )
                            }}
                            helperText={formik.values.gradeType && `Grade will be displayed as: ${formik.values.grade} ${formik.values.gradeType}`}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Timeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Start Year"
                            placeholder='e.g., 2019'
                            {...formik.getFieldProps("startYear")}
                            error={formik.touched.startYear && Boolean(formik.errors.startYear)}
                            inputProps={{ maxLength: 4 }}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('startYear', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="End Year"
                            placeholder='e.g., 2023'
                            {...formik.getFieldProps("endYear")}
                            error={formik.touched.endYear && Boolean(formik.errors.endYear)}
                            inputProps={{ maxLength: 4 }}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('endYear', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mt-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Job Description
                        </h3>
                        <RichTextEditor
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue("description", value)}
                            readonly={mode === MODE.VIEW}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <div className="mt-2 text-sm text-red-600">
                                {formik.errors.description}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-between gap-3">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={onClose}
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add" : "Update"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || !formik.isValid}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default EducationFormTemplate;