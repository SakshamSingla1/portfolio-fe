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
        <div className="w-full">
            <div className="p-8">
                <div className="text-center mb-6 flex flex-col items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                        <FiLock />
                    </div>
                    <h2 className="text-2xl text-green-800 font-bold tracking-tight">Forgot Password</h2>
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
        </div>
    );
};

export default ForgotPassword;
