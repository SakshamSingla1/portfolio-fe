import TextField from "../../../atoms/TextField/TextField";
import { MODE, SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import Button from "../../../atoms/Button/Button";
import Select from "../../../atoms/Select/Select";

interface SkillFormProps {
    formik: any;
    mode: string;
    onClose: () => void;
}

const SkillFormTemplate = ({ formik, mode, onClose }: SkillFormProps) => {
    return (
        <div className="m-10 p-6 bg-white rounded-lg shadow-2xl shadow-primary-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {mode === MODE.ADD
                    ? "Add Skill"
                    : mode === MODE.EDIT
                        ? "Edit Skill"
                        : "View Skill"}
            </h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Skill Name"
                        placeholder="Select Skill Name"
                        {...formik.getFieldProps("name")}
                        error={
                            formik.touched.name && Boolean(formik.errors.name)
                        }
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue("name", newValue);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="level"
                        label="Skill Level"
                        placeholder="Select Skill Level"
                        {...formik.getFieldProps("level")}
                        options={SKILL_LEVEL_OPTIONS}
                        error={
                            formik.touched.level &&
                            Boolean(formik.errors.level)
                        }
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = titleModification(event.target.value);
                            formik.setFieldValue("level", newValue);
                        }}
                    />
                    <Select
                        name="category"
                        label="Skill Category"
                        placeholder="Select Skill Category"
                        options={SKILL_CATEGORY_OPTIONS}
                        {...formik.getFieldProps("category")}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        inputProps={{ readOnly: mode === MODE.VIEW }}
                        onBlur={(event: any) => {
                            const newValue = event.target.value;
                            formik.setFieldValue("category", newValue);
                        }}
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
                            mode === MODE.ADD ? "Add Skill" : "Update Skill"
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

export default SkillFormTemplate;