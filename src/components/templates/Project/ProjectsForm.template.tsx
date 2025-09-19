import React, { useMemo, useState, useEffect, useRef } from "react";
import { type FormikProps, useFormik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import Checkbox from "../../atoms/Checkbox/Checkbox";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { type Project, type ProjectResponse } from "../../../services/useProjectService";
import { useSkillService, type SkillDropdown } from "../../../services/useSkillService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../atoms/Chip/Chip";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import JoditEditor from 'jodit-react';
import { createUseStyles } from "react-jss";
import { HTTP_STATUS } from '../../../utils/types';
import { useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

const useStyles = createUseStyles({
    '@global': {
        '.jodit-add-new-line, .jodit-add-new-line *': {
            display: 'none !important',
            boxSizing: 'border-box',
        }
    }
})

const validationSchema = Yup.object().shape({
    projectName: Yup.string()
        .required('Project name is required')
        .max(100, 'Project name is too long'),
    projectDescription: Yup.string()
        .required('Project description is required')
        .max(500, 'Project description is too long'),
    projectLink: Yup.string()
        .required('Project link is required')
        .url('Must be a valid URL'),
    technologiesUsed: Yup.array()
        .of(Yup.number())
        .min(1, 'At least one technology is required'),
    projectStartDate: Yup.date()
        .required('Start date is required'),
    projectEndDate: Yup.date()
        .min(Yup.ref('projectStartDate'), 'End date must be after start date')
        .nullable(),
    currentlyWorking: Yup.boolean()
        .required('Currently working status is required'),
    projectImageUrl: Yup.string()
        .url('Must be a valid URL')
        .nullable()
});

interface ProjectFormProps {
    onSubmit: (values: Project) => void;
    mode: string;
    projects?: ProjectResponse | null;
}

const ProjectFormTemplate = ({ onSubmit, mode, projects }: ProjectFormProps) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();
    const [isSkillsLoading, setIsSkillsLoading] = useState(false);

    const skillService = useSkillService();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);

    const descriptionEditor = useRef(null);

    const joditConfiguration = useMemo(() => {
        return {
            readonly: mode === MODE.VIEW,
            placeholder: "Start typing your project description here...",
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

    const onClose = () => navigate(ADMIN_ROUTES.EXPERIENCE);

    const formik = useFormik<Project>({
        initialValues: {
            projectName: "",
            projectDescription: "",
            projectLink: "",
            technologiesUsed: [],
            projectStartDate: "",
            projectEndDate: "",
            currentlyWorking: false,
            projectImageUrl: "",
            profileId: user?.id
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

    const loadSkillsDropdown = async (searchTerm?: string) => {
        try {
            setIsSkillsLoading(true);
            const response = await skillService.getByProfile({
                search: searchTerm || "",
            })
            if (response?.status === HTTP_STATUS.OK) {
                const skillsData = response?.data?.data?.content;
                setSkills(Array.isArray(skillsData) ? skillsData : []);
            } else {
                setSkills([]);
            }
        }
        catch (error) {
            setSkills([]);
            // In a real app, you might want to show a toast/notification here
            console.error('Failed to load skills:', error);
        } finally {
            setIsSkillsLoading(false);
        }
    }

    useEffect(() => {
        if (projects) {
            formik.setFieldValue("projectName", projects.projectName || "");
            formik.setFieldValue("projectDescription", projects.projectDescription || "");
            formik.setFieldValue("projectLink", projects.projectLink || "");
            formik.setFieldValue("technologiesUsed", projects.technologiesUsed.map((skill) => skill.id) || []);
            formik.setFieldValue("projectStartDate", projects.projectStartDate || "");
            formik.setFieldValue("projectEndDate", projects.projectEndDate || "");
            formik.setFieldValue("currentlyWorking", projects.currentlyWorking || false);
            formik.setFieldValue("projectImageUrl", projects.projectImageUrl || "");
        }
    }, [projects]);

    useEffect(() => {
        loadSkillsDropdown();
    }, []);

    useEffect(() => {
        console.log(formik)
    }, [formik])

    const skillOptions = useMemo(() => {
        return skills.map((skill) => ({
            label: <div className="flex items-center gap-2">
                <img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" /> {skill.logoName}</div>,
            title: skill.logoName,
            value: skill.id,
        }))
    }, [skills])

    const selectedSkills = useMemo(() => {
        return skills.filter(skill => formik.values.technologiesUsed.includes(skill.id));
    }, [skills, formik.values.technologiesUsed]);

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD
                        ? "Create New Project"
                        : mode === MODE.EDIT
                            ? "Edit Project"
                            : "Project Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD
                        ? "Add a new project to your portfolio"
                        : mode === MODE.EDIT
                            ? "Update your project information"
                            : "View project details"}
                </p>
            </div>

            <div className="space-y-8 transition-opacity duration-200" style={{ opacity: isSkillsLoading ? 0.7 : 1 }}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-16">
                            <TextField
                                label="Project Name"
                                placeholder="Enter your project name"
                                {...formik.getFieldProps("projectName")}
                                error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                                helperText={formik.errors.projectName}
                                disabled={mode === MODE.VIEW}
                                onBlur={(event: any) => {
                                    const newValue = titleModification(event.target.value.trim());
                                    formik.setFieldValue("projectName", newValue);
                                }}
                            />
                            <TextField
                                label="Project Link"
                                placeholder="https://your-project-url.com"
                                {...formik.getFieldProps("projectLink")}
                                error={formik.touched.projectLink && Boolean(formik.errors.projectLink)}
                                helperText={formik.errors.projectLink}
                                inputProps={{ readOnly: mode === MODE.VIEW }}
                                onBlur={(event: any) => {
                                    const newValue = event.target.value.trim();
                                    formik.setFieldValue("projectLink", newValue);
                                }}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="h-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Image
                                </label>
                                <ImageUpload
                                    uploadMode="single"
                                    value={formik.values.projectImageUrl}
                                    onChange={(url) => formik.setFieldValue('projectImageUrl', url)}
                                    label="Upload Project Image"
                                    disabled={mode === MODE.VIEW}
                                    error={formik.touched.projectImageUrl && Boolean(formik.errors.projectImageUrl)}
                                    helperText={formik.errors.projectImageUrl}
                                    width="100%"
                                    height="200px"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technologies Section */}
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
                                    if (!formik.values.technologiesUsed.includes(selectedOption.value)) {
                                        formik.setFieldValue("technologiesUsed", [...formik.values.technologiesUsed, selectedOption.value]);
                                    } else {
                                        console.log(`${selectedOption.title} is already added to the experience`);
                                    }
                                }
                            }}
                            onSearch={(value: string) => {
                                loadSkillsDropdown(value);
                            }}
                            error={formik.touched.technologiesUsed && Boolean(formik.errors.technologiesUsed)}
                            helperText={formik.errors.technologiesUsed && formik.touched.technologiesUsed ?
                                Array.isArray(formik.errors.technologiesUsed)
                                    ? formik.errors.technologiesUsed.join(', ')
                                    : formik.errors.technologiesUsed
                                : "Search and select the technologies used in this experience"}
                            isDisabled={mode === MODE.VIEW}
                        />
                        {(selectedSkills.length > 0 || formik.values.technologiesUsed.length > 0) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Selected Technologies ({selectedSkills.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.map((skill) => (
                                        mode !== MODE.VIEW ? (
                                            <Chip
                                                key={skill.id}
                                                label={<div className="flex items-center gap-2"><img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" /> {skill.logoName}</div>}
                                                onDelete={() => {
                                                    const updatedTechs = formik.values.technologiesUsed.filter((tech: any) => {
                                                        const techId = typeof tech === 'object' && tech !== null && 'id' in tech ? tech.id : tech;
                                                        return techId !== skill.id;
                                                    });
                                                    formik.setFieldValue("technologiesUsed", updatedTechs);
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                key={skill.id}
                                                label={<div className="flex items-center gap-2"><img src={skill.logoUrl} alt={skill.logoName} className="w-6 h-6" /> {skill.logoName}</div>}
                                                onDelete={() => { }}
                                            />
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
                        Project Timeline
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DatePicker
                                label="Start Date"
                                value={formik.values.projectStartDate ? dayjs(formik.values.projectStartDate) : null}
                                onChange={(newValue) =>
                                    formik.setFieldValue("projectStartDate", newValue?.toDate())
                                }
                                error={!!formik.touched.projectStartDate && Boolean(formik.errors.projectStartDate)}
                                helperText={typeof formik.errors.projectStartDate === 'string' ? formik.errors.projectStartDate : undefined}
                                fullWidth
                                disabled={mode === MODE.VIEW}
                            />
                            <DatePicker
                                label="End Date"
                                value={formik.values.projectEndDate ? dayjs(formik.values.projectEndDate) : null}
                                onChange={(newValue) =>
                                    formik.setFieldValue("projectEndDate", newValue?.toDate())
                                }
                                error={!!formik.touched.projectEndDate && Boolean(formik.errors.projectEndDate)}
                                helperText={typeof formik.errors.projectEndDate === 'string' ? formik.errors.projectEndDate : undefined}
                                fullWidth
                                disabled={mode === MODE.VIEW || formik.values.currentlyWorking}
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <Checkbox
                                label="Currently Working on this Project"
                                checked={formik.values.currentlyWorking || false}
                                onChange={(checked) => {
                                    formik.setFieldValue("currentlyWorking", checked);
                                    if (checked) {
                                        formik.setFieldValue("projectEndDate", null);
                                    }
                                }}
                                disabled={mode === MODE.VIEW}
                                labelClassName="text-sm font-medium text-gray-700"
                            />
                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                Check this if the project is still in progress
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="mt-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            Job Description
                        </h3>
                        <JoditEditor
                            ref={descriptionEditor}
                            value={formik.values.projectDescription ?? ""}
                            onChange={(newContent) => {
                                formik.setFieldValue("projectDescription", newContent);
                            }}
                            config={joditConfiguration}
                            onBlur={(newContent) => {
                                formik.setFieldTouched("projectDescription", true);
                                formik.setFieldValue("projectDescription", newContent);
                            }}
                        />
                        {formik.errors.projectDescription && formik.touched.projectDescription && (
                            <div className="mt-2 text-sm text-red-600">
                                {formik.errors.projectDescription}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                        disabled={formik.isSubmitting}
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={
                                formik.isSubmitting
                                    ? mode === MODE.ADD
                                        ? "Creating Project..."
                                        : "Updating Project..."
                                    : mode === MODE.ADD
                                        ? "Create Project"
                                        : "Update Project"
                            }
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || !formik.isValid}
                            className="w-full sm:w-auto"
                            startIcon={
                                formik.isSubmitting && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFormTemplate;
