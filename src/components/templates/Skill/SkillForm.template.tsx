import React, { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import { MODE, SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useLogoService, type Logo, type LogoFilterParams } from "../../../services/useLogoService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { type Skill, SkillLevelType } from "../../../services/useSkillService";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object().shape({
    logoId: Yup.string()
        .nullable()
        .required('Skill Logo ID is required'),
    level: Yup.string()
        .required('Skill Level is required'),
    category: Yup.string()
        .required('Skill Category is required'),
});

interface SkillFormProps {
    onSubmit: (values: Skill) => void;
    mode: string;
    skill?: Skill | null;
}

const SkillFormTemplate = ({ mode, onSubmit, skill }: SkillFormProps) => {
    const logoService = useLogoService();
    const navigate = useNavigate();
    const colors = useColors();
    const { isDark } = useTheme();

    const [logos, setLogos] = useState<Logo[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

    const onClose = () => navigate(ADMIN_ROUTES.SKILL);

    const formik = useFormik<Skill>({
        initialValues: {
            logoId: skill?.logoId || "",
            level: skill?.level || SkillLevelType.BEGINNER,
            category: skill?.category || "",
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (mode !== MODE.VIEW) {
                await onSubmit(values);
            } else {
                onClose();
            }
            setSubmitting(false);
        },
    });

    const loadLogoDropdown = React.useCallback(async (searchTerm?: string) => {
        const params: LogoFilterParams = {
            search: searchTerm || "",
            page: "0",
            size: "10"
        };
        try {
            const response = await logoService.getAll(params);
            if (response?.status === HTTP_STATUS.OK) {
                const fetchedLogos = response?.data?.data?.content || [];
                setLogos(fetchedLogos);

                if (formik.values.logoId) {
                    const existing = fetchedLogos.find((l: Logo) => l.id === String(formik.values.logoId));
                    if (existing) setSelectedLogo(existing);
                }
            }
        } catch (error) {
            setLogos([]);
        }
    }, [logoService, formik.values.logoId]);

    const logoOptions = logos.map((logo) => ({
        label: (
            <div className="flex items-center">
                <img src={logo.url} alt={logo.name} className="w-6 h-6 mr-2 inline" />
                {logo.name}
            </div>
        ),
        title: logo.name,
        value: String(logo.id),
    }));


    useEffect(() => {
        loadLogoDropdown();
    }, []);

    const cardShadow = isDark
        ? "0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)"
        : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add New Skill" : mode === MODE.EDIT ? "Edit Skill" : "Skill Details"}
            subtitle={mode === MODE.ADD ? "Add a new skill to your portfolio" : mode === MODE.EDIT ? "Update your skill information" : "View skill details"}
            accentColor="#6366f1"
            breadcrumb="Skills"
            onBack={onClose}
        >
            <div className="space-y-8" style={{ padding: "24px" }}>
                <div
                    style={{
                        background: colors.neutral50,
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid " + colors.neutral200,
                        boxShadow: cardShadow,
                    }}
                >
                    <h3
                        className="text-lg font-semibold mb-4 flex items-center"
                        style={{ color: colors.neutral900 }}
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Select Skill Logo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <AutoCompleteInput
                                label="Skill"
                                placeHolder="Search and select a skill (e.g., React, Node.js)"
                                options={logoOptions}
                                value={logoOptions.find(option => option.value === formik.values.logoId) || null}
                                onSearch={search => loadLogoDropdown(search)}
                                onChange={value => {
                                    formik.setFieldValue("logoId", value?.value ?? null);
                                    formik.setFieldValue("logoName", typeof value?.title === "string" ? value.title : "");
                                    formik.setFieldValue(
                                        "logoUrl",
                                        logos.find(l => l.id === value?.value)?.url || ""
                                    );
                                    setSelectedLogo(logos.find(l => l.id === value?.value) || null);
                                }}
                                required={true}
                                error={formik.touched.logoId && Boolean(formik.errors.logoId)}
                                helperText={Boolean(formik.touched.logoId && formik.errors.logoId) ? formik.errors.logoId : ""}
                                isDisabled={mode === MODE.VIEW}
                            />
                            {formik.errors.logoId && formik.touched.logoId && (
                                <div className="text-red-500 text-xs mt-1">
                                    {formik.errors.logoId as string}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center md:justify-end">
                            {(selectedLogo) ? (
                                <div
                                    className="flex items-center gap-4 rounded-lg p-4"
                                    style={{
                                        background: colors.neutral50,
                                        border: "1px solid " + colors.neutral200,
                                    }}
                                >
                                    <img
                                        src={selectedLogo?.url || ''}
                                        alt={selectedLogo?.name || 'Logo'}
                                        className="w-16 h-16 rounded-md"
                                        style={{ boxShadow: cardShadow }}
                                    />
                                    <div>
                                        <p className="text-sm" style={{ color: colors.neutral500 }}>Selected</p>
                                        <p
                                            className="text-base font-medium truncate max-w-[200px]"
                                            style={{ color: colors.neutral900 }}
                                        >
                                            {selectedLogo?.name || '—'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm" style={{ color: colors.neutral400 }}>No logo selected</div>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        background: colors.neutral50,
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid " + colors.neutral200,
                        boxShadow: cardShadow,
                    }}
                >
                    <h3
                        className="text-lg font-semibold mb-4 flex items-center"
                        style={{ color: colors.neutral900 }}
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AutoCompleteInput
                            label="Skill Level"
                            placeHolder="Search and select a skill level"
                            options={SKILL_LEVEL_OPTIONS}
                            value={SKILL_LEVEL_OPTIONS.find(option => option.value === formik.values.level) || null}
                            onSearch={() => { }}
                            onChange={value => {
                                formik.setFieldValue("level", value?.value ?? null);
                            }}
                            required={true}
                            error={formik.touched.level && Boolean(formik.errors.level)}
                            helperText={Boolean(formik.touched.level && formik.errors.level) ? formik.errors.level : ""}
                            isDisabled={mode === MODE.VIEW}
                        />
                        <AutoCompleteInput
                            label="Skill Category"
                            placeHolder="Search and select a skill category"
                            options={SKILL_CATEGORY_OPTIONS}
                            value={SKILL_CATEGORY_OPTIONS.find(option => option.value === formik.values.category) || null}
                            onSearch={() => { }}
                            onChange={value => {
                                formik.setFieldValue("category", value?.value ?? null);
                            }}
                            required={true}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={Boolean(formik.touched.category && formik.errors.category) ? formik.errors.category : ""}
                            isDisabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add" : "Update"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </FormShell>
    );
};

export default SkillFormTemplate;
