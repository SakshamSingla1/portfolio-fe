import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthService } from "../../../services/useAuthService";
import { ADMIN_ROUTES, REGEX } from "../../../utils/constant";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import FormShell from "../../templates/Shared/FormShell.template";

const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    userName: Yup.string().required("Username is required"),
    email: Yup.string().matches(REGEX.EMAIL, "Enter a valid email").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(REGEX.PASSWORD, "Must include uppercase, number and special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    phone: Yup.string().matches(REGEX.PHONE_NUMBER, "Enter a valid 10-digit phone number").optional(),
});

const AddUserPage: React.FC = () => {
    const navigate = useNavigate();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const colors = useColors();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => navigate(ADMIN_ROUTES.USER);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const response = await authService.register({
                    fullName: values.fullName,
                    userName: values.userName,
                    email: values.email,
                    password: values.password,
                    role: "USER",
                    phone: values.phone,
                });
                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar("success", "User created — OTP verification email sent");
                    onClose();
                } else {
                    showSnackbar("error", response?.data?.message ?? "Failed to create user");
                }
            } catch (error) {
                showSnackbar("error", `${error}`);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <FormShell
            title="Add User"
            subtitle="Create a new user account. A verification OTP will be sent to their email."
            breadcrumb="Users"
            onBack={onClose}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="p-5 grid grid-cols-1 gap-4" style={{ color: colors.neutral900 }}>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                        helperText={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : ""}
                    />
                    <TextField
                        label="Username"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.userName && formik.errors.userName)}
                        helperText={formik.touched.userName && formik.errors.userName ? formik.errors.userName : ""}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                    />
                    <TextField
                        label="Phone (optional)"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.phone && formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}
                    />
                </div>

                <div
                    className="flex justify-end gap-3 px-5 py-4"
                    style={{ borderTop: `1px solid ${colors.neutral200}` }}
                >
                    <Button label="Cancel" variant="tertiaryContained" onClick={onClose} />
                    <Button label={isSubmitting ? "Creating..." : "Create User"} variant="primaryContained" type="submit" disabled={isSubmitting} />
                </div>
            </form>
        </FormShell>
    );
};

export default AddUserPage;
