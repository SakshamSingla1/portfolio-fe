import React, { useEffect, useState } from "react";
import TextField from "../../atoms/TextField/TextField";
import { MODE, ADMIN_ROUTES } from "../../../utils/constant";
import { titleModification } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { type LogoRequest, type Logo } from "../../../services/useLogoService";
import ImageUpload from "../../atoms/ImageUpload/ImageUpload";
import { useProfileService, type ImageUploadResponse } from "../../../services/useProfileService";
import { HTTP_STATUS } from "../../../utils/types";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Logo name is required"),
  url: Yup.string().trim().required("Logo is required"),
});

interface LogoFormProps {
  onSubmit: (values: LogoRequest) => void;
  mode: string;
  logo?: Logo | null;
}

const LogoFormTemplate: React.FC<LogoFormProps> = ({
  onSubmit,
  mode,
  logo,
}) => {
  const navigate = useNavigate();
  const profileService = useProfileService();

  const [isUploading, setIsUploading] = useState<{ logo: boolean }>({
    logo: false,
  });

  const onClose = () => navigate(ADMIN_ROUTES.LOGO);

  const formik = useFormik<LogoRequest>({
    initialValues: {
      name: "",
      url: "",
    },
    validationSchema,
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

  const uploadLogo = async (file: File): Promise<ImageUploadResponse> => {
    setIsUploading((prev) => ({ ...prev, logo: true }));

    try {
      const response = await profileService.uploadLogo(file);

      if (response.status === HTTP_STATUS.OK) {
        const uploaded = response.data.data;
        formik.setFieldValue("url", uploaded.url);
        return uploaded;
      }

      throw new Error("Upload failed");
    } catch (error) {
      throw error;
    } finally {
      setIsUploading((prev) => ({ ...prev, logo: false }));
    }
  };

  useEffect(() => {
    if (logo) {
      formik.setValues({
        name: logo.name || "",
        url: logo.url || "",
      });
    }
  }, [logo]);

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === MODE.ADD
            ? "Add New Logo"
            : mode === MODE.EDIT
            ? "Edit Logo"
            : "Logo Details"}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TextField
            label="Logo Name"
            placeholder="Enter logo name"
            {...formik.getFieldProps("name")}
            onBlur={(e: any) =>
              formik.setFieldValue("name", titleModification(e.target.value))
            }
            disabled={mode === MODE.VIEW}
            required
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name ? formik.errors.name : ""}
          />

          <ImageUpload
            label="Logo"
            value={
              formik.values.url
                ? { url: formik.values.url }
                : null
            }
            onChange={(value) =>
              formik.setFieldValue("url", value?.url || "")
            }
            onUpload={uploadLogo}
            disabled={mode === MODE.VIEW || isUploading.logo}
            maxSize={5}
            aspectRatio="square"
            helperText={
              isUploading.logo
                ? "Uploading..."
                : "Logo · Max 5MB"
            }
            error={Boolean(formik.errors.url && formik.touched.url)}
            required={mode !== MODE.VIEW}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-3">
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
            disabled={formik.isSubmitting || isUploading.logo}
          />
        )}
      </div>
    </div>
  );
};

export default LogoFormTemplate;
