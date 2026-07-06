import { useState, useEffect } from "react";
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
import { Status, StatusOptions } from "../../../utils/types";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useCertificationService } from "../../../services/useCertificationService";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import { useColors } from "../../../utils/types";
import FormShell from "../Shared/FormShell.template";

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    issuer: Yup.string().required("Issuer is required"),
    issueDate: Yup.date().required("Issue date is required"),
    expiryDate: Yup.date()
        .min(Yup.ref("issueDate"), "Expiry date must be after issue date")
        .nullable(),
    hasCredentialImage: Yup.boolean().oneOf([true], "Credential image is required"),
    order: Yup.string().required("Order is required"),
    status: Yup.string().required("Status is required"),
});

interface CertificationFormProps {
    onSubmit: (values: CertificationRequest) => Promise<void>;
    mode: string;
    certification?: Certification | null;
}

interface CertificationFormValues extends CertificationRequest {
    hasCredentialImage: boolean;
}

const CertificationFormTemplate = ({
    onSubmit,
    mode,
    certification,
}: CertificationFormProps) => {

    const navigate = useNavigate();
    const certificationService = useCertificationService();
    const colors = useColors();

    const onClose = () => navigate(ADMIN_ROUTES.CERTIFICATIONS);

    const [pendingCredentialFile, setPendingCredentialFile] = useState<File | null>(null);
    const [credentialPreviewUrl, setCredentialPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (credentialPreviewUrl && credentialPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(credentialPreviewUrl);
            }
        };
    }, [credentialPreviewUrl]);

    const formik = useFormik<CertificationFormValues>({
        initialValues: {
            title: certification?.title || "",
            issuer: certification?.issuer || "",
            issueDate: certification?.issueDate || "",
            expiryDate: certification?.expiryDate || "",
            credentialId: certification?.credentialId || "",
            credentialUrl: certification?.credentialUrl || "",
            credentialPublicId: certification?.credentialPublicId || "",
            order: certification?.order || "",
            status: certification?.status || Status.ACTIVE,
            hasCredentialImage: !!certification?.credentialUrl,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let credentialUrl = values.credentialUrl;
            let credentialPublicId = values.credentialPublicId;

            if (pendingCredentialFile) {
                try {
                    const response = await certificationService.uploadCredential(pendingCredentialFile);
                    if (response.status === HTTP_STATUS.OK) {
                        const asset = response.data.data;
                        credentialUrl = asset.path;
                        credentialPublicId = asset.publicId;
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
                title: values.title,
                issuer: values.issuer,
                issueDate: values.issueDate,
                expiryDate: values.expiryDate,
                credentialId: values.credentialId,
                credentialUrl,
                credentialPublicId,
                order: values.order,
                status: values.status,
            };
            setSubmitting(true);
            if (mode !== MODE.VIEW) await onSubmit(payload);
            onClose();
            setSubmitting(false);
        },
    });

    const handleCredentialSelect = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setPendingCredentialFile(file);
        setCredentialPreviewUrl(previewUrl);
        formik.setFieldValue("hasCredentialImage", true);
        return previewUrl;
    };

    const handleCredentialClear = () => {
        if (credentialPreviewUrl && credentialPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(credentialPreviewUrl);
        }
        setPendingCredentialFile(null);
        setCredentialPreviewUrl(null);
        formik.setFieldValue("credentialUrl", "");
        formik.setFieldValue("credentialPublicId", "");
        formik.setFieldValue("hasCredentialImage", false);
    };

    const uploadCredential = async (file: File): Promise<ImageUploadResponse> => {
        const url = handleCredentialSelect(file);
        return { url, publicId: "" };
    };

    const cardStyle: React.CSSProperties = {
        background: colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: colors.neutral800,
    };

    return (
        <FormShell
            title={mode === MODE.ADD ? "Add Certification" : mode === MODE.EDIT ? "Edit Certification" : "Certification Details"}
            subtitle={mode === MODE.ADD ? "Add a professional certification" : mode === MODE.EDIT ? "Update certification information" : "View certification information"}
            onBack={() => navigate(-1)}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
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
                            required={true}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={Boolean(formik.touched.title && formik.errors.title) ? formik.errors.title : ""}
                            disabled={mode === MODE.VIEW}
                        />

                        <TextField
                            label="Issuer"
                            placeholder="Enter Issuer"
                            {...formik.getFieldProps("issuer")}
                            required={true}
                            error={formik.touched.issuer && Boolean(formik.errors.issuer)}
                            helperText={Boolean(formik.touched.issuer && formik.errors.issuer) ? formik.errors.issuer : ""}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>

                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.secondary500 }} />
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
                            required={true}
                            error={formik.touched.issueDate && Boolean(formik.errors.issueDate)}
                            helperText={Boolean(formik.touched.issueDate && formik.errors.issueDate) ? formik.errors.issueDate : ""}
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
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Credential Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <ImageUpload
                            label="Credential"
                            value={
                                credentialPreviewUrl
                                    ? { url: credentialPreviewUrl, publicId: "" }
                                    : formik.values.credentialPublicId
                                    ? { url: formik.values.credentialUrl, publicId: formik.values.credentialPublicId }
                                    : null
                            }
                            onChange={(value) => {
                                if (!value) {
                                    handleCredentialClear();
                                }
                            }}
                            onUpload={uploadCredential}
                            disabled={mode === MODE.VIEW}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText={formik.submitCount > 0 && formik.errors.hasCredentialImage ? String(formik.errors.hasCredentialImage) : "Credential · Max 5MB"}
                            error={formik.submitCount > 0 && Boolean(formik.errors.hasCredentialImage)}
                            required={true}
                        />
                        <TextField
                            label="Credential ID"
                            placeholder="Enter Credential ID (e.g. GOOG-12345)"
                            {...formik.getFieldProps("credentialId")}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.credentialId && Boolean(formik.errors.credentialId)}
                            helperText={Boolean(formik.touched.credentialId && formik.errors.credentialId) ? formik.errors.credentialId : ""}
                        />
                        <TextField
                            label="Order"
                            placeholder="Enter Order"
                            {...formik.getFieldProps("order")}
                            required={true}
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={Boolean(formik.touched.order && formik.errors.order) ? formik.errors.order : ""}
                            disabled={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
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
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </FormShell>
    );
};

export default CertificationFormTemplate;
