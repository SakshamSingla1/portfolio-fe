import React from "react";
import { FormikProps } from "formik";
import dayjs from "dayjs";

import TextField from "../../../atoms/TextField/TextField";
import Button from "../../../atoms/Button/Button";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import DatePicker from "../../../atoms/DatePicker/DatePicker";
import { InputProps } from "@mui/material";
import { MODE } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";

// Define the form values type
interface ProjectFormValues {
    projectName: string;
    technologiesUsed: string;
    projectLink: string;
    projectDuration: string;
    projectStartDate: string;
    projectEndDate: string;
    isCurrentlyWorking: boolean;
    projectDescription: string;
}

interface ProjectFormProps {
    formik: FormikProps<ProjectFormValues>;
    mode: string;
    onClose: () => void;
}

const ProjectFormTemplate = ({ formik, mode, onClose }: ProjectFormProps) => {
    return (
        <div className="m-10 p-6 bg-white rounded-lg shadow-2xl shadow-primary-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {mode === MODE.ADD
                    ? "Add Project"
                    : mode === MODE.EDIT
                        ? "Edit Project"
                        : "View Project"}
            </h2>

            <div className="space-y-4">
                {/* Project Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Project Name"
                        placeholder="Enter Project Name"
                        {...formik.getFieldProps("projectName")}
                        error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                        helperText={formik.errors.projectName}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value.trim());
                            formik.setFieldValue("projectName", newValue);
                        }}
                    />
                </div>

                {/* Technologies Used & Project Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Technologies Used"
                        placeholder="Enter Technologies Used"
                        {...formik.getFieldProps("technologiesUsed")}
                        error={formik.touched.technologiesUsed && Boolean(formik.errors.technologiesUsed)}
                        helperText={formik.errors.technologiesUsed}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value.trim());
                            formik.setFieldValue("technologiesUsed", newValue);
                        }}
                    />
                    <TextField
                        label="Project Link"
                        placeholder="Enter Project Link"
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

                {/* Project Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Project Duration"
                        placeholder="Enter Project Duration"
                        {...formik.getFieldProps("projectDuration")}
                        error={formik.touched.projectDuration && Boolean(formik.errors.projectDuration)}
                        helperText={formik.errors.projectDuration}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value.trim();
                            formik.setFieldValue("projectDuration", newValue);
                        }}
                    />
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                        label="Select Start Date"
                        value={formik.values.projectStartDate ? dayjs(formik.values.projectStartDate) : null}
                        onChange={(newValue) =>
                            formik.setFieldValue("projectStartDate", newValue?.format("YYYY-MM-DD"))
                        }
                        error={!!formik.touched.projectStartDate && Boolean(formik.errors.projectStartDate)}
                        helperText={formik.errors.projectStartDate}
                        fullWidth
                        disabled={mode === MODE.VIEW}
                    />
                    <DatePicker
                        label="Select End Date"
                        value={formik.values.projectEndDate ? dayjs(formik.values.projectEndDate) : null}
                        onChange={(newValue) =>
                            formik.setFieldValue("projectEndDate", newValue?.format("YYYY-MM-DD"))
                        }
                        error={!!formik.touched.projectEndDate && Boolean(formik.errors.projectEndDate)}
                        helperText={formik.errors.projectEndDate}
                        fullWidth
                        disabled={mode === MODE.VIEW || formik.values.isCurrentlyWorking}
                    />
                </div>

                {/* Checkbox */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                        label="Currently Working"
                        checked={formik.values.isCurrentlyWorking || false}
                        onChange={(checked) => {
                            formik.setFieldValue("isCurrentlyWorking", checked);
                            if (checked) {
                                formik.setFieldValue("projectEndDate", "");
                            }
                        }}
                        disabled={mode === MODE.VIEW}
                        labelClassName="text-[16px] font-size-4"
                    />
                </div>

                {/* Description */}
                <div className="col-span-full">
                    <TextField
                        label="Project Description"
                        placeholder="Enter Project Description"
                        {...formik.getFieldProps("projectDescription")}
                        value={formik.values.projectDescription}
                        error={formik.touched.projectDescription && Boolean(formik.errors.projectDescription)}
                        helperText={formik.errors.projectDescription}
                        inputProps={{
                            readOnly: mode === MODE.VIEW
                        }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value.trim();
                            formik.setFieldValue("projectDescription", newValue);
                        }}
                        multiline
                        rows={3}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4 gap-2">
                <Button
                    label="Cancel"
                    variant="tertiaryContained"
                    onClick={onClose}
                />
                {mode !== MODE.VIEW && (
                    <Button
                        label={mode === MODE.ADD ? "Add Project" : "Update Project"}
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
