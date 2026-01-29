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
import { type Achievement, type AchievementRequest } from "../../../services/useAchievementService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { Status, StatusOptions } from "../../../utils/types";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useAchievementService } from "../../../services/useAchievementService";
import { HTTP_STATUS } from "../../../utils/types";
import type { ImageUploadResponse } from "../../../services/useProfileService";
import CustomRadioGroup from "../../molecules/CustomRadioGroup/CustomRadioGroup";
import RichTextEditor from "../../molecules/RichTextEditor/RichTextEditor";

const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(100),
    description: Yup.string().required("Description is required").max(100),
    issuer: Yup.string().required("Issuer is required").max(100),
    achievedAt: Yup.date().required("Achieved at is required"),
    proofUrl: Yup.string().url("Invalid URL"),
    proofPublicId: Yup.string().required("Proof public ID is required"),
    order: Yup.string().required("Order is required"),
    status: Yup.string().required("Status is required"),
});

interface AchievementFormProps {
    onSubmit: (values: AchievementRequest) => void;
    mode: string;
    achievement?: Achievement | null;
}

const AchievementFormTemplate = ({
    onSubmit,
    mode,
    achievement,
}: AchievementFormProps) => {

    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();
    const achievementService = useAchievementService();

    const onClose = () => navigate(ADMIN_ROUTES.ACHIEVEMENTS);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const formik = useFormik<AchievementRequest>({
        initialValues: {
            profileId: user?.id || "",
            title: "",
            description: "",
            issuer: "",
            achievedAt: "",
            proofUrl: "",
            proofPublicId: "",
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

    const uploadProof = async (file: File): Promise<ImageUploadResponse> => {
        setIsUploading(true);
        try {
            const response = await achievementService.uploadImage(file);
            if (response.status === HTTP_STATUS.OK) {
                formik.setFieldValue("proofUrl", response.data.data.url);
                formik.setFieldValue("proofPublicId", response.data.data.publicId);
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
        if (!achievement) return;
        formik.setValues({
            profileId: user?.id || "",
            title: achievement.title,
            description: achievement.description,
            issuer: achievement.issuer,
            achievedAt: achievement.achievedAt,
            proofUrl: achievement.proofUrl,
            proofPublicId: achievement.proofPublicId,
            order: achievement.order,
            status: achievement.status,
        });
    }, [achievement]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? "Add Achievement" : mode === MODE.EDIT ? "Edit Achievement" : "Achievement Details"}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.ADD ? "Add a professional achievement" : mode === MODE.EDIT ? "Update achievement information" : "View achievement information"}
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
                        Achievement Timeline
                    </h3>
                    <div className="flex flex-col gap-6">
                        <DatePicker
                            label="Achieved At"
                            value={formik.values.achievedAt ? dayjs(formik.values.achievedAt) : null}
                            onChange={v =>
                                formik.setFieldValue("achievedAt", v?.toDate())
                            }
                            disabled={mode === MODE.VIEW}
                        />
                        <RichTextEditor
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue("description", value)}
                            readonly={mode === MODE.VIEW}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Proof Details
                    </h3>
                    <div className="flex flex-col gap-6">
                        <ImageUpload
                            label="Proof"
                            value={
                                formik.values.proofPublicId
                                    ? {
                                        url: formik.values.proofUrl,
                                        publicId: formik.values.proofPublicId,
                                    }
                                    : null
                            }
                            onChange={(value) => {
                                formik.setFieldValue("proofUrl", value?.url || "");
                                formik.setFieldValue("proofPublicId", value?.publicId || "");
                            }}
                            onUpload={uploadProof}
                            disabled={mode === MODE.VIEW || isUploading}
                            maxSize={5}
                            aspectRatio="wide"
                            helperText={
                                isUploading
                                    ? "Uploading..."
                                    : "Proof · Max 5MB"
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
                        Achievement Status
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

export default AchievementFormTemplate;
