import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import TextField from "../../../components/atoms/TextField/TextField";
import Button from "../../../components/atoms/Button/Button";
import { InputAdornment } from "@mui/material";
import { PasswordStrengthMeter } from "../../../components/atoms/PasswordStrengthMeter/PasswordStrengthMeter";
import { FiLock } from "react-icons/fi";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useAuthService } from "../../../services/useAuthService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { FiEye, FiEyeOff, FiKey, FiArrowRight } from "react-icons/fi";

const PasswordTab: React.FC = () => {
  const colors = useColors();

  const authService = useAuthService();
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordForm = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Minimum 8 characters required")
        .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .matches(/[a-z]/, "Must contain at least 1 lowercase letter")
        .matches(/[0-9]/, "Must contain at least 1 number"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const response = await authService.changePassword(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar("success", "Password updated successfully");
          resetForm();
        }
      } catch (error) {
        console.error("Error changing password:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderPasswordField = (
    name: "oldPassword" | "newPassword" | "confirmPassword",
    label: string
  ) => (
    <TextField
      label={label}
      name={name}
      type={showPassword[name] ? "text" : "password"}
      value={passwordForm.values[name]}
      onChange={passwordForm.handleChange}
      onBlur={passwordForm.handleBlur}
      error={
        passwordForm.touched[name] &&
        Boolean(passwordForm.errors[name])
      }
      helperText={
        passwordForm.touched[name] && passwordForm.errors[name]
          ? String(passwordForm.errors[name])
          : ""
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FiLock style={{ color: colors.neutral400 }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <button
              type="button"
              onClick={() => toggleVisibility(name)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: colors.neutral400,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.neutral600)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral400)}
            >
              {showPassword[name] ? (
                <FiEye size={18} />
              ) : (
                <FiEyeOff size={18} />
              )}
            </button>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "24px",
        width: "100%",
      }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center p-2 rounded-xl"
            style={{
              backgroundColor: colors.primary100,
              color: colors.primary600,
            }}
          >
            <FiKey size={20} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>
            Change Password
          </h3>
        </div>
        <p className="text-sm" style={{ color: colors.neutral500 }}>
          Update your account password securely.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {renderPasswordField("oldPassword", "Old Password")}
        {renderPasswordField("newPassword", "New Password")}
        {renderPasswordField("confirmPassword", "Confirm Password")}
        <PasswordStrengthMeter password={passwordForm.values.newPassword} />
        <div className="flex items-center justify-center mt-4">
          <Button
            label={passwordForm.isSubmitting ? "Updating..." : "Update Password"}
            variant="primaryContained"
            disabled={passwordForm.isSubmitting}
            endIcon={<FiArrowRight size={16} />}
            onClick={() => passwordForm.handleSubmit()}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordTab;
