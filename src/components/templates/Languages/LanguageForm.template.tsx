import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import Select from "../../atoms/Select/Select";
import Button from "../../atoms/Button/Button";
import { MODE, ADMIN_ROUTES, LANGUAGE_PROFICIENCY_OPTIONS } from "../../../utils/constant";
import { type Language, type LanguageRequest } from "../../../services/useLanguageService";
import { useColors } from "../../../utils/types";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object({
    languageName: Yup.string().required("Language name is required"),
    proficiency: Yup.string().required("Proficiency is required"),
    sortOrder: Yup.number().min(0, "Must be 0 or greater"),
});

interface LanguageFormProps {
    onSubmit: (values: LanguageRequest) => Promise<void>;
    mode: string;
    language?: Language | null;
}

const LanguageFormTemplate = ({ onSubmit, mode, language }: LanguageFormProps) => {
    const navigate = useNavigate();
    const colors = useColors();
    const isView = mode === MODE.VIEW;

    const onClose = () => navigate(ADMIN_ROUTES.LANGUAGES);

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const formik = useFormik<LanguageRequest>({
        initialValues: {
            languageName: language?.languageName ?? "",
            proficiency: language?.proficiency ?? "",
            sortOrder: language?.sortOrder ?? 0,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    const title =
        mode === MODE.ADD ? "Add Language"
        : mode === MODE.EDIT ? "Edit Language"
        : "View Language";

    return (
        <FormShell title={title} subtitle="Spoken language with proficiency level" breadcrumb="Languages" onBack={onClose}>
            <div className="flex flex-col gap-6 pb-6">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3
                        className="text-lg font-semibold flex items-center mb-6"
                        style={{ color: colors.neutral800 }}
                    >
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Language Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <TextField
                            label="Language Name"
                            name="languageName"
                            value={formik.values.languageName}
                            onChange={formik.handleChange}
                            disabled={isView}
                            placeholder="e.g. English, Spanish, French"
                            error={Boolean(formik.errors.languageName && formik.touched.languageName)}
                            helperText={formik.touched.languageName && formik.errors.languageName ? formik.errors.languageName : ""}
                            required={!isView}
                        />
                        <Select
                            label="Proficiency"
                            value={formik.values.proficiency}
                            onChange={(val) => formik.setFieldValue("proficiency", val)}
                            options={LANGUAGE_PROFICIENCY_OPTIONS}
                            disabled={isView}
                            error={Boolean(formik.errors.proficiency && formik.touched.proficiency)}
                            helperText={formik.touched.proficiency && formik.errors.proficiency ? String(formik.errors.proficiency) : ""}
                        />
                        <TextField
                            label="Sort Order"
                            name="sortOrder"
                            type="number"
                            value={String(formik.values.sortOrder)}
                            onChange={formik.handleChange}
                            disabled={isView}
                            placeholder="0"
                            error={Boolean(formik.errors.sortOrder && formik.touched.sortOrder)}
                            helperText={formik.touched.sortOrder && formik.errors.sortOrder ? String(formik.errors.sortOrder) : ""}
                        />
                    </div>
                </div>

                {!isView && (
                    <div className="flex justify-between gap-3">
                        <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                        <Button
                            label={mode === MODE.ADD ? "Add Language" : "Save Changes"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            loading={formik.isSubmitting}
                            disabled={!formik.dirty}
                        />
                    </div>
                )}
            </div>
        </FormShell>
    );
};

export default LanguageFormTemplate;
