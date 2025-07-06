import React from "react";
import TextField from "../../atoms/TextField/TextField";
import { MODE } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";

interface ProjectFormProps {
    formik: any;
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Project Name"
                        placeholder="Select Project Name"
                        {...formik.getFieldProps("projectName")}
                        error={
                            formik.touched.projectName && Boolean(formik.errors.projectName)
                        }
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue("projectName", newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="technologiesUsed"
                        label="Technologies Used"
                        placeholder="Select Technologies Used"
                        {...formik.getFieldProps("technologiesUsed")}
                        error={
                            formik.touched.technologiesUsed &&
                            Boolean(formik.errors.technologiesUsed)
                        }
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue("technologiesUsed", newValue);
                        }}
                    />
                    <TextField
                        name="projectLink"
                        label="Project Link"
                        placeholder="Select Project Link"
                        {...formik.getFieldProps("projectLink")}
                        error={formik.touched.projectLink && Boolean(formik.errors.projectLink)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue("projectLink", newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="projectDuration"
                        label="Project Duration"
                        placeholder="Select Project Duration"
                        {...formik.getFieldProps("projectDuration")}
                        error={formik.touched.projectDuration && Boolean(formik.errors.projectDuration)}
                        inputProps={{
                            readOnly: mode === MODE.VIEW,
                        }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue("projectDuration", newValue);
                        }}
                    />
                </div>

                <div className="col-span-full">
                    <TextField
                        name="projectDescription"
                        label="Project Description"
                        placeholder="Select Project Description"
                        {...formik.getFieldProps("projectDescription")}
                        value={formik.values.projectDescription}
                        error={
                            formik.touched.projectDescription && Boolean(formik.errors.projectDescription)
                        }
                        readOnly={mode === MODE.VIEW}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue("projectDescription", newValue);
                        }}
                        multiline
                        rows={3}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4 gap-2">
                <Button
                    label="Cancel"
                    variant="tertiaryContained"
                    onClick={onClose}
                />
                {mode !== MODE.VIEW && (
                    <Button
                        label={
                            mode === MODE.ADD ? "Add Project" : "Update Project"
                        }
                        variant="primaryContained"
                        onClick={() => formik.handleSubmit()}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </span>
                        ) : mode === MODE.ADD ? (
                            "Add Project"
                        ) : (
                            "Update Project"
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProjectFormTemplate;