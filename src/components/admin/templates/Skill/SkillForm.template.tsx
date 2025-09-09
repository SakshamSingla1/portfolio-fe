import { useEffect, useState } from "react";
import Button from "../../../atoms/Button/Button";
import Select from "../../../atoms/Select/Select";
import { HTTP_STATUS, MODE, SKILL_CATEGORY_OPTIONS, SKILL_LEVEL_OPTIONS } from "../../../../utils/constant";
import { titleModification } from "../../../../utils/helper";
import { useLogoService, Logo } from "../../../../services/useLogoService";
import AutoCompleteInput from "../../../atoms/AutoCompleteInput/AutoCompleteInput";

interface SkillFormProps {
    formik: any;
    mode: string;
    onClose: () => void;
}

const SkillFormTemplate = ({ formik, mode, onClose }: SkillFormProps) => {
    const logoService = useLogoService();

    const [logos, setLogos] = useState<Logo[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

    const loadLogoDropdown = async (searchTerm: string) => {
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

    useEffect(() => {
        loadLogoDropdown('');
    }, []);

    useEffect(() => {
        console.log(formik);
    }, [formik]);

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

                    <AutoCompleteInput
                        label="Skill"
                        placeHolder="Select Skill"
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
                        error={!!formik.errors.logoId && formik.touched.logoId}
                        helperText={formik.errors.logoId as string}
                        isDisabled={mode !== MODE.ADD}
                    />
                    {formik.errors.logoId && formik.touched.logoId && (
                        <div className={`text-red-500 text-xs mt-1`}>
                            {formik.errors.logoId}
                        </div>
                    )}
                    {/* <Select
                        name="logoId"
                        label="Skill Logo"
                        placeholder="Select Skill Logo"
                        options={logoOptions}
                        value={selectedLogo?.name || formik.values.logoName}
                        error={formik.touched.logoId && Boolean(formik.errors.logoId)}
                        disabled={mode === MODE.VIEW}
                        onChange={(value: string | number) => {
                            const logoId = Number(value);
                            const selected = logos.find(l => l.id === logoId) || null;
                            setSelectedLogo(selected);
                            formik.setFieldValue("logoId", logoId);
                            if (selected) {
                                formik.setFieldValue("name", titleModification(selected.name));
                            }
                        }}
                    /> */}

                    {(selectedLogo || formik.values.logoUrl) && (
                        <img
                            src={selectedLogo?.url || formik.values.logoUrl || ''}
                            alt={selectedLogo?.name || formik.values.name || 'Logo'}
                            className="w-20 h-20 mt-2"
                        />
                    )}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={formik.values.category}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        disabled={mode === MODE.VIEW}
                        onChange={(value: string | number) => {
                            const newValue = typeof value === "string" ? titleModification(value) : value;
                            formik.setFieldValue("category", newValue);
                        }}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4 gap-2">
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
    );
};

export default SkillFormTemplate;
