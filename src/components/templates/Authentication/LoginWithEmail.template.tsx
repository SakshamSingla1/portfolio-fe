import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "../../atoms/TextField/TextField";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { type AuthLoginDTO, useAuthService } from "../../../services/useAuthService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiEye, FiLock, FiMail, FiEyeOff, FiPhone } from "react-icons/fi";
import { AUTH_STATE, useColors } from "../../../utils/types";
import { InputAdornment, IconButton } from "@mui/material";
import Button from "../../atoms/Button/Button";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface LoginWithEmailProps {
    setAuthState: (authState: AUTH_STATE) => void;
    setPendingToken: (token: string) => void;
}

const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const LoginWithEmail: React.FC<LoginWithEmailProps> = ({ setAuthState, setPendingToken }) => {
    const colors = useColors();
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setRolePermissions } = useAuthenticatedUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    const formik = useFormik<AuthLoginDTO>({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.login(values);
                const user = response.data.data;
                if (user.twoFactorRequired) {
                    setPendingToken(user.pendingToken);
                    setAuthState(AUTH_STATE.TWO_FACTOR_VERIFY);
                    return;
                }
                setAuthenticatedUser({
                    id: user.id, fullName: user.fullName, userName: user.userName,
                    email: user.email, phone: user.phone, roleId: user.roleId,
                    roleName: user.roleName, status: user.status,
                    emailVerified: user.emailVerified, phoneVerified: user.phoneVerified,
                    token: user.token,
                });
                setDefaultTheme(user.defaultTheme);
                setRolePermissions(user.rolePermissions);
                navigate("dashboard");
                showSnackbar("success", "Login successful!");
            } catch {
                showSnackbar("error", "Invalid email or password. Please try again.");
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
                {/* Header */}
                <div className="mb-8">
                    <motion.div
                        className="inline-flex items-center justify-center p-3 rounded-2xl mb-5 text-white text-2xl"
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
                        Welcome back
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Sign in to continue to your portfolio
                    </p>
                </div>

                {/* Email / Phone toggle */}
                <div className="mb-6">
                    <ToggleButtonGroup
                        fullWidth exclusive value="email"
                        onChange={(_e, v) => v === "phone" && setAuthState(AUTH_STATE.LOGIN_WITH_PHONE)}
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            padding: "4px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.07)",
                            "& .MuiToggleButton-root": {
                                border: "none",
                                borderRadius: "10px !important",
                                padding: "9px 16px",
                                fontSize: "0.875rem",
                                textTransform: "none",
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.45)",
                                transition: "all 0.2s ease",
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(255,255,255,0.10)",
                                    color: colors.primary400,
                                    boxShadow: `0 2px 8px ${colors.primary500}30`,
                                },
                            },
                        }}
                    >
                        <ToggleButton value="email" className="flex items-center gap-2">
                            <FiMail size={15} /> Email
                        </ToggleButton>
                        <ToggleButton value="phone" className="flex items-center gap-2">
                            <FiPhone size={15} /> Phone
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <div className="space-y-4">
                    <TextField
                        fullWidth id="email" name="email" label="Email Address"
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

                    <TextField
                        fullWidth name="password" label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock style={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end" size="small"
                                        style={{ color: "rgba(255,255,255,0.35)" }}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password ? String(formik.errors.password) : ""}
                    />
                </div>

                <div className="flex justify-end mt-3">
                    <button
                        type="button"
                        onClick={() => setAuthState(AUTH_STATE.FORGOT_PASSWORD)}
                        className="text-sm font-medium hover:underline transition-colors"
                        style={{ color: colors.primary400 }}
                    >
                        Forgot password?
                    </button>
                </div>

                <div className="mt-6">
                    <Button
                        label={isLoading ? "Signing in…" : "Sign In"}
                        onClick={() => formik.handleSubmit()}
                        variant="primaryContained"
                        fullWidth
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.22)" }}>OR</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </div>

                <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Don't have an account?{" "}
                    <span
                        className="font-semibold cursor-pointer hover:underline"
                        style={{ color: colors.primary400 }}
                        onClick={() => setAuthState(AUTH_STATE.REGISTER)}
                    >
                        Create one
                    </span>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginWithEmail;
