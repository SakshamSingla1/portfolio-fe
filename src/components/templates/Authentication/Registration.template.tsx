import TextField from "../../atoms/TextField/TextField";
import {
    type AuthRegisterDTO,
    useAuthService,
} from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUserPlus } from "react-icons/fi";
import { AUTH_STATE } from "../../../utils/types";
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
    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password")], "Passwords must match"),
});

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({ setEmail, setAuthState, setIsRegisterFlow }) => {
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();

    const [showPassword, setShowPassword] = useState<{
        password: boolean, confirmPassword: boolean
    }>({ password: false, confirmPassword: false });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formik = useFormik<AuthRegisterDTO>({
        initialValues: {
            fullName: "",
            userName: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            confirmPassword: "",
        },
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
                    showSnackbar('success', 'Registration successful.');
                }
            } catch (error) {
                console.error("Registration failed:", error);
                showSnackbar('error', 'Registration failed. Please try again.');
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
                        <FiUserPlus />
                    </motion.div>
                    <h2 className="text-2xl text-slate-800 font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                        Create your account
                    </h2>
                </div>
                <div className="space-y-4">
                    <TextField
                        fullWidth
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiUser className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.fullName && !!formik.errors.fullName}
                        helperText={formik.touched.fullName && formik.errors.fullName ? String(formik.errors.fullName) : ""}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email ? String(formik.errors.email) : ""}
                    />
                    <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiPhone className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.phone && !!formik.errors.phone}
                        helperText={formik.touched.phone && formik.errors.phone ? String(formik.errors.phone) : ""}
                    />
                    <TextField
                        fullWidth
                        name="password"
                        type={showPassword.password ? "text" : "password"}
                        label="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock className="text-gray-400" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.password ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password ? String(formik.errors.password) : ""}
                    />

                    <div>
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            type={showPassword.confirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiLock className="text-gray-400" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            error={
                                formik.touched.confirmPassword &&
                                Boolean(formik.errors.confirmPassword)
                            }
                            helperText={
                                formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword ? String(formik.errors.confirmPassword) : ""
                            }
                        />
                        <PasswordStrengthMeter password={formik.values.confirmPassword || ""} />
                    </div>
                    <div className="flex justify-center items-center">
                        <Button
                            label="Sign Up"
                            variant="primaryContained"
                            size="large"
                            onClick={() => formik.handleSubmit()}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <span
                                className="text-green-600 cursor-pointer font-medium hover:underline"
                                onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
                            >
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RegisterTemplate;
