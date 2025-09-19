import { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";
import { MODE, SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { OptionToValue, titleModification } from "../../../utils/helper";
import { useLogoService, type Logo } from "../../../services/useLogoService";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { type Skill } from "../../../services/useSkillService";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

const validationSchema = Yup.object().shape({
    logoId: Yup.number()
        .nullable()
        .required('Skill Logo ID is required'),
    logoName: Yup.string()
        .required('Skill Logo Name is required'),
    logoUrl: Yup.string()
        .required('Skill Logo URL is required'),
    level: Yup.string()
        .required('Skill Level is required')
        .max(50, 'Skill Level is too long'),
    category: Yup.string()
        .required('Skill Category is required')
        .max(50, 'Skill Category is too long'),
});

interface SkillFormProps {
    onSubmit: (values: Skill) => void;
    mode: string;
    skill?: Skill | null;
}

const SkillFormTemplate = ({ mode, onSubmit, skill }: SkillFormProps) => {
    const logoService = useLogoService();
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const [logos, setLogos] = useState<Logo[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

    const onClose = () => navigate(ADMIN_ROUTES.SKILL);

    const formik = useFormik<Skill>({
        initialValues: {
            logoId: null,
            logoName: "",
            logoUrl: "",
            level: "",
            category: "",
            profileId: user?.id?.toString(),
        },
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

    const loadLogoDropdown = async (searchTerm?: string) => {
        try {
            const response = await logoService.getAll({
                search: searchTerm
            });
            if (response?.status === HTTP_STATUS.OK) {
                const fetchedLogos = response?.data?.data?.content || [];
                setLogos(fetchedLogos);

                if (formik.values.logoId) {
                    const existing = fetchedLogos.find((l: Logo) => l.id === formik.values.logoId);
                    if (existing) setSelectedLogo(existing);
                }
            }
        } catch (error) {
            setLogos([]);
        }
    };

    const logoOptions = logos.map((logo) => ({
        label: (
            <div className="flex items-center">
                <img src={logo.url} alt={logo.name} className="w-6 h-6 mr-2 inline" />
                {logo.name}
            </div>
        ),
        title: logo.name,
        value: Number(logo.id),
    }));

    useEffect(() => {
        formik.setFieldValue("category", selectedLogo?.category);
    }, [selectedLogo]);

    useEffect(() => {
        if (skill) {
            formik.setFieldValue("logoId", skill.logoId);
            formik.setFieldValue("logoName", skill.logoName);
            formik.setFieldValue("logoUrl", skill.logoUrl);
            formik.setFieldValue("level", skill.level);
            formik.setFieldValue("category", skill.category);
        }
    }, [skill]);

    useEffect(() => {
        loadLogoDropdown();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD
                        ? "Add New Skill"
                        : mode === MODE.EDIT
                            ? "Edit Skill"
                            : "Skill Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD
                        ? "Add a new skill to your portfolio"
                        : mode === MODE.EDIT
                            ? "Update your skill information"
                            : "View skill details"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                                isDisabled={mode === MODE.VIEW}
                            />
                            {formik.errors.logoId && formik.touched.logoId && (
                                <div className="text-red-500 text-xs mt-1">
                                    {formik.errors.logoId as string}
                                </div>
                            )}
                        </div>

                        {/* Logo Preview */}
                        <div className="flex items-center md:justify-end">
                            {(selectedLogo || formik.values.logoUrl) ? (
                                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <img
                                        src={selectedLogo?.url || formik.values.logoUrl || ''}
                                        alt={selectedLogo?.name || formik.values.logoName || 'Logo'}
                                        className="w-16 h-16 rounded-md shadow-sm"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-600">Selected</p>
                                        <p className="text-base font-medium text-gray-900 truncate max-w-[200px]">
                                            {selectedLogo?.name || formik.values.logoName || '—'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm">No logo selected</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Classification Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            name="level"
                            label="Skill Level"
                            placeholder="Select Skill Level"
                            options={SKILL_LEVEL_OPTIONS}
                            value={formik.values.level}
                            error={formik.touched.level && Boolean(formik.errors.level)}
                            disabled={mode === MODE.VIEW}
                            onChange={(value: string | number) => {
                                const newValue = typeof value === "string" ? titleModification(value) : value;
                                formik.setFieldValue("level", newValue);
                            }}
                        />

                        <Select
                            name="category"
                            label="Skill Category"
                            placeholder="Select Skill Category"
                            options={SKILL_CATEGORY_OPTIONS}
                            value={OptionToValue(SKILL_CATEGORY_OPTIONS, formik.values.category || selectedLogo?.category || "")}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            disabled={true}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? "Add Skill" : "Update Skill"}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillFormTemplate;
