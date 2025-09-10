import React, { useMemo, useState, useEffect } from "react";
import { FormikProps } from "formik";
import dayjs from "dayjs";

import TextField from "../../../atoms/TextField/TextField";
import Button from "../../../atoms/Button/Button";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import DatePicker from "../../../atoms/DatePicker/DatePicker";
import { HTTP_STATUS, MODE } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import { Project } from "../../../../services/useProjectService";
import { useSkillService, SkillDropdown } from "../../../../services/useSkillService";
import AutoCompleteInput from "../../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../../atoms/Chip/Chip";
import ImageUpload from "../../../atoms/ImageUpload/ImageUpload";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

interface ProjectFormProps {
    formik: FormikProps<Project>;
    mode: string;
    onClose: () => void;
}

const ProjectFormTemplate = ({ formik, mode, onClose }: ProjectFormProps) => {

    const skillService = useSkillService();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);

    const loadSkillsDropdown = async (searchTerm?: string) => {
        try {
            const response = await skillService.getDropdown({
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
        }
    }

    useEffect(() => {
        loadSkillsDropdown();
    }, []);

    useEffect(()=>{
        console.log(formik.values.technologiesUsed)
    },[formik.values.technologiesUsed])

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

            <div className="space-y-8">
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
                                        console.log(`${selectedOption.title} is already added to the project`);
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
                                : "Search and select the technologies used in this project"}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Project Description
                    </h3>
                    <TextField
                        label="Description"
                        placeholder="Describe your project, its features, challenges you solved, and what makes it unique..."
                        {...formik.getFieldProps("projectDescription")}
                        value={formik.values.projectDescription}
                        error={formik.touched.projectDescription && Boolean(formik.errors.projectDescription)}
                        helperText={formik.errors.projectDescription || "Provide a detailed description of your project (minimum 50 characters recommended)"}
                        inputProps={{
                            readOnly: mode === MODE.VIEW
                        }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value.trim();
                            formik.setFieldValue("projectDescription", newValue);
                        }}
                        multiline
                        rows={4}
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                    label="Cancel"
                    variant="tertiaryContained"
                    onClick={onClose}
                />
                {mode !== MODE.VIEW && (
                    <Button
                        label={
                            formik.isSubmitting
                                ? "Saving..."
                                : mode === MODE.ADD
                                    ? "Create Project"
                                    : "Update Project"
                        }
                        variant="primaryContained"
                        onClick={() => formik.handleSubmit()}
                        disabled={formik.isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectFormTemplate;
