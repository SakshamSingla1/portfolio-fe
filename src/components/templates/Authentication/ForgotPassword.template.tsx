import TextField from "../../atoms/TextField/TextField";
import { useAuthService } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiLock, FiMail } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import Button from "../../atoms/Button/Button";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface ForgotPasswordProps {
    setAuthState: (authState: AUTH_STATE) => void;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setAuthState }) => {
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();

      const [isLoading,setIsLoading ] = useState<boolean>(false);
    

    const formik = useFormik<{ email: string }>({
        initialValues: { email: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.forgotPassword(values);

                if (response.status === HTTP_STATUS.OK) {
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    showSnackbar('success', 'Password reset link sent to your email');
                }
            } catch(e) {
                console.error("Error resetting password:", e);
                showSnackbar('error', 'Failed to send reset link. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="p-8">
                <div className="text-center mb-6 flex flex-col items-center">
                    <motion.div 
                        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-3xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <FiLock />
                    </motion.div>
                    <h2 className="text-2xl text-slate-800 font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Forgot Password</h2>
                    <p className="text-gray-600 mt-1">
                        Enter your email to receive a password reset link.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : ""}
                    />
                    <div className="flex justify-center items-center">
                        <Button
                            label="Send Reset Link"
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Remember your password?{" "}
                            <span className="text-green-600 cursor-pointer font-medium hover:underline" onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}>
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;
