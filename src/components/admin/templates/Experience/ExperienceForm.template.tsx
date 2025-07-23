import TextField from "../../../atoms/TextField/TextField";
import { MODE } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import Button from "../../../atoms/Button/Button";
import DatePicker from "../../../atoms/DatePicker/DatePicker";
import dayjs from "dayjs";
import Checkbox from "../../../atoms/Checkbox/Checkbox";

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
                        helperText={formik.errors.companyName}
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
                        helperText={formik.errors.jobTitle}
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
                        helperText={formik.errors.location}
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
                        helperText={formik.errors.technologiesUsed}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue('technologiesUsed', newValue);
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        disabled={mode === MODE.VIEW || formik.values.currentlyWorking}  // This disables when currentlyWorking is true
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                        label="Currently Working"
                        checked={formik.values.currentlyWorking || false}
                        onChange={(checked) => {
                            formik.setFieldValue("currentlyWorking", checked);
                            if (checked) {
                                formik.setFieldValue("endDate", "");
                            }
                        }}
                        disabled={mode === MODE.VIEW}
                        labelClassName="text-[16px] font-size-4"
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
                        helperText={formik.errors.description}
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
                    label={mode === MODE.ADD ? "Add Experience" : "Update Experience"}
                    variant="primaryContained"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.isSubmitting}
                />}
            </div>
        </div>
    )
}

export default ExperienceFormTemplate;