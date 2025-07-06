import React from "react";
import TextField from "../../atoms/TextField/TextField";
import { DEGREE_OPTIONS, MODE } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";

interface ExperienceFormProps {
    formik: any;
    mode: string;
    onClose: () => void;
}

const ExperienceFormTemplate = ({ formik, mode, onClose }: ExperienceFormProps) => {
    return (
        <div className="m-10 p-6 bg-white rounded-lg shadow-2xl shadow-primary-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {mode === MODE.ADD ? "Add Experience" : mode === MODE.EDIT ? "Edit Experience" : "View Experience"}
            </h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Company Name"
                        placeholder='Select Company Name'
                        {...formik.getFieldProps("companyName")}
                        error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('companyName', newValue);
                        }}
                    />
                    <TextField
                        label="Job Title"
                        placeholder='Select Job Title'
                        {...formik.getFieldProps("jobTitle")}
                        error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('jobTitle', newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="location"
                        label="Location"
                        placeholder='Select Location'
                        {...formik.getFieldProps("location")}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('location', newValue);
                        }}
                    />
                    <TextField
                        name="technologiesUsed"
                        label="Technologies Used"
                        placeholder='Select Technologies Used'
                        {...formik.getFieldProps("technologiesUsed")}
                        error={formik.touched.technologiesUsed && Boolean(formik.errors.technologiesUsed)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('technologiesUsed', newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="startDate"
                        label="Start Date"
                        placeholder='Select Start Date'
                        {...formik.getFieldProps("startDate")}
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        inputProps={{ 
                            readOnly: mode === MODE.VIEW, 
                        }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('startDate', newValue);
                        }}
                    />
                    <TextField
                        name="endDate"
                        label="End Date"
                        placeholder='Select End Date'
                        {...formik.getFieldProps("endDate")}
                        
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        inputProps={{ 
                            readOnly: mode === MODE.VIEW, 
                        }}
                        value={formik.values.endDate}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('endDate', newValue);
                        }}
                    />
                </div>

                <div className="col-span-full">
                    <TextField
                        name="description"
                        label="Description"
                        placeholder='Select Description'
                        {...formik.getFieldProps("description")}
                        value={formik.values.description}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        readOnly={mode === MODE.VIEW}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('description', newValue);
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
                {mode !== MODE.VIEW && <Button
                    label={mode === MODE.ADD ? "Add Education" : "Update Education"}
                    variant="primaryContained"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        mode === MODE.ADD ? "Add Education" : "Update Education"
                    )}
                </Button>}
            </div>
        </div>
    )
}

export default ExperienceFormTemplate;