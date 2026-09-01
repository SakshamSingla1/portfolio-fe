import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { type Testimonial, type TestimonialRequest } from "../../../services/useTestimonialService";
import { Status, StatusOptions, useColors } from "../../../utils/types";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useTestimonialService } from "../../../services/useTestimonialService";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";
import { isRichTextEmpty } from "../../../utils/helper";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    message: Yup.string().test(
        "message-required",
        "Message is required",
        (value) => !isRichTextEmpty(value)
    ),
    role: Yup.string().required("Role is required"),
    company: Yup.string().required("Company is required"),
    hasImage: Yup.boolean().oneOf([true], "Image is required"),
    linkedInUrl: Yup.string().url("Invalid URL").required("Linked In URL is required"),
    order: Yup.string().required("Order is required"),
    status: Yup.string().required("Status is required"),
});

interface TestimonialFormProps {
    onSubmit: (values: TestimonialRequest) => void;
    mode: string;
    testimonial?: Testimonial | null;
}

interface TestimonialFormValues extends TestimonialRequest {
    hasImage: boolean;
}

const TestimonialFormTemplate = ({
    onSubmit,
    mode,
    testimonial,
}: TestimonialFormProps) => {

    const navigate = useNavigate();
    const colors = useColors();
    const testimonialService = useTestimonialService();

    const onClose = () => navigate(ADMIN_ROUTES.TESTIMONIALS);

    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const formik = useFormik<TestimonialFormValues>({
        initialValues: {
            name: testimonial?.name || "",
            message: testimonial?.message || "",
            role: testimonial?.role || "",
            company: testimonial?.company || "",
            imageId: testimonial?.imageId ?? null,
            imageUrl: testimonial?.imageUrl || "",
            linkedInUrl: testimonial?.linkedInUrl || "",
            order: testimonial?.order || "",
            status: testimonial?.status || Status.ACTIVE,
            hasImage: !!testimonial?.imageUrl,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let imageUrl = values.imageUrl;
            let imageId = values.imageId;

            if (pendingImageFile) {
                try {
                    const response = await testimonialService.uploadImage(pendingImageFile);
                    if (response.status === HTTP_STATUS.OK) {
                        const asset = response.data.data;
                        imageUrl = asset.path;
                        imageId = asset.id;
                    } else {
                        setSubmitting(false);
                        return;
                    }
                } catch {
                    setSubmitting(false);
                    return;
                }
            }

            const payload = {
                name: values.name,
                message: isRichTextEmpty(values.message) ? "" : values.message,
                role: values.role,
                company: values.company,
                imageId,
                imageUrl,
                linkedInUrl: values.linkedInUrl,
                order: values.order,
                status: values.status,
            };
            setSubmitting(true);
            if (mode !== MODE.VIEW) {
                await onSubmit(payload);
            } else {
                onClose();
            }
            setSubmitting(false);
        },
    });

    const { setFieldValue } = formik;

    const handleMessageChange = useCallback(
        (value: string) => setFieldValue("message", value),
        [setFieldValue]
    );

    const handleImageSelect = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setPendingImageFile(file);
        setImagePreviewUrl(previewUrl);
        formik.setFieldValue("hasImage", true);
        return previewUrl;
    };

    const handleImageClear = () => {
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setPendingImageFile(null);
        setImagePreviewUrl(null);
        formik.setFieldValue("imageUrl", "");
        formik.setFieldValue("imageId", null);
        formik.setFieldValue("hasImage", false);
    };

    const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
        const url = handleImageSelect(file);
        return { url, publicId: "" };
    };

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };
    const sectionTitleStyle: React.CSSProperties = { color: colors.neutral800 };

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add Testimonial" : mode === MODE.EDIT ? "Edit Testimonial" : "Testimonial Details"}
            subtitle={mode === MODE.ADD ? "Add a professional testimonial from a client or colleague" : mode === MODE.EDIT ? "Update testimonial information" : "View testimonial details"}
            breadcrumb="Testimonials"
            onBack={onClose}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Testimonial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Name"
                            placeholder="Enter Name"
                            value={formik.values.name}
                            onChange={e => formik.setFieldValue("name", titleModification(e.target.value))}
                            required={true}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name ? String(formik.errors.name) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Role"
                            placeholder="Enter Role"
                            {...formik.getFieldProps("role")}
                            required={true}
                            error={formik.touched.role && Boolean(formik.errors.role)}
                            helperText={formik.touched.role && formik.errors.role ? String(formik.errors.role) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <TextField
                            label="Company"
                            placeholder="Enter Company"
                            {...formik.getFieldProps("company")}
                            required={true}
                            error={formik.touched.company && Boolean(formik.errors.company)}
                            helperText={formik.touched.company && formik.errors.company ? String(formik.errors.company) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
                        Profile Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <TextField
                            label="LinkedIn URL"
                            placeholder="Enter LinkedIn URL"
                            {...formik.getFieldProps("linkedInUrl")}
                            required={true}
                            error={formik.touched.linkedInUrl && Boolean(formik.errors.linkedInUrl)}
                            helperText={formik.touched.linkedInUrl && formik.errors.linkedInUrl ? String(formik.errors.linkedInUrl) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <ImageUpload
                            label="Image"
                            value={
                                imagePreviewUrl
                                    ? { url: imagePreviewUrl, publicId: "" }
                                    : formik.values.imageId
                                    ? { url: formik.values.imageUrl, publicId: String(formik.values.imageId) }
                                    : null
                            }
                            onChange={(value) => {
                                if (!value) {
                                    handleImageClear();
                                }
                            }}
                            onUpload={uploadImage}
                            disabled={mode === MODE.VIEW}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText={formik.submitCount > 0 && formik.errors.hasImage ? String(formik.errors.hasImage) : "Image · Max 5MB"}
                            error={formik.submitCount > 0 && Boolean(formik.errors.hasImage)}
                            required={true}
                        />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Message and Order
                    </h3>
                    <div className="flex flex-col gap-6">
                        <TextField
                            label="Order"
                            placeholder="Enter Order"
                            {...formik.getFieldProps("order")}
                            required={true}
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={formik.touched.order && formik.errors.order ? String(formik.errors.order) : ""}
                            disabled={mode === MODE.VIEW}
                        />
                        <RichTextEditor
                            label="Message"
                            value={formik.values.message}
                            onChange={handleMessageChange}
                            isEditMode={mode !== MODE.VIEW}
                            required={true}
                            error={formik.touched.message && Boolean(formik.errors.message)}
                            helperText={formik.touched.message && formik.errors.message ? String(formik.errors.message) : ""}
                        />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
                        Testimonial Status
                    </h3>
                    <CustomRadioGroup
                        name="status"
                        label=""
                        options={StatusOptions}
                        value={formik.values.status || ''}
                        onChange={formik.handleChange}
                        disabled={mode === MODE.VIEW}
                    />
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

export default TestimonialFormTemplate;
