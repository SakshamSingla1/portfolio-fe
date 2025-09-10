import TextField from "../../../atoms/TextField/TextField";
import { DEGREE_OPTIONS, MODE } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import Button from "../../../atoms/Button/Button";
import Select from "../../../atoms/Select/Select";

interface EducationFormProps {
    formik: any;
    mode: string;
    onClose: () => void;
}

const EducationFormTemplate = ({ formik, mode, onClose }: EducationFormProps) => {
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
                            name="fieldOfStudy"
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
                            name="location"
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
                            name="startYear"
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
                            name="endYear"
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

                {/* Description */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Description
                    </h3>
                    <TextField
                        name="description"
                        label="Description"
                        placeholder='Describe your coursework, achievements, and notable projects...'
                        {...formik.getFieldProps("description")}
                        value={formik.values.description}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('description', newValue);
                        }}
                        multiline
                        rows={4}
                        disabled={mode === MODE.VIEW}
                    />
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
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}


export default EducationFormTemplate;