import React, { useEffect, useState } from "react";
import { AUTH_STATE, HTTP_STATUS, useColors } from "../../../utils/types";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button/Button";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface OTPVerificationTemplateProps {
    phone?: string;
    email?: string;
    setAuthState: (authState: AUTH_STATE) => void;
    isRegisterFlow?: boolean;
    setIsRegisterFlow: (val: boolean) => void;
}

const OTPVerificationTemplate: React.FC<OTPVerificationTemplateProps> = ({
    phone, email, setAuthState, isRegisterFlow = false, setIsRegisterFlow,
}) => {
    const colors = useColors();
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setRolePermissions } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return;
        const id = setTimeout(() => setTimer(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length < 6) { showSnackbar("error", "Please enter a valid 6-digit OTP"); return; }
        try {
            setIsLoading(true);
            if (isRegisterFlow) {
                const response = await authService.verifyOtp({ email: email || "", otp });
                if (response.status === HTTP_STATUS.OK) {
                    setIsRegisterFlow(false);
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    showSnackbar("success", "Account verified successfully!");
                }
            } else {
                const response = await authService.login({ phone: phone || "", otp });
                if (response.status === HTTP_STATUS.OK) {
                    const user = response.data.data;
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
                }
            }
        } catch {
            showSnackbar("error", "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setIsLoading(true);
            if (isRegisterFlow) await authService.resendOtp({ email: email || "" });
            else await authService.sendOtp({ phone: phone || "" });
            setTimer(30);
        } catch {
            showSnackbar("error", "Failed to resend OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="px-8 py-10">
                <button
                    onClick={() => setAuthState(isRegisterFlow ? AUTH_STATE.REGISTER : AUTH_STATE.LOGIN_WITH_PHONE)}
                    className="flex items-center gap-2 mb-7 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: colors.primary400 }}
                    disabled={isLoading}
                >
                    <FiArrowLeft /> Back
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
                        <FiShield />
                    </motion.div>
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                        {isRegisterFlow ? "Verify your account" : "Enter OTP"}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Code sent to{" "}
                        <span className="font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {phone || email}
                        </span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center mb-6">
                    <motion.input
                        className="text-center text-3xl tracking-[0.6rem] font-black rounded-2xl p-4 w-full max-w-xs focus:outline-none transition-all duration-200"
                        style={{
                            border: `2px solid ${otp.length > 0 ? colors.primary500 : "rgba(255,255,255,0.12)"}`,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.9)",
                            boxShadow: otp.length > 0 ? `0 0 0 3px ${colors.primary500}25` : "none",
                        }}
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="······"
                        disabled={isLoading}
                        autoFocus
                        whileFocus={{ scale: 1.01 } as any}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                </div>

                <div className="flex justify-between items-center text-sm mb-6 px-1">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                        {timer > 0 ? `Resend in ${timer}s` : "Didn't receive it?"}
                    </span>
                    {timer === 0 && (
                        <button
                            className="font-semibold hover:underline disabled:opacity-40"
                            style={{ color: colors.primary400 }}
                            onClick={handleResend} disabled={isLoading}
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <Button
                    label={isLoading ? "Verifying…" : "Verify OTP"}
                    variant="primaryContained" fullWidth
                    disabled={isLoading || otp.length < 6}
                    onClick={handleVerify}
                />
            </div>
        </motion.div>
    );
};

export default OTPVerificationTemplate;
