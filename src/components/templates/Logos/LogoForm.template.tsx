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
import { useColors } from "../../../utils/types";
import { motion, AnimatePresence } from "framer-motion";
import { FaLink, FaCheck } from "react-icons/fa";
import FormShell from "../Shared/FormShell.template";

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
  const colors = useColors();
  const profileService = useProfileService();

  const [isUploading, setIsUploading] = useState<{ logo: boolean }>({
    logo: false,
  });

  const onClose = () => navigate(ADMIN_ROUTES.LOGO);

  const devicon = (slug: string, variant = "original") => {
    const selectedVariant = slug === "java" ? "original-wordmark" : variant;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${selectedVariant}.svg`;
  };

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
        const asset = response.data.data;
        formik.setFieldValue("url", asset.path);
        return { url: asset.path, publicId: asset.id };
      }
      throw new Error("Upload failed");
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

  useEffect(() => {
    const name = formik.values.name;
    const currentUrl = formik.values.url;
    const isDevIconUrl =
      currentUrl.startsWith("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/") ||
      currentUrl.startsWith("https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/");

    if (mode !== MODE.VIEW) {
      if (name && (!currentUrl || isDevIconUrl)) {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        if (slug) {
          const generatedUrl = devicon(slug);
          if (currentUrl !== generatedUrl) {
            formik.setFieldValue("url", generatedUrl);
          }
        }
      } else if (!name && isDevIconUrl) {
        formik.setFieldValue("url", "");
      }
    }
  }, [formik.values.name, mode]);

  const title =
    mode === MODE.ADD ? "Create Logo" : mode === MODE.EDIT ? "Modify Logo" : "View Logo";

  return (
    <FormShell
      title={title}
      subtitle="Manage your project and skill iconography with automated DevIcon integration."
      breadcrumb="Logos"
      onBack={() => navigate(-1)}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-40" style={{ color: colors.neutral900 }}>Information</h3>
              <TextField
                label="Logo Name"
                placeholder="e.g. React, Node.js, Python"
                {...formik.getFieldProps("name")}
                onBlur={(e: any) =>
                  formik.setFieldValue("name", titleModification(e.target.value))
                }
                disabled={mode === MODE.VIEW}
                required
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name ? formik.errors.name : ""}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaLink style={{ color: colors.primary500, fontSize: 14 }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.neutral500 }}>Auto-Generated URL</span>
              </div>
              <div
                className="p-4 rounded-xl border border-dashed font-mono text-[10px] break-all leading-relaxed"
                style={{
                  backgroundColor: `${colors.neutral50}50`,
                  borderColor: `${colors.primary500}30`,
                  color: formik.values.url ? colors.primary700 : colors.neutral400
                }}
              >
                {formik.values.url || "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/..."}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40" style={{ color: colors.neutral900 }}>Asset Configuration</h3>
            <div
              className="relative p-2 rounded-[24px] border transition-all w-[200px] h-[200px]"
              style={{
                backgroundColor: `${colors.neutral50}30`,
                borderColor: `${colors.neutral200}40`
              }}
            >
              <ImageUpload
                label=""
                value={formik.values.url ? { url: formik.values.url } : null}
                onChange={(value) => formik.setFieldValue("url", value?.url || "")}
                onUpload={uploadLogo}
                disabled={mode === MODE.VIEW || isUploading.logo}
                maxSize={5}
                aspectRatio="square"
                helperText=""
                error={Boolean(formik.errors.url && formik.touched.url)}
                required={mode !== MODE.VIEW}
                className="h-full w-full"
              />
            </div>

            <p className="text-[10px] font-medium opacity-40 italic px-2">
              {isUploading.logo ? "Processing asset..." : "SVG, PNG or URL · Max 5MB · 1:1 Aspect Ratio"}
            </p>

            <AnimatePresence>
              {formik.values.url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-bold w-fit"
                >
                  <FaCheck />
                  Asset link validated and ready
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-end gap-4" style={{ borderColor: `${colors.neutral200}40` }}>
          <Button
            label="Discard Changes"
            variant="tertiaryContained"
            onClick={onClose}
            className="px-8"
          />

          {mode !== MODE.VIEW && (
            <Button
              label={mode === MODE.ADD ? "Initialize Logo" : "Save Refinements"}
              variant="primaryContained"
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting || isUploading.logo}
              className="px-10 shadow-lg shadow-primary-500/20"
            />
          )}
        </div>
      </div>
    </FormShell>
  );
};

export default LogoFormTemplate;
