import React, { useEffect, useMemo, useState } from "react";
import TextField from "../../../atoms/TextField/TextField";
import { MODE, HTTP_STATUS } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import Button from "../../../atoms/Button/Button";
import DatePicker from "../../../atoms/DatePicker/DatePicker";
import dayjs from "dayjs";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import { useSkillService, SkillDropdown } from "../../../../services/useSkillService";
import AutoCompleteInput from "../../../atoms/AutoCompleteInput/AutoCompleteInput";
import Chip from "../../../atoms/Chip/Chip";

interface ExperienceFormProps {
    formik: any;
    mode: string;
    onClose: () => void;
}

const ExperienceFormTemplate = ({ formik, mode, onClose }: ExperienceFormProps) => {
    const skillService = useSkillService();

    const [skills, setSkills] = useState<SkillDropdown[]>([]);

    const loadSkills = async (searchTerm?: string) => {
        try {
            const response = await skillService.getDropdown({
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
        return skills.filter(skill => formik.values.technologiesUsed.includes(skill.id));
    }, [skills, formik.values.technologiesUsed]);

    useEffect(() => {
        loadSkills();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD
                        ? "Add New Experience"
                        : mode === MODE.EDIT
                            ? "Edit Experience"
                            : "Experience Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD
                        ? "Add your professional experience to your portfolio"
                        : mode === MODE.EDIT
                            ? "Update your experience information"
                            : "View experience details"}
                </p>
            </div>

            <div className="space-y-8">
                {/* Basic Information Section */}
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
                            name="location"
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
                                loadSkills(value);
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

                {/* Timeline Section */}
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
                                onChange={(newValue) =>
                                    formik.setFieldValue("startDate", newValue?.format("YYYY-MM-DD"))
                                }
                                error={!!formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helperText={formik.errors.startDate}
                                fullWidth
                                disabled={mode === MODE.VIEW}
                            />
                            <DatePicker
                                label="End Date"
                                value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
                                onChange={(newValue) =>
                                    formik.setFieldValue("endDate", newValue?.format("YYYY-MM-DD"))
                                }
                                error={!!formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.errors.endDate}
                                fullWidth
                                disabled={mode === MODE.VIEW || formik.values.currentlyWorking}
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <Checkbox
                                label="Currently Working at this Company"
                                checked={formik.values.currentlyWorking || false}
                                onChange={(checked) => {
                                    formik.setFieldValue("currentlyWorking", checked);
                                    if (checked) {
                                        formik.setFieldValue("endDate", "");
                                    }
                                }}
                                disabled={mode === MODE.VIEW}
                                labelClassName="text-sm font-medium text-gray-700"
                            />
                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                Check this if you are still employed at this company
                            </p>
                        </div>
                    </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Job Description
                    </h3>
                    <TextField
                        name="description"
                        label="Description"
                        placeholder="Describe your role, responsibilities, achievements, and key contributions..."
                        {...formik.getFieldProps("description")}
                        value={formik.values.description}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.errors.description || "Provide a detailed description of your role and accomplishments (minimum 50 characters recommended)"}
                        disabled={mode === MODE.VIEW}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('description', newValue);
                        }}
                        multiline
                        rows={4}
                    />
                </div>
            </div>

            {/* Action Buttons */}
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
                                    ? "Add Experience"
                                    : "Update Experience"
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

export default ExperienceFormTemplate;