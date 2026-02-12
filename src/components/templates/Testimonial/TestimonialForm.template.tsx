import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { type Testimonial, type TestimonialRequest } from "../../../services/useTestimonialService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { Status, StatusOptions } from "../../../utils/types";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useTestimonialService } from "../../../services/useTestimonialService";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    message: Yup.string().required("Message is required").min(10, "Message is too short"),
    role: Yup.string().required("Role is required"),
    company: Yup.string().required("Company is required"),
    imageId: Yup.string().required("Image ID is required"),
    imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
    linkedInUrl: Yup.string().url("Invalid URL").required("Linked In URL is required"),
    order: Yup.string().required("Order is required"),
    status: Yup.string().required("Status is required"),
});

interface TestimonialFormProps {
    onSubmit: (values: TestimonialRequest) => void;
    mode: string;
    testimonial?: Testimonial | null;
}

const TestimonialFormTemplate = ({
    onSubmit,
    mode,
    testimonial,
}: TestimonialFormProps) => {

    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();
    const testimonialService = useTestimonialService();

    const onClose = () => navigate(ADMIN_ROUTES.TESTIMONIALS);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const formik = useFormik<TestimonialRequest>({
        initialValues: {
            profileId: user?.id || "",
            name: "",
            message: "",
            role: "",
            company: "",
            imageId: "",
            imageUrl: "",
            linkedInUrl: "",
            order: "",
            status: Status.ACTIVE,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (mode !== MODE.VIEW) await onSubmit(values);
            onClose();
            setSubmitting(false);
        },
    });

    const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploading(true);
        try {
            const response = await testimonialService.uploadImage(file);
            if (response.status === HTTP_STATUS.OK) {
                formik.setFieldValue("imageUrl", response.data.data.url);
                formik.setFieldValue("imageId", response.data.data.publicId);
                return response.data.data;
            }
            throw new Error();
        } catch {
            throw new Error();
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (!testimonial) return;
        formik.setValues({
            profileId: user?.id || "",
            name: testimonial.name,
            role: testimonial.role,
            company: testimonial.company,
            message: testimonial.message,
            imageUrl: testimonial.imageUrl,
            imageId: testimonial.imageId,
            linkedInUrl: testimonial.linkedInUrl,
            order: testimonial.order,
            status: testimonial.status,
        });
    }, [testimonial]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add Testimonial" : mode === MODE.EDIT ? "Edit Testimonial" : "Testimonial Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD ? "Add a professional testimonial" : mode === MODE.EDIT ? "Update testimonial information" : "View testimonial information"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                        Testimonial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Name"
                            placeholder="Enter Name"
                            value={formik.values.name}
                            onChange={e =>
                                formik.setFieldValue(
                                    "name",
                                    titleModification(e.target.value)
                                )
                            }
                            required={true}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={String(formik.touched.name && formik.errors.name)}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Role"
                            placeholder="Enter Role"
                            {...formik.getFieldProps("role")}
                            required={true}
                            error={formik.touched.role && Boolean(formik.errors.role)}
                            helperText={String(formik.touched.role && formik.errors.role)}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Company"
                            placeholder="Enter Company"
                            {...formik.getFieldProps("company")}
                            required={true}
                            error={formik.touched.company && Boolean(formik.errors.company)}
                            helperText={String(formik.touched.company && formik.errors.company)}
                            disabled={mode === MODE.VIEW}
                        />

                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                        Profile Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <TextField
                            label="LinkedIn URL"
                            placeholder="Enter LinkedIn URL"
                            {...formik.getFieldProps("linkedInUrl")}
                            required={true}
                            error={formik.touched.linkedInUrl && Boolean(formik.errors.linkedInUrl)}
                            helperText={String(formik.touched.linkedInUrl && formik.errors.linkedInUrl)}
                            disabled={mode === MODE.VIEW}
                        />
                        <ImageUpload
                            label="Image"
                            value={
                                formik.values.imageId
                                    ? { 
                                        url: formik.values.imageUrl,
                                        publicId: formik.values.imageId,
                                    }
                                    : null
                            }
                            onChange={(value) => {
                                formik.setFieldValue("imageUrl", value?.url || "");
                                formik.setFieldValue("imageId", value?.publicId || "");
                            }}
                            onUpload={uploadImage}
                            disabled={mode === MODE.VIEW || isUploading}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText={
                                isUploading
                                    ? "Uploading..."
                                    : "Image · Max 5MB"
                            }
                            required={true}
                            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Message and Order
                    </h3>
                    <div className="flex flex-col gap-6">
                        <TextField
                            label="Order"
                            placeholder="Enter Order"
                            {...formik.getFieldProps("order")}
                            required={true}
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={String(formik.touched.order && formik.errors.order)}
                            disabled={mode === MODE.VIEW}
                        />
                        <RichTextEditor
                            label="Message"
                            value={formik.values.message}
                            onChange={(value) => formik.setFieldValue("message", value)}
                            isEditMode={mode !== MODE.VIEW}
                            required={true}
                            error={formik.touched.message && Boolean(formik.errors.message)}
                            helperText={String(formik.touched.message && formik.errors.message)}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
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
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={onClose}
                    />
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
        </div>
    );
};

export default TestimonialFormTemplate;
