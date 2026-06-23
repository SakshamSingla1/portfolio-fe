import React, { useEffect, useState } from "react";
import { type ContactUs, useContactUsService } from "../../../services/useContactUsService";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import { FiX, FiSend, FiCheckCircle } from "react-icons/fi";
import TextField from "../../atoms/TextField/TextField";
import { useColors } from "../../../utils/types";
import Button from "../Button/Button";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { motion, AnimatePresence } from "framer-motion";

interface MessageDetailModalProps {
    message: ContactUs;
    onClose: () => void;
    onReplied?: (updated: ContactUs) => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
    message,
    onClose,
    onReplied,
}) => {
    const colors = useColors();
    const contactService = useContactUsService();
    const { showSnackbar } = useSnackbar();

    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [replied, setReplied] = useState(!!message.replyMessage);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleSendReply = async () => {
        if (!replyText.trim() || !message.id) return;
        try {
            setSending(true);
            const res = await contactService.reply(message.id, replyText.trim());
            const updated: ContactUs = res?.data?.data ?? { ...message, replyMessage: replyText, status: "REPLIED" };
            setReplied(true);
            setReplyText("");
            showSnackbar("success", "Reply sent successfully");
            onReplied?.(updated);
        } catch {
            showSnackbar("error", "Failed to send reply. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const renderStatus = (status: string) => {
        const colors_map: Record<string, { bg: string; text: string }> = {
            UNREAD: { bg: colors.error50, text: colors.error600 },
            READ: { bg: colors.success50, text: colors.success600 },
            REPLIED: { bg: `${colors.primary500}15`, text: colors.primary600 },
        };
        const style = colors_map[status] ?? { bg: colors.neutral100, text: colors.neutral600 };
        return (
            <span
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
                style={{ backgroundColor: style.bg, color: style.text, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
            >
                {enumToNormalKey(status)}
            </span>
        );
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-md px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
                style={{ backgroundColor: colors.neutral50, maxHeight: "92vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-start justify-between px-8 py-6 border-b"
                    style={{ borderColor: colors.neutral300, backgroundColor: colors.neutral50 }}
                >
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: colors.neutral900 }}>
                            Message Details
                        </h2>
                        <div className="flex items-center gap-4 mt-3">
                            <p className="text-sm" style={{ color: colors.neutral500 }}>
                                {DateUtils.formatDateTimeToDateMonthYear(message.createdAt)}
                            </p>
                            {renderStatus(message.status)}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                        style={{ color: colors.neutral600, backgroundColor: colors.neutral100 }}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 py-8 overflow-y-auto flex-1 space-y-6 custom-scroll">
                    {/* Sender info */}
                    <div
                        className="rounded-2xl p-6"
                        style={{ backgroundColor: colors.neutral50, border: `1.5px solid ${colors.neutral300}` }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField label="Name" value={message.name} InputProps={{ readOnly: true }} />
                            <TextField label="Email" value={message.email} InputProps={{ readOnly: true }} />
                        </div>
                        {message.phone && (
                            <div className="mt-6">
                                <TextField label="Phone" value={message.phone} InputProps={{ readOnly: true }} />
                            </div>
                        )}
                    </div>

                    {/* Original message */}
                    <div>
                        <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: colors.neutral600 }}>
                            Message
                        </p>
                        <div
                            className="rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap"
                            style={{
                                backgroundColor: colors.neutral50,
                                border: `1.5px solid ${colors.neutral300}`,
                                color: colors.neutral800,
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
                            }}
                        >
                            {message.message}
                        </div>
                    </div>

                    {/* Previous reply (if any) */}
                    <AnimatePresence>
                        {(replied || message.replyMessage) && (
                            <motion.div
                                key="previous-reply"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <FiCheckCircle size={14} style={{ color: colors.success600 }} />
                                    <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: colors.success600 }}>
                                        Reply Sent
                                    </p>
                                    {message.repliedAt && (
                                        <span className="text-xs" style={{ color: colors.neutral400 }}>
                                            · {DateUtils.formatDateTimeToDateMonthYear(message.repliedAt)}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
                                    style={{
                                        backgroundColor: `${colors.success600}08`,
                                        border: `1.5px solid ${colors.success600}20`,
                                        color: colors.neutral800,
                                    }}
                                >
                                    {message.replyMessage}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reply composer */}
                    {!replied && !message.replyMessage && (
                        <div>
                            <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: colors.neutral600 }}>
                                Send Reply
                            </p>
                            <TextField
                                label={`Reply to ${message.name}`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                disabled={sending}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex justify-end gap-3 px-8 py-5 border-t"
                    style={{ borderColor: colors.neutral300, backgroundColor: colors.neutral50 }}
                >
                    <Button onClick={onClose} label="Close" variant="tertiaryContained" />
                    {!replied && !message.replyMessage && (
                        <Button
                            label={sending ? "Sending…" : "Send Reply"}
                            variant="primaryContained"
                            startIcon={<FiSend size={14} />}
                            disabled={sending || !replyText.trim()}
                            onClick={handleSendReply}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(MessageDetailModal);
