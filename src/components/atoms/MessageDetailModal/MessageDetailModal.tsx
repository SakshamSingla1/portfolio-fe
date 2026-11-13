import React, { useEffect, useState } from "react";
import { type ContactMessage, type ContactThread, type ContactUs, useContactUsService } from "../../../services/useContactUsService";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import { FiSend } from "react-icons/fi";
import TextField from "../../atoms/TextField/TextField";
import { useColors } from "../../../utils/types";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { useSnackbar } from "../../../hooks/useSnackBar";

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
    const [thread, setThread] = useState<ContactThread | null>(null);
    const [threadLoading, setThreadLoading] = useState(true);

    // The thread view replaces the old single-reply layout: previously, once the owner sent one
    // reply, the reply box disappeared for good (no way to send a second one, and no way to see
    // a visitor's follow-up). Fetching the full thread here shows every message, in order, and
    // always keeps the reply box available.
    useEffect(() => {
        if (!message.id) {
            setThreadLoading(false);
            return;
        }
        let cancelled = false;
        contactService.getThread(message.id).then((res) => {
            if (cancelled) return;
            setThread(res?.data?.data ?? null);
            setThreadLoading(false);
        }).catch(() => {
            if (!cancelled) setThreadLoading(false);
        });
        return () => { cancelled = true; };
    }, [message.id, contactService]);

    const handleSendReply = async () => {
        if (!replyText.trim() || !message.id) return;
        try {
            setSending(true);
            const res = await contactService.reply(message.id, replyText.trim());
            const updated: ContactUs = res?.data?.data ?? { ...message, replyMessage: replyText, status: "REPLIED" };
            setThread((prev) => prev && {
                ...prev,
                messages: [...prev.messages, {
                    id: Date.now(),
                    senderType: "OWNER",
                    message: replyText.trim(),
                    createdAt: new Date().toISOString(),
                }],
            });
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
        <Modal
            open
            onClose={onClose}
            title="Message Details"
            size="md"
            footer={
                <>
                    <Button onClick={onClose} label="Close" variant="tertiaryContained" />
                    <Button
                        label={sending ? "Sending…" : "Send Reply"}
                        variant="primaryContained"
                        startIcon={<FiSend size={14} />}
                        disabled={sending || !replyText.trim()}
                        onClick={handleSendReply}
                    />
                </>
            }
        >
            <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-4 -mt-2 mb-4">
                    <p className="text-sm" style={{ color: colors.neutral500 }}>
                        {DateUtils.formatDateTimeToDateMonthYear(message.createdAt)}
                    </p>
                    {renderStatus(message.status)}
                </div>

                <div className="space-y-6 custom-scroll">
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

                    <div>
                        <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: colors.neutral600 }}>
                            Conversation
                        </p>
                        {threadLoading && (
                            <p className="text-sm" style={{ color: colors.neutral500 }}>Loading…</p>
                        )}
                        {!threadLoading && (
                            <div className="flex flex-col gap-3">
                                {(thread?.messages ?? []).map((m: ContactMessage) => {
                                    const isOwner = m.senderType === "OWNER";
                                    return (
                                        <div key={m.id} className="flex" style={{ justifyContent: isOwner ? "flex-end" : "flex-start" }}>
                                            <div
                                                className="max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                                                style={{
                                                    backgroundColor: isOwner ? `${colors.primary500}12` : colors.neutral50,
                                                    border: `1.5px solid ${isOwner ? `${colors.primary500}30` : colors.neutral300}`,
                                                    color: colors.neutral800,
                                                }}
                                            >
                                                {m.message}
                                                <p className="text-[11px] mt-1" style={{ color: colors.neutral400 }}>
                                                    {isOwner ? "You" : message.name} · {DateUtils.formatDateTimeToDateMonthYear(m.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(MessageDetailModal);
