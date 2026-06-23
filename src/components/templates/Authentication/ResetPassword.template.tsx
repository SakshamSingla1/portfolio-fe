import TextField from "../../atoms/TextField/TextField";
import { useAuthService, type PasswordResetConfirmDTO } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS, useColors } from "../../../utils/types";
import { useSearchParams } from "react-router-dom";
import { InputAdornment, IconButton } from "@mui/material";
import Button from "../../atoms/Button/Button";
import { useSnackbar } from "../../../hooks/useSnackBar";
import PasswordStrengthMeter from "../../atoms/PasswordStrengthMeter/PasswordStrengthMeter";
import { motion } from "framer-motion";

interface ResetPasswordProps {
  setAuthState: (authState: AUTH_STATE) => void;
}

const validationSchema = Yup.object({
  token: Yup.string().required("Token is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ResetPassword: React.FC<ResetPasswordProps> = ({ setAuthState }) => {
  const colors = useColors();
  const authService = useAuthService();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSnackbar } = useSnackbar();

  const formik = useFormik<PasswordResetConfirmDTO>({
    initialValues: { token: searchParams.get("token") || "", newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await authService.resetPassword({ token: values.token, newPassword: values.newPassword });
        if (response.status === HTTP_STATUS.OK) {
          setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
          showSnackbar("success", "Password reset successful! You can now login with your new password.");
        } else {
          showSnackbar("error", "Password reset failed. Please try again.");
        }
      } catch {
        showSnackbar("error", "Password reset failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const iconStyle = { color: "rgba(255,255,255,0.3)" };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="px-8 py-10">
        <div className="mb-8">
          <motion.div
            className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 text-white text-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary700})`,
              boxShadow: `0 8px 24px -4px ${colors.primary500}50`,
            }}
            whileHover={{ scale: 1.05, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <FiLock />
          </motion.div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
            Reset your password
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Enter your new password below
          </p>
        </div>

        <div className="space-y-5">
          <TextField
            fullWidth name="newPassword" type={showPassword ? "text" : "password"} label="New Password"
            value={formik.values.newPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
            InputProps={{
              startAdornment: <InputAdornment position="start"><FiLock style={iconStyle} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" style={iconStyle}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword ? String(formik.errors.newPassword) : ""}
          />
          <div>
            <TextField
              fullWidth name="confirmPassword" type={showConfirmPassword ? "text" : "password"} label="Confirm Password"
              value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
              InputProps={{
                startAdornment: <InputAdornment position="start"><FiLock style={iconStyle} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small" style={iconStyle}>
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword ? String(formik.errors.confirmPassword) : ""}
            />
            <PasswordStrengthMeter password={formik.values.confirmPassword || ""} />
          </div>
        </div>

        <div className="mt-6">
          <Button
            label={isLoading ? "Resetting…" : "Reset Password"}
            variant="primaryContained" fullWidth
            disabled={isLoading} onClick={() => formik.handleSubmit()}
          />
        </div>

        <p className="text-sm text-center mt-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          Remember your password?{" "}
          <span
            className="font-semibold cursor-pointer hover:underline"
            style={{ color: colors.primary400 }}
            onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
          >
            Sign in
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
