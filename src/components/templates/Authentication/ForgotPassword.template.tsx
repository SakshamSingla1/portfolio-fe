import TextField from "../../atoms/TextField/TextField";
import { useAuthService } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiLock, FiMail, FiArrowLeft } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS, useColors } from "../../../utils/types";
import Button from "../../atoms/Button/Button";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface ForgotPasswordProps {
    setAuthState: (authState: AUTH_STATE) => void;
}

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setAuthState }) => {
    const colors = useColors();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<{ email: string }>({
        initialValues: { email: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.forgotPassword(values);
                if (response.status === HTTP_STATUS.OK) {
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    showSnackbar("success", "Password reset link sent to your email");
                }
            } catch {
                showSnackbar("error", "Failed to send reset link. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="px-8 py-10">
                <button
                    type="button"
                    onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
                    className="flex items-center gap-2 mb-7 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: colors.primary400 }}
                >
                    <FiArrowLeft /> Back to login
                </button>

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
                        Forgot password?
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        We'll send a reset link to your email address
                    </p>
                </div>

                <div className="space-y-4">
                    <TextField
                        fullWidth name="email" label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail style={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : ""}
                    />
                </div>

                <div className="mt-6">
                    <Button
                        label={isLoading ? "Sending…" : "Send Reset Link"}
                        variant="primaryContained" fullWidth
                        onClick={() => formik.handleSubmit()} disabled={isLoading}
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

export default ForgotPassword;
