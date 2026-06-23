import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { FiShield, FiShieldOff, FiCheck, FiArrowLeft, FiCopy, FiKey, FiLock } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useSnackbar } from "../../../hooks/useSnackBar";
import Button from "../../atoms/Button/Button";

type TabView = "idle" | "setup" | "disable";

const slide = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.22, ease: "easeOut" as const },
};

const TwoFactorTab: React.FC = () => {
    const colors = useColors();
    const authService = useAuthService();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [view, setView] = useState<TabView>("idle");
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [qrData, setQrData] = useState<{ secret: string; otpAuthUrl: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>(
        Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
    );

    const totpCode = otp.join("");
    const isEnabled = !!user?.isTwoFactorEnabled;

    const reset = () => {
        setView("idle");
        setOtp(Array(6).fill(""));
        setQrData(null);
    };

    const clearOtp = () => {
        setOtp(Array(6).fill(""));
        inputRefs.current[0].current?.focus();
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value === "" || /^\d$/.test(value)) {
            const next = [...otp];
            next[index] = value;
            setOtp(next);
            if (value && index < 5) inputRefs.current[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, onEnter: () => void) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].current?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1].current?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1].current?.focus();
        } else if (e.key === "Enter" && totpCode.length === 6) {
            onEnter();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").trim();
        if (/^\d+$/.test(paste)) {
            const digits = paste.slice(0, 6).split("");
            const next = Array(6).fill("");
            digits.forEach((d, i) => { next[i] = d; });
            setOtp(next);
            inputRefs.current[Math.min(digits.length - 1, 5)].current?.focus();
        }
    };

    const handleBeginSetup = async () => {
        try {
            setIsLoading(true);
            const { data } = await authService.setup2Fa();
            setQrData({ secret: data.data.secret, otpAuthUrl: data.data.otpAuthUrl });
            setView("setup");
        } catch {
            showSnackbar("error", "Failed to generate 2FA secret. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmEnable = async () => {
        try {
            setIsLoading(true);
            await authService.toggle2Fa(totpCode);
            if (user) setAuthenticatedUser({ ...user, isTwoFactorEnabled: true });
            reset();
            showSnackbar("success", "Two-factor authentication enabled");
        } catch {
            showSnackbar("error", "Invalid code. Please try again.");
            clearOtp();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        try {
            setIsLoading(true);
            await authService.toggle2Fa(totpCode);
            if (user) setAuthenticatedUser({ ...user, isTwoFactorEnabled: false });
            reset();
            showSnackbar("success", "Two-factor authentication disabled");
        } catch {
            showSnackbar("error", "Invalid code. Please try again.");
            clearOtp();
        } finally {
            setIsLoading(false);
        }
    };

    const copySecret = () => {
        if (!qrData) return;
        navigator.clipboard.writeText(qrData.secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const otpBoxes = (onSubmit: () => void) => (
        <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex gap-2.5 justify-center">
                {otp.map((digit, i) => (
                    <motion.input
                        key={i}
                        ref={inputRefs.current[i]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={isLoading}
                        autoFocus={i === 0}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e, onSubmit)}
                        onPaste={handlePaste}
                        className="text-center font-bold rounded-xl focus:outline-none transition-all duration-200"
                        style={{
                            width: 44,
                            height: 52,
                            fontSize: "1.375rem",
                            border: `1.5px solid ${digit ? colors.primary500 : colors.neutral200}`,
                            background: digit ? `${colors.primary500}08` : colors.neutral50,
                            color: colors.neutral900,
                            boxShadow: digit ? `0 0 0 3px ${colors.primary500}18` : "none",
                        }}
                        whileTap={{ scale: 0.93 } as any}
                    />
                ))}
            </div>
            <p className="text-xs" style={{ color: colors.neutral400 }}>
                Code refreshes every 30 seconds
            </p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "24px", width: "100%" }}
        >
            <div className="flex items-center gap-2 mb-1">
                <div
                    className="flex items-center justify-center p-2 rounded-xl"
                    style={{ background: colors.primary100, color: colors.primary600 }}
                >
                    <FiShield size={20} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>
                    Two-Factor Authentication
                </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: colors.neutral500 }}>
                Protect your account with a TOTP authenticator app.
            </p>

            <AnimatePresence mode="wait">
                {view === "idle" && (
                    <motion.div key="idle" {...slide}>
                        <div
                            className="flex items-center gap-3 rounded-2xl p-4 mb-7"
                            style={{
                                background: isEnabled ? `${colors.primary500}0d` : colors.neutral100,
                                border: `1.5px solid ${isEnabled ? colors.primary300 : colors.neutral200}`,
                            }}
                        >
                            <div
                                className="flex items-center justify-center rounded-xl shrink-0"
                                style={{
                                    width: 38, height: 38,
                                    background: isEnabled ? `${colors.primary500}18` : colors.neutral200,
                                    color: isEnabled ? colors.primary600 : colors.neutral500,
                                }}
                            >
                                {isEnabled ? <FiShield size={18} /> : <FiShieldOff size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold" style={{ color: colors.neutral900 }}>
                                    {isEnabled ? "2FA is active" : "2FA is not enabled"}
                                </p>
                                <p className="text-xs mt-0.5 truncate" style={{ color: colors.neutral500 }}>
                                    {isEnabled
                                        ? "Your account is secured with an authenticator app"
                                        : "Enable 2FA for an extra layer of protection"}
                                </p>
                            </div>
                            <span
                                className="rounded-full px-2.5 py-1 text-xs font-bold shrink-0"
                                style={{
                                    background: isEnabled ? `${colors.primary500}18` : colors.neutral200,
                                    color: isEnabled ? colors.primary600 : colors.neutral500,
                                }}
                            >
                                {isEnabled ? "On" : "Off"}
                            </span>
                        </div>
                        <div className="flex justify-center">
                            {isEnabled ? (
                                <Button
                                    label="Disable 2FA"
                                    variant="secondaryContained"
                                    startIcon={<FiShieldOff size={14} />}
                                    onClick={() => setView("disable")}
                                />
                            ) : (
                                <Button
                                    label={isLoading ? "Generating…" : "Enable 2FA"}
                                    variant="primaryContained"
                                    disabled={isLoading}
                                    startIcon={<FiShield size={14} />}
                                    onClick={handleBeginSetup}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
                {view === "setup" && qrData && (
                    <motion.div key="setup" {...slide}>
                        <button
                            onClick={reset}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 mb-6 text-sm font-medium hover:opacity-60 transition-opacity"
                            style={{ color: colors.primary500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                            <FiArrowLeft size={13} /> Back
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <div
                                className="rounded-2xl p-4 mb-4"
                                style={{ background: "#fff", border: `1.5px solid ${colors.neutral200}`, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                            >
                                <QRCodeSVG value={qrData.otpAuthUrl} size={180} />
                            </div>
                            <p className="text-sm font-medium mb-1 text-center" style={{ color: colors.neutral700 }}>
                                Scan with Google Authenticator or Authy
                            </p>
                            <p className="text-xs text-center mb-4" style={{ color: colors.neutral400 }}>
                                Can't scan? Add the key manually:
                            </p>
                            <div
                                className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 w-full max-w-sm"
                                style={{ background: colors.neutral100, border: `1px solid ${colors.neutral200}` }}
                            >
                                <FiKey size={13} style={{ color: colors.neutral400, flexShrink: 0 }} />
                                <span className="flex-1 text-xs font-mono tracking-widest truncate select-all" style={{ color: colors.neutral700 }}>
                                    {qrData.secret}
                                </span>
                                <button
                                    onClick={copySecret}
                                    title={copied ? "Copied!" : "Copy key"}
                                    style={{ color: copied ? colors.primary500 : colors.neutral400, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                                >
                                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                </button>
                            </div>
                        </div>
                        <div
                            className="rounded-xl px-4 py-3 mb-5"
                            style={{ background: `${colors.primary500}08`, border: `1px solid ${colors.primary200}` }}
                        >
                            <p className="text-xs font-semibold" style={{ color: colors.primary600 }}>
                                Step 2 — Enter the 6-digit code from your app to confirm setup
                            </p>
                        </div>
                        {otpBoxes(handleConfirmEnable)}
                        <div className="flex justify-center mt-5">
                            <Button
                                label={isLoading ? "Verifying…" : "Confirm & Enable"}
                                variant="primaryContained"
                                disabled={isLoading || totpCode.length < 6}
                                startIcon={<FiShield size={14} />}
                                onClick={handleConfirmEnable}
                            />
                        </div>
                    </motion.div>
                )}
                {view === "disable" && (
                    <motion.div key="disable" {...slide}>
                        <button
                            onClick={reset}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 mb-6 text-sm font-medium hover:opacity-60 transition-opacity"
                            style={{ color: colors.primary500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                            <FiArrowLeft size={13} /> Back
                        </button>

                        <div
                            className="flex items-start gap-3 rounded-2xl p-4 mb-6"
                            style={{ background: colors.neutral100, border: `1.5px solid ${colors.neutral200}` }}
                        >
                            <FiLock size={16} style={{ color: colors.neutral500, marginTop: 2, flexShrink: 0 }} />
                            <div>
                                <p className="text-sm font-semibold mb-0.5" style={{ color: colors.neutral800 }}>
                                    Confirm with your authenticator app
                                </p>
                                <p className="text-xs leading-relaxed" style={{ color: colors.neutral500 }}>
                                    Enter the current 6-digit code to verify access before disabling 2FA.
                                </p>
                            </div>
                        </div>
                        {otpBoxes(handleDisable)}
                        <div className="flex justify-center mt-5">
                            <Button
                                label={isLoading ? "Disabling…" : "Disable 2FA"}
                                variant="secondaryContained"
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
