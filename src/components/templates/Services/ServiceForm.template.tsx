import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { isRichTextEmpty, titleModification } from "../../../utils/helper";
import { type ServiceOffering, type ServiceRequest, useServiceService } from "../../../services/useServiceService";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import TextField from "../../atoms/TextField/TextField";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
});

interface ServiceFormProps {
    onSubmit: (values: ServiceRequest) => Promise<void>;
    mode: string;
    service?: ServiceOffering | null;
}

interface ServiceFormValues extends ServiceRequest {
    hasBanner: boolean;
}

const ServiceFormTemplate = ({ onSubmit, mode, service }: ServiceFormProps) => {
    const navigate = useNavigate();
    const serviceService = useServiceService();
    const colors = useColors();

    const onClose = () => navigate(ADMIN_ROUTES.SERVICES);

    const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (bannerPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(bannerPreviewUrl);
        };
    }, [bannerPreviewUrl]);

    const formik = useFormik<ServiceFormValues>({
        initialValues: {
            title: service?.title || "",
            description: service?.description || "",
            icon: service?.icon || "",
            priceRange: service?.priceRange || "",
            deliveryTime: service?.deliveryTime || "",
            sortOrder: service?.sortOrder ?? 0,
            isActive: service?.isActive ?? true,
            bannerUrl: service?.bannerUrl || "",
            bannerPublicId: service?.bannerPublicId || "",
            hasBanner: !!service?.bannerUrl,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let bannerUrl = values.bannerUrl;
            let bannerPublicId = values.bannerPublicId;

            if (pendingBannerFile) {
                try {
                    const res = await serviceService.uploadBanner(pendingBannerFile);
                    if (res?.status === HTTP_STATUS.OK) {
                        bannerUrl = res.data.data.path;
                        bannerPublicId = res.data.data.publicId;
                    } else {
                        setSubmitting(false);
                        return;
                    }
                } catch {
                    setSubmitting(false);
                    return;
                }
            }

            await onSubmit({
                title: values.title,
                description: isRichTextEmpty(values.description) ? "" : values.description,
                icon: values.icon,
                priceRange: values.priceRange,
                deliveryTime: values.deliveryTime,
                sortOrder: values.sortOrder,
                isActive: values.isActive,
                bannerUrl,
                bannerPublicId,
            });
            setSubmitting(false);
        },
    });

    const handleBannerSelect = (file: File) => {
        const preview = URL.createObjectURL(file);
        setPendingBannerFile(file);
        setBannerPreviewUrl(preview);
        formik.setFieldValue("hasBanner", true);
        return preview;
    };

    const handleBannerClear = () => {
        if (bannerPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(bannerPreviewUrl);
        setPendingBannerFile(null);
        setBannerPreviewUrl(null);
        formik.setFieldValue("bannerUrl", "");
        formik.setFieldValue("bannerPublicId", "");
        formik.setFieldValue("hasBanner", false);
    };

    const uploadBanner = async (file: File): Promise<ImageUploadResponse> => {
        const url = handleBannerSelect(file);
        return { url, publicId: "" };
    };

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const sectionTitleStyle: React.CSSProperties = { color: colors.neutral800 };

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add Service" : mode === MODE.EDIT ? "Edit Service" : "Service Details"}
            subtitle={
                mode === MODE.ADD
                    ? "Describe a service you offer to clients"
                    : mode === MODE.EDIT
                    ? "Update service information"
                    : "View service details"
            }
            onBack={() => navigate(-1)}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Basic Info */}
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Service Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Title"
                            placeholder="e.g. Full-Stack Web Development"
                            value={formik.values.title}
                            onChange={(e) => formik.setFieldValue("title", titleModification(e.target.value))}
                            required
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title ? String(formik.errors.title) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Icon"
                            placeholder="Emoji or icon key e.g. 🖥️"
                            {...formik.getFieldProps("icon")}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Price Range"
                            placeholder="e.g. $500–$2000"
                            {...formik.getFieldProps("priceRange")}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Delivery Time"
                            placeholder="e.g. 3–5 days"
                            {...formik.getFieldProps("deliveryTime")}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Sort Order"
                            type="number"
                            {...formik.getFieldProps("sortOrder")}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
                        Description
                    </h3>
                    <RichTextEditor
                        label="Description"
                        placeholder="Describe what this service includes..."
                        value={formik.values.description ?? ""}
                        onChange={(v) => formik.setFieldValue("description", v)}
                        isEditMode={mode !== MODE.VIEW}
                    />
                </div>

                {/* Banner + Status */}
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Banner & Visibility
                    </h3>
                    <div className="flex flex-col gap-5">
                        <ImageUpload
                            label="Banner Image"
                            value={
                                bannerPreviewUrl
                                    ? { url: bannerPreviewUrl, publicId: "" }
                                    : formik.values.bannerPublicId
                                    ? { url: formik.values.bannerUrl ?? "", publicId: formik.values.bannerPublicId }
                                    : null
                            }
                            onChange={(v) => { if (!v) handleBannerClear(); }}
                            onUpload={uploadBanner}
                            disabled={mode === MODE.VIEW}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText="Optional banner · Max 5MB"
                        />

                        <div
                            className="flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: `${colors.neutral100}`, border: `1px solid ${colors.neutral200}` }}
                        >
                            <div>
                                <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>Active</p>
                                <p className="text-xs mt-0.5" style={{ color: colors.neutral500 }}>
                                    Show this service on your public portfolio
                                </p>
                            </div>
                            <Switch
                                checked={formik.values.isActive ?? true}
                                onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
                                disabled={mode === MODE.VIEW}
                                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: colors.primary500 }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: colors.primary500 } }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ background: colors.neutral100, color: colors.neutral700, border: `1px solid ${colors.neutral300}` }}
                    >
                        Cancel
                    </button>
                    {mode !== MODE.VIEW && (
                        <button
                            type="button"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white"
                            style={{ background: colors.primary500 }}
                        >
                            {mode === MODE.ADD ? "Add Service" : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>
        </FormShell>
    );
};

export default ServiceFormTemplate;
