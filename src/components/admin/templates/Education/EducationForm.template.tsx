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
        <div className="m-10 p-6 bg-white rounded-lg shadow-2xl shadow-primary-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {mode === MODE.ADD ? "Add Education" : mode === MODE.EDIT ? "Edit Education" : "View Education"}
            </h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Institution"
                        placeholder='Select Institution'
                        {...formik.getFieldProps("institution")}
                        error={formik.touched.institution && Boolean(formik.errors.institution)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('institution', newValue);
                        }}
                    />
                    <Select
                        label="Degree"
                        placeholder='Select Degree'
                        options={DEGREE_OPTIONS}
                        {...formik.getFieldProps("degree")}
                        error={formik.touched.degree && Boolean(formik.errors.degree)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('degree', newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="fieldOfStudy"
                        label="Field of Study"
                        placeholder='Select Field of Study'
                        {...formik.getFieldProps("fieldOfStudy")}
                        error={formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue('fieldOfStudy', newValue);
                        }}
                    />
                    <TextField
                        name="location"
                        label="Location"
                        placeholder='Select Location'
                        {...formik.getFieldProps("location")}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('location', newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="startYear"
                        label="Start Year"
                        placeholder='Select Start Year'
                        {...formik.getFieldProps("startYear")}
                        error={formik.touched.startYear && Boolean(formik.errors.startYear)}
                        inputProps={{ 
                            readOnly: mode === MODE.VIEW, 
                            maxLength: 4,
                        }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('startYear', newValue);
                        }}
                    />
                    <TextField
                        name="endYear"
                        label="End Year"
                        placeholder='Select End Year'
                        {...formik.getFieldProps("endYear")}
                        
                        error={formik.touched.endYear && Boolean(formik.errors.endYear)}
                        inputProps={{ 
                            readOnly: mode === MODE.VIEW, 
                            maxLength: 4,
                        }}
                        value={formik.values.endYear}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('endYear', newValue);
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
                />}
            </div>
        </div>
    )
}

export default EducationFormTemplate;