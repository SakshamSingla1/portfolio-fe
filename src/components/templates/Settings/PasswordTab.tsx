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

interface PasswordTabProps {
  handleChangePasswordSubmit: (values: any) => void;
  setFormStatus: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; message: string } | null>>;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ handleChangePasswordSubmit, setFormStatus }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const passwordForm = useFormik({
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string().required("New password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      try {
        handleChangePasswordSubmit(values);
        setFormStatus({ type: "success", message: "Password updated successfully" });
        resetForm();
      } catch (error: any) {
        setFormStatus({ type: "error", message: error.message || "Error changing password" });
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
        </div>
        <p className="text-gray-500 text-sm">Update your account password securely.</p>
      </div>  

      <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <TextField
            label="Old Password"
            name="oldPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={passwordForm.values.oldPassword}
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            error={passwordForm.touched.oldPassword && Boolean(passwordForm.errors.oldPassword)}
            helperText={passwordForm.touched.oldPassword && passwordForm.errors.oldPassword}
            className="bg-gray-50"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiLock className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </InputAdornment>
              )
            }}
          />
        </div>

        <div className="space-y-1">
          <TextField
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={passwordForm.values.newPassword}
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
            helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
            className="bg-gray-50"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiLock className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </InputAdornment>
              )
            }}
          />
          <PasswordStrengthMeter password={passwordForm.values.newPassword} />
        </div>

        <div className="pt-2">
          <Button
            label="Update Password"
            variant="primaryContained"
            onClick={() => passwordForm.handleSubmit()}
            disabled={!passwordForm.isValid}
            endIcon={<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default PasswordTab;
