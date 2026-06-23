import React, { useState } from "react";
import { AUTH_STATE, useColors } from "../../../utils/types";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button/Button";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion } from "framer-motion";

interface TwoFactorVerificationProps {
    pendingToken: string;
    setAuthState: (authState: AUTH_STATE) => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ pendingToken, setAuthState }) => {
    const colors = useColors();
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setRolePermissions } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [totpCode, setTotpCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (totpCode.length < 6) {
            showSnackbar("error", "Please enter the 6-digit code from your authenticator app");
            return;
        }
        try {
            setIsLoading(true);
            const response = await authService.verify2Fa({ pendingToken, totpCode });
            const user = response.data.data;
            setAuthenticatedUser({
                id: user.id, fullName: user.fullName, userName: user.userName,
                email: user.email, phone: user.phone, roleId: user.roleId,
                roleName: user.roleName, status: user.status,
                emailVerified: user.emailVerified, phoneVerified: user.phoneVerified,
                token: user.token, isTwoFactorEnabled: user.isTwoFactorEnabled,
            });
            setDefaultTheme(user.defaultTheme);
            setRolePermissions(user.rolePermissions);
            navigate("dashboard");
            showSnackbar("success", "Login successful!");
        } catch {
            showSnackbar("error", "Invalid code. Please try again.");
            setTotpCode("");
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
                    onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
                    className="flex items-center gap-2 mb-7 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: colors.primary400 }}
                    disabled={isLoading}
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
                        <FiShield />
                    </motion.div>
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                        Two-factor authentication
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Open your authenticator app and enter the 6-digit code
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <motion.input
                        className="text-center text-3xl tracking-[0.6rem] font-black rounded-2xl p-4 w-full max-w-xs focus:outline-none transition-all duration-200"
                        style={{
                            border: `2px solid ${totpCode.length > 0 ? colors.primary500 : "rgba(255,255,255,0.12)"}`,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.9)",
                            boxShadow: totpCode.length > 0 ? `0 0 0 3px ${colors.primary500}25` : "none",
                        }}
                        maxLength={6}
                        value={totpCode}
                        onChange={e => setTotpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="······"
                        disabled={isLoading}
                        autoFocus
                        whileFocus={{ scale: 1.01 } as any}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                </div>

                <p className="text-xs text-center mb-6" style={{ color: "rgba(255,255,255,0.28)" }}>
                    Code refreshes every 30 seconds
                </p>

                <Button
                    label={isLoading ? "Verifying…" : "Verify"}
                    variant="primaryContained"
                    fullWidth
                    disabled={isLoading || totpCode.length < 6}
                    onClick={handleVerify}
                />
            </div>
        </motion.div>
    );
};

export default TwoFactorVerification;
