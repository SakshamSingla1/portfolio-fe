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
import { useColors } from "../../../utils/types";

const validationSchema = Yup.object().shape({
    institution: Yup.string()
        .required('Institution is required'),
    degree: Yup.string()
        .required('Degree is required'),
    fieldOfStudy: Yup.string()
        .required('Field of study is required'),
    startYear: Yup.number()
        .required('Start year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Invalid year'),
    endYear: Yup.number()
        .required('End year is required')
        .min(Yup.ref('startYear'), 'End year must be after start year')
        .max(new Date().getFullYear() + 5, 'Invalid year'),
    location: Yup.string()
        .required('Location is required'),
    description: Yup.string()
        .required('Description is required'),
    grade: Yup.string()
        .required('Grade is required')
});

interface EducationFormProps {
    onSubmit: (values: Education) => void;
    mode: string;
    education?: Education | null;
}

const EducationFormTemplate: React.FC<EducationFormProps> = ({ onSubmit, mode, education }) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();
    const colors = useColors();

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
                            onChange={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('institution', newValue);
                            }}
                            required={true}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.institution && Boolean(formik.errors.institution)}
                            helperText={Boolean(formik.touched.institution && formik.errors.institution) ? formik.errors.institution : ""}
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
                            required={true}
                            error={formik.touched.degree && Boolean(formik.errors.degree)}
                            helperText={Boolean(formik.touched.degree && formik.errors.degree) ? formik.errors.degree : ""}
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
                            onChange={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('fieldOfStudy', newValue);
                            }}
                            required={true}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)}
                            helperText={Boolean(formik.touched.fieldOfStudy && formik.errors.fieldOfStudy) ? formik.errors.fieldOfStudy : ""}
                        />
                        <TextField
                            label="Location"
                            placeholder='City, Country'
                            {...formik.getFieldProps("location")}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('location', newValue);
                            }}
                            required={true}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={Boolean(formik.touched.location && formik.errors.location) ? formik.errors.location : ""}
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
                            required={true}
                            isDisabled={mode === MODE.VIEW}
                            error={formik.touched.gradeType && Boolean(formik.errors.gradeType)}
                            helperText={Boolean(formik.touched.gradeType && formik.errors.gradeType) ? formik.errors.gradeType : ""}
                        />
                        <TextField
                            label="Grade"
                            placeholder='e.g., 8.75 or A+'
                            value={formik.values.grade}
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
                            required={true}
                            error={formik.touched.grade && Boolean(formik.errors.grade)}
                            helperText={Boolean(formik.touched.grade && formik.errors.grade) ? formik.errors.grade : ""}                       
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
                            inputProps={{ maxLength: 4 }}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('startYear', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                            required={true}
                            error={formik.touched.startYear && Boolean(formik.errors.startYear)}
                            helperText={Boolean(formik.touched.startYear && formik.errors.startYear) ? formik.errors.startYear : ""}
                        />
                        <TextField
                            label="End Year"
                            placeholder='e.g., 2023'
                            {...formik.getFieldProps("endYear")}
                            inputProps={{ maxLength: 4 }}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('endYear', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                            required={true}
                            error={formik.touched.endYear && Boolean(formik.errors.endYear)}
                            helperText={Boolean(formik.touched.endYear && formik.errors.endYear) ? formik.errors.endYear : ""}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mt-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Description <span style={{ color: colors.error600 }}>*</span>
                        </h3>
                        <RichTextEditor
                            label="Description"
                            placeholder="Enter Description"
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue("description", value)}
                            isEditMode = {mode !== MODE.VIEW}
                            required
                        />
                        {Boolean(formik.errors.description && formik.touched.description) && (
                            <div className="mt-2 text-xs"
                            style={{ color: colors.error600 }}>
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
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default EducationFormTemplate;