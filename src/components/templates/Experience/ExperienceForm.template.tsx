import React, { useEffect, useState , useMemo} from "react";
import TextField from "../../atoms/TextField/TextField";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import dayjs from "dayjs";
import { useSkillService, type SkillDropdown } from "../../../services/useSkillService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../atoms/Chip/Chip";
import { EmploymentStatus, type ExperienceRequest, type ExperienceResponse } from "../../../services/useExperienceService";
import { useFormik } from "formik";
import { HTTP_STATUS } from "../../../utils/types";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

export const employmentStatusOptions = [
    { label: "Current", value: EmploymentStatus.CURRENT },
    { label: "Previous", value: EmploymentStatus.PREVIOUS },
    { label: "Internship", value: EmploymentStatus.INTERNSHIP },
    { label: "Contract", value: EmploymentStatus.CONTRACT },
    { label: "Freelance", value: EmploymentStatus.FREELANCE },
];

const validationSchema = Yup.object().shape({
    companyName: Yup.string()
        .required('Company name is required')
        .max(100, 'Company name is too long'),
    jobTitle: Yup.string()
        .required('Job title is required')
        .max(100, 'Job title is too long'),
    location: Yup.string()
        .required('Location is required')
        .max(100, 'Location is too long'),
    startDate: Yup.date()
        .required('Start date is required'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End date must be after start date')
        .notRequired()
        .nullable(),
    employmentStatus: Yup.string()
        .required('Employment status is required'),
    description: Yup.string()
        .max(500, 'Description is too long'),
    skillIds: Yup.array(Yup.string())
        .min(1, 'At least one skill is required'),
});

interface ExperienceFormProps {
    onSubmit: (values: ExperienceRequest) => void;
    mode: string;
    experience?: ExperienceResponse | null;
}

const ExperienceFormTemplate: React.FC<ExperienceFormProps> = ({ onSubmit, mode, experience }) => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);

    const onClose = () => navigate(ADMIN_ROUTES.EXPERIENCE);

    const formik = useFormik<ExperienceRequest>({
        initialValues: {
            companyName: "",
            jobTitle: "",
            location: "",
            startDate: "",
            endDate: "",
            employmentStatus: EmploymentStatus.CURRENT,
            description: "",
            skillIds: [],
            profileId: String(user?.id),
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const payload = {
                ...values,
            };
            setSubmitting(true);
            if (mode !== MODE.VIEW) {
                await onSubmit(payload);
            } else {
                onClose();
            }
            setSubmitting(false);
        },
    });

    const loadSkills = async (searchTerm?: string) => {
        try {
            const response = await skillService.getByProfile({
                search: searchTerm || "",
            });
            if (response?.status === HTTP_STATUS.OK) {
                setSkills(response?.data?.data?.content);
            }
        } catch (error) {
            setSkills([]);
        }
    }

    const skillOptions = useMemo(() => {
        return skills.map((skill) => ({
            label: <div className="flex items-center gap-2"><img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" />{skill.logoName}</div>,
            title: skill.logoName,
            value: skill.id,
        }));
    }, [skills]);

    const selectedSkills = useMemo(() => {
        return skills.filter(skill => formik.values.skillIds.includes(String(skill.id)));
    }, [skills, formik.values.skillIds]);


    useEffect(() => {
        if (experience) {
            formik.setFieldValue("companyName", experience.companyName || "");
            formik.setFieldValue("jobTitle", experience.jobTitle || "");
            formik.setFieldValue("location", experience.location || "");
            formik.setFieldValue("startDate", experience.startDate || "");
            formik.setFieldValue("endDate", experience.endDate || "");
            formik.setFieldValue("employmentStatus", experience.employmentStatus || EmploymentStatus.CURRENT);
            formik.setFieldValue("description", experience.description || "");
            formik.setFieldValue("skillIds", experience.skills.map((skill) => String(skill.id)) || []);
        }
    }, [experience]);

    useEffect(() => {
        loadSkills();
    }, []);

    useEffect(() => {
        console.log("formik", formik);
    }, [formik]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add New Experience" : mode === MODE.EDIT ? "Edit Experience" : "Experience Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD ? "Add your professional experience to your portfolio" : mode === MODE.EDIT ? "Update your experience information" : "View experience details"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TextField
                            label="Company Name"
                            placeholder="Enter company name"
                            {...formik.getFieldProps("companyName")}
                            error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                            helperText={formik.errors.companyName}
                            onBlur={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('companyName', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Job Title"
                            placeholder="Enter your job title"
                            {...formik.getFieldProps("jobTitle")}
                            error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                            helperText={formik.errors.jobTitle}
                            onBlur={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('jobTitle', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                    <div className="mt-6">
                        <TextField
                            label="Location"
                            placeholder="Enter work location (e.g., San Francisco, CA)"
                            {...formik.getFieldProps("location")}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.errors.location}
                            onBlur={(event: any) => {
                                const newValue = titleModification(event.target.value);
                                formik.setFieldValue('location', newValue);
                            }}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Technologies Used
                    </h3>
                    <div className="space-y-4">
                        <AutoCompleteInput
                            label="Search and Add Technologies"
                            placeHolder="Type to search technologies (React, Node.js, Python...)"
                            options={skillOptions}
                            value={null}
                            onChange={(selectedOption: any) => {
                                if (selectedOption) {
                                    if (!formik.values.skillIds.includes(selectedOption.value)) {
                                        formik.setFieldValue("skillIds", [...formik.values.skillIds, selectedOption.value]);
                                    } else {
                                        console.log(`${selectedOption.title} is already added to the experience`);
                                    }
                                }
                            }}
                            onSearch={(value: string) => loadSkills(value)}
                            error={formik.touched.skillIds && Boolean(formik.errors.skillIds)}
                            helperText={formik.errors.skillIds && formik.touched.skillIds ? Array.isArray(formik.errors.skillIds) ? formik.errors.skillIds.join(', ') : formik.errors.skillIds : "Search and select the technologies used in this experience"}
                            isDisabled={mode === MODE.VIEW}
                        />
                        {(selectedSkills.length > 0 || formik.values.skillIds.length > 0) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Selected Technologies ({selectedSkills.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.map((skill) => (
                                        mode !== MODE.VIEW ? (
                                            <Chip key={skill.id} label={<div className="flex items-center gap-2"><img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" /> {skill.logoName}</div>} onDelete={() => {
                                                    const updatedTechs = formik.values.skillIds.filter((tech: any) => {
                                                        const techId = typeof tech === 'object' && tech !== null && 'id' in tech ? tech.id : tech;
                                                        return techId !== skill.id;
                                                    });
                                                    formik.setFieldValue("skillIds", updatedTechs);
                                                }} />
                                        ) : (
                                            <Chip key={skill.id} label={<div className="flex items-center gap-2"><img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" /> {skill.logoName}</div>} onDelete={() => { }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Employment Timeline
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DatePicker
                                label="Start Date"
                                value={formik.values.startDate ? dayjs(formik.values.startDate) : null}
                                onChange={(newValue) => formik.setFieldValue("startDate", newValue?.format("YYYY-MM-DD"))}
                                error={!!formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helperText={formik.errors.startDate}
                                fullWidth
                                disabled={mode === MODE.VIEW}
                            />
                            <DatePicker
                                label="End Date"
                                value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
                                onChange={(newValue) => formik.setFieldValue("endDate", newValue?.format("YYYY-MM-DD"))}
                                error={!!formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.errors.endDate}
                                fullWidth
                                disabled={mode === MODE.VIEW || formik.values.employmentStatus === EmploymentStatus.CURRENT}
                            />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <AutoCompleteInput
                                label="Employment Status"
                                placeHolder="Select Employment Status"
                                options={employmentStatusOptions}
                                value={formik.values.employmentStatus ? employmentStatusOptions.find(option => option.value === formik.values.employmentStatus) : null}
                                onChange={(option: any) => option && formik.setFieldValue("employmentStatus", option.value)}
                                onSearch={() => { }}
                                error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
                                helperText={formik.touched.employmentStatus ? formik.errors.employmentStatus : "Select the employment status"}
                                isDisabled={mode === MODE.VIEW}
                            />
                        </div>
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
                        disabled={!formik.isValid || formik.isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default ExperienceFormTemplate;