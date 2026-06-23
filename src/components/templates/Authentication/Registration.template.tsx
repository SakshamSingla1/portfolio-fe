import TextField from "../../atoms/TextField/TextField";
import { type AuthRegisterDTO, useAuthService } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUserPlus } from "react-icons/fi";
import { AUTH_STATE, useColors } from "../../../utils/types";
import { userNameMaker } from "../../../utils/helper";
import Button from "../../atoms/Button/Button";
import { useState } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { FiLock, FiEye, FiEyeOff, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { ROLES } from "../../../utils/constant";
import PasswordStrengthMeter from "../../atoms/PasswordStrengthMeter/PasswordStrengthMeter";
import { motion } from "framer-motion";

interface RegisterTemplateProps {
    setEmail: (email: string) => void;
    setAuthState: (authState: AUTH_STATE) => void;
    setIsRegisterFlow: (isRegisterFlow: boolean) => void;
}

const validationSchema = Yup.object({
    fullName: Yup.string().required("Name is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().min(6).required("Password is required"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
});

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({
    setEmail, setAuthState, setIsRegisterFlow,
}) => {
    const colors = useColors();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<AuthRegisterDTO>({
        initialValues: { fullName: "", userName: "", email: "", phone: "", role: "", password: "", confirmPassword: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.register({
                    ...values,
                    userName: userNameMaker(values.email),
                    role: ROLES.ADMIN,
                });
                if (response.status === 200) {
                    setEmail(values.email);
                    setIsRegisterFlow(true);
                    setAuthState(AUTH_STATE.OTP_VERIFICATION);
                    showSnackbar("success", "Registration successful.");
                }
            } catch {
                showSnackbar("error", "Registration failed. Please try again.");
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
            <div className="px-8 py-8">
                <div className="mb-7">
                    <motion.div
                        className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 text-white text-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary700})`,
                            boxShadow: `0 8px 24px -4px ${colors.primary500}50`,
                        }}
                        whileHover={{ scale: 1.05, rotate: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <FiUserPlus />
                    </motion.div>
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                        Create an account
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Join the portfolio platform today
                    </p>
                </div>

                <div className="space-y-4">
                    <TextField
                        fullWidth id="fullName" name="fullName" label="Full Name"
                        value={formik.values.fullName} onChange={formik.handleChange}
                        InputProps={{ startAdornment: <InputAdornment position="start"><FiUser style={iconStyle} /></InputAdornment> }}
                        error={formik.touched.fullName && !!formik.errors.fullName}
                        helperText={formik.touched.fullName && formik.errors.fullName ? String(formik.errors.fullName) : ""}
                    />
                    <TextField
                        fullWidth id="email" name="email" label="Email Address"
                        value={formik.values.email} onChange={formik.handleChange}
                        InputProps={{ startAdornment: <InputAdornment position="start"><FiMail style={iconStyle} /></InputAdornment> }}
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : ""}
                    />
                    <TextField
                        fullWidth id="phone" name="phone" label="Phone Number"
                        value={formik.values.phone} onChange={formik.handleChange}
                        InputProps={{ startAdornment: <InputAdornment position="start"><FiPhone style={iconStyle} /></InputAdornment> }}
                        error={formik.touched.phone && !!formik.errors.phone}
                        helperText={formik.touched.phone && formik.errors.phone ? String(formik.errors.phone) : ""}
                    />
                    <TextField
                        fullWidth name="password" type={showPassword.password ? "text" : "password"} label="Password"
                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><FiLock style={iconStyle} /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(p => ({ ...p, password: !p.password }))} edge="end" size="small" style={iconStyle}>
                                        {showPassword.password ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password ? String(formik.errors.password) : ""}
                    />
                    <div>
                        <TextField
                            fullWidth name="confirmPassword" type={showPassword.confirmPassword ? "text" : "password"} label="Confirm Password"
                            value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><FiLock style={iconStyle} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(p => ({ ...p, confirmPassword: !p.confirmPassword }))} edge="end" size="small" style={iconStyle}>
                                            {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
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
                        label={isLoading ? "Creating account…" : "Sign Up"}
                        variant="primaryContained" fullWidth size="large"
                        onClick={() => formik.handleSubmit()} disabled={isLoading}
                    />
                </div>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.22)" }}>OR</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </div>

                <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Already have an account?{" "}
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

export default RegisterTemplate;
