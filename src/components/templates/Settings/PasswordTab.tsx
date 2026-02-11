import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, Key, ArrowRight } from "lucide-react";
import TextField from "../../../components/atoms/TextField/TextField";
import Button from "../../../components/atoms/Button/Button";
import { InputAdornment } from "@mui/material";
import { PasswordStrengthMeter } from "../../../components/atoms/PasswordStrengthMeter/PasswordStrengthMeter";
import { FiLock } from "react-icons/fi";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useAuthService } from "../../../services/useAuthService";
import { useSnackbar } from "../../../hooks/useSnackBar";

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
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = colors.neutral600)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = colors.neutral400)
              }
              aria-label="Toggle password visibility"
            >
              {showPassword[name] ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
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
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: colors.primary100,
              color: colors.primary600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Key size={20} />
          </div>

          <h3
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: colors.neutral900,
              margin: 0,
            }}
          >
            Change Password
          </h3>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: colors.neutral500,
            margin: 0,
          }}
        >
          Update your account password securely.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={passwordForm.handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {renderPasswordField("oldPassword", "Old Password")}
        {renderPasswordField("newPassword", "New Password")}
        {renderPasswordField("confirmPassword", "Confirm Password")}

        <PasswordStrengthMeter
          password={passwordForm.values.newPassword}
        />

        <Button
          type="submit"
          label={
            passwordForm.isSubmitting
              ? "Updating..."
              : "Update Password"
          }
          variant="primaryContained"
          disabled={
            passwordForm.isSubmitting ||
            !passwordForm.isValid ||
            !passwordForm.dirty
          }
          endIcon={<ArrowRight size={16} />}
        />
      </form>
    </motion.div>
  );
};

export default PasswordTab;
