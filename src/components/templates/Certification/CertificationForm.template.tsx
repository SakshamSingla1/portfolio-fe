import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import { type Certification, type CertificationRequest } from "../../../services/useCertificationService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { Status, StatusOptions } from "../../../utils/types";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useCertificationService } from "../../../services/useCertificationService";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    issuer: Yup.string().required("Issuer is required"),
    issueDate: Yup.date().required("Issue date is required"),
    expiryDate: Yup.date()
        .min(Yup.ref("issueDate"), "Expiry date must be after issue date")
        .nullable(),
    credentialId: Yup.string().required("Credential ID is required"),
    credentialUrl: Yup.string().url("Invalid URL"),
    order: Yup.string().required("Order is required"),
    status: Yup.string().required("Status is required"),
});

interface CertificationFormProps {
    onSubmit: (values: CertificationRequest) => void;
    mode: string;
    certification?: Certification | null;
}

const CertificationFormTemplate = ({
    onSubmit,
    mode,
    certification,
}: CertificationFormProps) => {

    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();
    const certificationService = useCertificationService();

    const onClose = () => navigate(ADMIN_ROUTES.CERTIFICATIONS);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const formik = useFormik<CertificationRequest>({
        initialValues: {
            profileId: user?.id || "",
            title: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
            credentialId: "",
            credentialUrl: "",
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

    const uploadCredential = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploading(true);
        try {
            const response = await certificationService.uploadCredential(file);
            if (response.status === HTTP_STATUS.OK) {
                formik.setFieldValue("credentialUrl", response.data.data.url);
                formik.setFieldValue("credentialId", response.data.data.publicId);
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
        if (!certification) return;
        formik.setValues({
            profileId: user?.id || "",
            title: certification.title,
            issuer: certification.issuer,
            issueDate: certification.issueDate,
            expiryDate: certification.expiryDate,
            credentialId: certification.credentialId || "",
            credentialUrl: certification.credentialUrl || "",
            order: certification.order,
            status: certification.status,
        });
    }, [certification]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add Certification" : mode === MODE.EDIT ? "Edit Certification" : "Certification Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD ? "Add a professional certification" : mode === MODE.EDIT ? "Update certification information" : "View certification information"}
                </p>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Title"
                            placeholder="Enter Title"
                            value={formik.values.title}
                            onChange={e =>
                                formik.setFieldValue(
                                    "title",
                                    titleModification(e.target.value)
                                )
                            }
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={String(formik.touched.title && formik.errors.title)}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Issuer"
                            placeholder="Enter Issuer"
                            {...formik.getFieldProps("issuer")}
                            error={formik.touched.issuer && Boolean(formik.errors.issuer)}
                            helperText={String(formik.touched.issuer && formik.errors.issuer)}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                        Certification Timeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DatePicker
                            label="Issue Date"
                            value={formik.values.issueDate ? dayjs(formik.values.issueDate) : null}
                            onChange={v =>
                                formik.setFieldValue("issueDate", v?.toDate())
                            }
                            disabled={mode === MODE.VIEW}
                        />
                        <DatePicker
                            label="Expiry Date"
                            value={formik.values.expiryDate ? dayjs(formik.values.expiryDate) : null}
                            onChange={v =>
                                formik.setFieldValue("expiryDate", v?.toDate())
                            }
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Credential Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <ImageUpload
                            label="Credential"
                            value={
                                formik.values.credentialId
                                    ? {
                                        url: formik.values.credentialUrl,
                                        publicId: formik.values.credentialId,
                                    }
                                    : null
                            }
                            onChange={(value) => {
                                formik.setFieldValue("credentialUrl", value?.url || "");
                                formik.setFieldValue("credentialId", value?.publicId || "");
                            }}
                            onUpload={uploadCredential}
                            disabled={mode === MODE.VIEW || isUploading}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText={
                                isUploading
                                    ? "Uploading..."
                                    : "Credential · Max 5MB"
                            }
                        />
                        <TextField
                            label="Order"
                            placeholder="Enter Order"
                            {...formik.getFieldProps("order")}
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={String(formik.touched.order && formik.errors.order)}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                        Certification Status
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
                            disabled={formik.isSubmitting || !formik.isValid}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificationFormTemplate;
