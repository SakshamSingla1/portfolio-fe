import React, { useEffect, useState } from "react";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
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
    phone,
    email,
    setAuthState,
    isRegisterFlow = false,
    setIsRegisterFlow,
}) => {
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setRolePermissions } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const handleVerify = async () => {
        if (otp.length < 6) {
            showSnackbar('error', 'Please enter a valid 6-digit OTP');
            return;
        }
        try {
            setIsLoading(true);
            let response;
            if (isRegisterFlow) {
                response = await authService.verifyOtp({
                    email: email || "",
                    otp,
                });
                if (response.status === HTTP_STATUS.OK) {
                    setIsRegisterFlow(false);
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    showSnackbar('success', 'Account verified successfully!');
                    return;
                }
            } else {
                response = await authService.login({
                    phone: phone || "",
                    otp,
                });
                if (response.status === HTTP_STATUS.OK) {
                    const user = response.data.data;
                    setAuthenticatedUser({
                    id: user.id,
                    fullName: user.fullName,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phone,
                    roleId: user.roleId,
                    roleName: user.roleName,
                    status: user.status,
                    emailVerified: user.emailVerified,
                    phoneVerified: user.phoneVerified,
                    token: user.token
                });

                setDefaultTheme(user.defaultTheme);
                setRolePermissions(user.rolePermissions);

                navigate(`/dashboard`);
                showSnackbar('success', 'Login successful!');
                }
            }
        } catch (error) {
            console.error("OTP Verification Failed:", error);
            showSnackbar('error', 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsLoading(true);
            if (isRegisterFlow) {
                await authService.resendOtp({ email: email || "" });
            } else {
                await authService.sendOtp({ phone: phone || "" });
            }
            setTimer(30);
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            showSnackbar('error', 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timer === 0) return;
        const id = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    return (
        <motion.div 
            className="w-full p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <button
                onClick={() =>
                    setAuthState(isRegisterFlow ? AUTH_STATE.REGISTER : AUTH_STATE.LOGIN_WITH_PHONE)
                }
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 font-medium transition-colors"
                disabled={isLoading}
            >
                <FiArrowLeft className="text-xl" />
                Back
            </button>
            <div className="text-center mb-6 flex flex-col items-center">
                <motion.div 
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-3xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    <FiShield />
                </motion.div>
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                    {isRegisterFlow ? "Verify Your Account" : "Verify OTP"}
                </h2>
                <p className="text-gray-600 mt-1">
                    OTP sent to <span className="font-semibold">{phone || email}</span>
                </p>
            </div>
            <div className="flex justify-center mb-6">
                <input
                    className="
                        text-center text-3xl tracking-[0.5rem] font-bold
                        border border-slate-200 rounded-xl p-4 w-64 bg-slate-50/50
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        transition-all duration-200 shadow-sm
                    "
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                    disabled={isLoading}
                />
            </div>
            <div className="flex justify-between text-sm px-1 mb-3">
                {timer > 0 ? (
                    <p className="text-gray-500">Resend OTP in {timer}s</p>
                ) : (
                    <button
                        className="text-green-600 hover:underline disabled:opacity-50"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                    >
                        Resend OTP
                    </button>
                )}
            </div>
            <div className="flex justify-center items-center">
                <Button
                    label="Verify OTP"
                    variant="primaryContained"
                    disabled={isLoading || otp.length < 6}
                    onClick={handleVerify}
                    className="w-1/2"
                />
            </div>
        </motion.div>
    );
};

export default OTPVerificationTemplate;
