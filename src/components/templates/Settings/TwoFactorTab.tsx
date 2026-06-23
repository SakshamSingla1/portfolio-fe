import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { FiShield, FiShieldOff, FiCheck, FiArrowLeft, FiCopy, FiKey } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useSnackbar } from "../../../hooks/useSnackBar";
import Button from "../../atoms/Button/Button";

type TabView = "idle" | "setup" | "disable";

const TwoFactorTab: React.FC = () => {
    const colors = useColors();
    const authService = useAuthService();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [view, setView] = useState<TabView>("idle");
    const [isLoading, setIsLoading] = useState(false);
    const [totpCode, setTotpCode] = useState("");
    const [qrData, setQrData] = useState<{ secret: string; otpAuthUrl: string } | null>(null);
    const [secretCopied, setSecretCopied] = useState(false);

    const isEnabled = !!user?.isTwoFactorEnabled;

    const handleBeginSetup = async () => {
        try {
            setIsLoading(true);
            const response = await authService.setup2Fa();
            const data = response.data.data;
            setQrData({ secret: data.secret, otpAuthUrl: data.otpAuthUrl });
            setView("setup");
        } catch {
            showSnackbar("error", "Failed to generate 2FA secret. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmEnable = async () => {
        if (totpCode.length < 6) {
            showSnackbar("error", "Please enter the 6-digit code from your authenticator app");
            return;
        }
        try {
            setIsLoading(true);
            await authService.toggle2Fa(totpCode);
            if (user) setAuthenticatedUser({ ...user, isTwoFactorEnabled: true });
            setView("idle");
            setTotpCode("");
            setQrData(null);
            showSnackbar("success", "Two-factor authentication enabled");
        } catch {
            showSnackbar("error", "Invalid code. Please try again.");
            setTotpCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        if (totpCode.length < 6) {
            showSnackbar("error", "Please enter your current 6-digit authenticator code");
            return;
        }
        try {
            setIsLoading(true);
            await authService.toggle2Fa(totpCode);
            if (user) setAuthenticatedUser({ ...user, isTwoFactorEnabled: false });
            setView("idle");
            setTotpCode("");
            showSnackbar("success", "Two-factor authentication disabled");
        } catch {
            showSnackbar("error", "Invalid code. Please try again.");
            setTotpCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const copySecret = () => {
        if (qrData?.secret) {
            navigator.clipboard.writeText(qrData.secret);
            setSecretCopied(true);
            setTimeout(() => setSecretCopied(false), 2000);
        }
    };

    const cancel = () => {
        setView("idle");
        setTotpCode("");
        setQrData(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "24px", width: "100%" }}
        >
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="flex items-center justify-center p-2 rounded-xl"
                        style={{ backgroundColor: colors.primary100, color: colors.primary600 }}
                    >
                        <FiShield size={20} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>
                        Two-Factor Authentication
                    </h3>
                </div>
                <p className="text-sm" style={{ color: colors.neutral500 }}>
                    Add an extra layer of security using an authenticator app (Google Authenticator, Authy, etc.)
                </p>
            </div>

            <AnimatePresence mode="wait">
                {/* IDLE — status + action */}
                {view === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className="flex items-center justify-between rounded-2xl p-4 mb-6"
                            style={{
                                background: isEnabled ? `${colors.primary500}10` : `${colors.neutral200}60`,
                                border: `1.5px solid ${isEnabled ? colors.primary300 : colors.neutral300}`,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex items-center justify-center rounded-xl"
                                    style={{
                                        width: 40, height: 40,
                                        background: isEnabled ? `${colors.primary500}18` : `${colors.neutral300}80`,
                                        color: isEnabled ? colors.primary600 : colors.neutral500,
                                    }}
                                >
                                    {isEnabled ? <FiShield size={20} /> : <FiShieldOff size={20} />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: colors.neutral900 }}>
                                        {isEnabled ? "2FA is enabled" : "2FA is disabled"}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: colors.neutral500 }}>
                                        {isEnabled
                                            ? "Your account is protected with an authenticator app"
                                            : "Your account uses only password authentication"}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="rounded-full px-3 py-1 text-xs font-bold"
                                style={{
                                    background: isEnabled ? `${colors.primary500}18` : `${colors.neutral300}`,
                                    color: isEnabled ? colors.primary600 : colors.neutral500,
                                }}
                            >
                                {isEnabled ? "Active" : "Inactive"}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            {isEnabled ? (
                                <Button
                                    label={isLoading ? "Loading…" : "Disable 2FA"}
                                    variant="primaryOutlined"
                                    disabled={isLoading}
                                    startIcon={<FiShieldOff size={15} />}
                                    onClick={() => setView("disable")}
                                />
                            ) : (
                                <Button
                                    label={isLoading ? "Generating…" : "Enable 2FA"}
                                    variant="primaryContained"
                                    disabled={isLoading}
                                    startIcon={<FiShield size={15} />}
                                    onClick={handleBeginSetup}
                                />
                            )}
                        </div>
                    </motion.div>
                )}

                {/* SETUP — QR code + confirm */}
                {view === "setup" && qrData && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={cancel}
                            className="flex items-center gap-1.5 mb-5 text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: colors.primary500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            disabled={isLoading}
                        >
                            <FiArrowLeft size={14} /> Back
                        </button>

                        <div className="flex flex-col items-center gap-5 mb-6">
                            <div
                                className="rounded-2xl p-4"
                                style={{ background: "#fff", border: `1.5px solid ${colors.neutral200}` }}
                            >
                                <QRCodeSVG value={qrData.otpAuthUrl} size={176} />
                            </div>

                            <div className="text-center max-w-sm">
                                <p className="text-sm font-medium mb-1" style={{ color: colors.neutral700 }}>
                                    Scan with your authenticator app
                                </p>
                                <p className="text-xs" style={{ color: colors.neutral500 }}>
                                    Can't scan? Enter the secret key manually:
                                </p>
                            </div>

                            <div
                                className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-full max-w-sm"
                                style={{ background: colors.neutral100, border: `1px solid ${colors.neutral200}` }}
                            >
                                <span
                                    className="flex-1 text-sm font-mono tracking-wider truncate"
                                    style={{ color: colors.neutral700 }}
                                >
                                    {qrData.secret}
                                </span>
                                <button
                                    onClick={copySecret}
                                    className="flex items-center justify-center hover:opacity-70 transition-opacity"
                                    style={{ color: secretCopied ? colors.primary500 : colors.neutral500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                    title="Copy secret"
                                >
                                    {secretCopied ? <FiCheck size={15} /> : <FiCopy size={15} />}
                                </button>
                            </div>
                        </div>

                        <div
                            className="rounded-xl p-4 mb-6"
                            style={{ background: `${colors.primary500}08`, border: `1px solid ${colors.primary200}` }}
                        >
                            <p className="text-xs font-semibold mb-1" style={{ color: colors.primary600 }}>
                                After scanning, enter the 6-digit code to confirm
                            </p>
                            <p className="text-xs" style={{ color: colors.neutral500 }}>
                                This verifies the app is configured correctly before enabling 2FA.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <input
                                className="text-center text-2xl tracking-[0.5rem] font-black rounded-2xl p-4 w-full max-w-xs focus:outline-none transition-all duration-200"
                                style={{
                                    border: `2px solid ${totpCode.length > 0 ? colors.primary500 : colors.neutral300}`,
                                    backgroundColor: colors.neutral50,
                                    color: colors.neutral900,
                                    boxShadow: totpCode.length > 0 ? `0 0 0 3px ${colors.primary500}20` : "none",
                                }}
                                maxLength={6}
                                value={totpCode}
                                onChange={e => setTotpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="······"
                                disabled={isLoading}
                                autoFocus
                            />
                            <Button
                                label={isLoading ? "Verifying…" : "Confirm & Enable"}
                                variant="primaryContained"
                                disabled={isLoading || totpCode.length < 6}
                                startIcon={<FiKey size={14} />}
                                onClick={handleConfirmEnable}
                            />
                        </div>
                    </motion.div>
                )}

                {/* DISABLE — confirm with current TOTP */}
                {view === "disable" && (
                    <motion.div
                        key="disable"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={cancel}
                            className="flex items-center gap-1.5 mb-5 text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: colors.primary500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            disabled={isLoading}
                        >
                            <FiArrowLeft size={14} /> Back
                        </button>

                        <div
                            className="rounded-2xl p-4 mb-6"
                            style={{
                                background: `${colors.primary500}08`,
                                border: `1.5px solid ${colors.neutral200}`,
                            }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <FiShieldOff size={18} style={{ color: colors.neutral500 }} />
                                <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>
                                    Disable two-factor authentication
                                </p>
                            </div>
                            <p className="text-xs" style={{ color: colors.neutral500 }}>
                                Enter your current 6-digit authenticator code to confirm you have access before disabling 2FA.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <input
                                className="text-center text-2xl tracking-[0.5rem] font-black rounded-2xl p-4 w-full max-w-xs focus:outline-none transition-all duration-200"
                                style={{
                                    border: `2px solid ${totpCode.length > 0 ? colors.primary500 : colors.neutral300}`,
                                    backgroundColor: colors.neutral50,
                                    color: colors.neutral900,
                                    boxShadow: totpCode.length > 0 ? `0 0 0 3px ${colors.primary500}20` : "none",
                                }}
                                maxLength={6}
                                value={totpCode}
                                onChange={e => setTotpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="······"
                                disabled={isLoading}
                                autoFocus
                            />
                            <Button
                                label={isLoading ? "Disabling…" : "Disable 2FA"}
                                variant="primaryOutlined"
                                disabled={isLoading || totpCode.length < 6}
                                startIcon={<FiShieldOff size={14} />}
                                onClick={handleDisable}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TwoFactorTab;
