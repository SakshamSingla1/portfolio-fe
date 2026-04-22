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
import { FaFingerprint, FaLink, FaArrowLeft, FaCheck } from "react-icons/fa";

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

  const devicon = (slug: string, variant = "original") =>
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

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

  useEffect(() => {
    const name = formik.values.name;
    const currentUrl = formik.values.url;
    const isDevIconUrl = currentUrl.startsWith("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/");

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

  return (
    <div className="relative w-full max-w-[1000px] mx-auto py-10 px-6 min-h-full">
      {/* Ambient background glows */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] blur-[120px] opacity-[0.05] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.primary500}, transparent)` }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] blur-[100px] opacity-[0.03] pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.accent500 || colors.primary400}, transparent)` }}
      />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={onClose}
              className="h-12 w-12 rounded-[16px] flex items-center justify-center border transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.neutral0, borderColor: colors.neutral200 }}
            >
              <FaArrowLeft style={{ color: colors.neutral600 }} />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>
                {mode === MODE.ADD ? "Create " : mode === MODE.EDIT ? "Modify " : "View "}
                <span style={{ color: colors.primary500 }}>Logo</span>
              </h1>
              <p className="text-sm mt-1 font-medium opacity-50" style={{ color: colors.neutral600 }}>
                Manage your project and skill iconography with automated DevIcon integration.
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex h-16 w-16 rounded-[20px] items-center justify-center shadow-xl" style={{ backgroundColor: colors.neutral0, border: `1px solid ${colors.neutral200}40` }}>
            <FaFingerprint style={{ color: colors.primary500, fontSize: 28 }} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10"
      >
        <div 
          className="p-8 rounded-[28px] border transition-all duration-500 shadow-2xl"
          style={{ 
            backgroundColor: `${colors.neutral0}aa`, 
            backdropFilter: "blur(16px)",
            borderColor: `${colors.neutral200}80`,
            boxShadow: `0 20px 50px ${colors.neutral900}08`
          }}
        >
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
                  {formik.values.url || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."}
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
      </motion.div>

      {/* Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
};

export default LogoFormTemplate;
