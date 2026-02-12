import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    useAuthService,
    type RequestEmailChangeDTO,
    type VerifyEmailChangeDTO,
} from "../../../services/useAuthService";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";
import TextField from "../../../components/atoms/TextField/TextField";
import Button from "../../../components/atoms/Button/Button";
import { InputAdornment } from "@mui/material";
import OtpPopup from "../../../components/molecules/OtpPopup/OtpPopup";
import { FiMail,FiArrowRight } from "react-icons/fi";

const validationSchema = Yup.object({
    newEmail: Yup.string()
        .email("Invalid email format")
        .required("New email is required"),
});

const ChangeEmailTab: React.FC = () => {
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const colors = useColors();

    const [otpOpen, setOtpOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik<RequestEmailChangeDTO>({
        initialValues: {
            newEmail: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await authService.changeEmailRequest(values);
                if (response.status === HTTP_STATUS.OK) {
                    showSnackbar("success", "OTP sent successfully");
                    setOtpOpen(true);
                }
            } catch (error: any) {
                showSnackbar("error", error?.response?.data?.message || "Failed to send OTP");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleVerifyOtp = async (otp: string) => {
        try {
            const payload: VerifyEmailChangeDTO = {
                newEmail: formik.values.newEmail,
                otp,
            };
            const response = await authService.changeEmailVerify(payload);
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar("success", "Email updated successfully");
                setOtpOpen(false);
            }
        } catch (error: any) {
            showSnackbar("error", error?.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            await authService.changeEmailRequest({
                newEmail: formik.values.newEmail,
            });
            showSnackbar("success", "OTP resent successfully");
        } catch (error: any) {
            showSnackbar("error", "Failed to resend OTP");
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ padding: "24px", width: "100%" }}
            >
                <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="flex items-center justify-center p-2 rounded-xl"
                        style={{
                            backgroundColor: colors.primary100,
                            color: colors.primary600,
                        }}
                    >
                        <FiMail size={20} />
                    </div>
                    <h3 style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: colors.neutral900,
                        marginBottom: "6px",
                    }}
                    >
                        Change Email
                    </h3>

                    <p
                        style={{
                            fontSize: "14px",
                            color: colors.neutral500,
                        }}
                    >
                        Enter your new email to receive a verification OTP.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <TextField
                        label="New Email"
                        name="newEmail"
                        type="email"
                        value={formik.values.newEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.newEmail &&
                            Boolean(formik.errors.newEmail)
                        }
                        helperText={
                            formik.touched.newEmail && formik.errors.newEmail
                                ? String(formik.errors.newEmail)
                                : ""
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail
                                        size={18}
                                        style={{ color: colors.neutral400 }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="flex items-center justify-center mt-4">
                        <Button
                            label={loading ? "Sending OTP..." : "Send OTP"}
                            variant="primaryContained"
                            disabled={loading}
                            endIcon={<FiArrowRight size={16} />}
                            onClick={() => formik.handleSubmit()}
                        />
                    </div>
                </div>
            </motion.div>

            <OtpPopup
                open={otpOpen}
                onClose={() => setOtpOpen(false)}
                onVerify={handleVerifyOtp}
                email={formik.values.newEmail}
                resendOtp={handleResendOtp}
            />
        </>
    );
};

export default ChangeEmailTab;
