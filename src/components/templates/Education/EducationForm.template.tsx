import TextField from "../../atoms/TextField/TextField";
import { DEGREE_OPTIONS, MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";
import { GradeType, type Education } from "../../../services/useEducationService";
import { InputAdornment } from "@mui/material";
import { useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";

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

interface EducationFormProps {
    onSubmit: (values: Education) => void;
    mode: string;
    education?: Education | null;
}

const EducationFormTemplate: React.FC<EducationFormProps> = ({ onSubmit, mode, education }) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const descriptionEditor = useRef(null);

    const joditConfiguration = useMemo(() => {
        return {
            readonly: mode === MODE.VIEW,
            placeholder: "Start typing your description here...",
            buttons: [
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'ul', 'ol', '|',
                'outdent', 'indent', '|',
                'font', 'fontsize', 'paragraph', '|',
                'image', 'link', '|',
                'align', '|',
                'undo', 'redo', '|',
                'source'
            ],
            style: {
                font: '14px Inter, sans-serif',
                color: '#1F2937',
                background: '#FFFFFF',
            },
            height: 300,
            minHeight: 200,
            maxHeight: 600,
            toolbarButtonSize: 'middle' as const,
            showCharsCounter: false,
            showWordsCounter: false,
            showXPathInStatusbar: false,
            theme: 'default',
            uploader: {
                insertImageAsBase64URI: true
            },
            controls: {
                font: {
                    list: {
                        'Inter, sans-serif': 'Inter',
                        'Arial, sans-serif': 'Arial',
                        'Georgia, serif': 'Georgia',
                        'Impact, Charcoal, sans-serif': 'Impact',
                        'Tahoma, Geneva, sans-serif': 'Tahoma',
                        'Times New Roman, serif': 'Times New Roman',
                        'Verdana, Geneva, sans-serif': 'Verdana'
                    }
                },
                fontSize: {
                    list: ['8', '10', '12', '14', '16', '18', '24', '30', '36', '48']
                }
            },
            extraButtons: [],
            textIcons: false,
            toolbarAdaptive: true,
            showPlaceholder: true,
            spellcheck: true,
            colors: {
                greyscale: ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#D7D7D7', '#F4F5F7', '#FFFFFF'],
                palette: ['#3AA8F5', '#6C757D', '#6F42C1', '#E83E8C', '#FD7E14', '#20C997', '#28A745', '#FFC107', '#DC3545']
            }
        };
    }, [mode]);

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

    useEffect(() => {
        console.log("formik.values", formik);
    }, [formik]);

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add Education" : mode === MODE.EDIT ? "Edit Education" : "Education Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD
                        ? "Add your academic achievement to your profile"
                        : mode === MODE.EDIT
                            ? "Update your education information"
                            : "View education details"}
                </p>
            </div>

            <div className="space-y-8">
                {/* Basic Information */}
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
                        <Select
                            label="Degree"
                            placeholder='Select degree'
                            options={DEGREE_OPTIONS}
                            value={formik.values.degree}
                            error={formik.touched.degree && Boolean(formik.errors.degree)}
                            onChange={(value: string | number) => {
                                const newValue = typeof value === 'string' ? titleModification(value) : value;
                                formik.setFieldValue('degree', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                {/* Details */}
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
                        <Select
                            label="Grade Type"
                            placeholder='Select grade type'
                            options={GradeType}
                            value={formik.values.gradeType}
                            error={formik.touched.gradeType && Boolean(formik.errors.gradeType)}
                            onChange={(value: string | number) => {
                                const newValue = typeof value === 'string' ? titleModification(value) : value;
                                formik.setFieldValue('gradeType', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Grade"
                            placeholder='e.g., 8.75 or A+'
                            value={formik.values.grade}
                            error={formik.touched.grade && Boolean(formik.errors.grade)}
                            onChange={(event: any) => {
                                const newValue = event.target.value;
                                formik.setFieldValue('grade', newValue);
                                console.log(newValue);
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

                {/* Timeline */}
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

                {/* Job Description Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mt-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Job Description
                        </h3>
                        <JoditEditor
                            ref={descriptionEditor}
                            value={formik.values.description ?? ""}
                            onChange={(newContent) => {
                                formik.setFieldValue("description", newContent);
                            }}
                            config={joditConfiguration}
                            onBlur={(newContent) => {
                                formik.setFieldTouched("description", true);
                                formik.setFieldValue("description", newContent);
                            }}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <div className="mt-2 text-sm text-red-600">
                                {formik.errors.description}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={onClose}
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add Education" : "Update Education"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || !formik.isValid}
                        />
                    )}
                </div>
            </div>
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <EducationCard
                    education={formik.values}
                />
            </div> */}
        </div>
    )
}

export default EducationFormTemplate;