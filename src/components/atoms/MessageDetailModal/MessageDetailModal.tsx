import React, { useEffect } from "react";
import { type ContactUs } from "../../../services/useContactUsService";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import { FiX } from "react-icons/fi";
import TextField from "../../atoms/TextField/TextField";
import { useColors } from "../../../utils/types";
import Button from "../Button/Button";

interface MessageDetailModalProps {
    message: ContactUs;
    onClose: () => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
    message,
    onClose
}) => {
    const colors = useColors();

    const renderStatus = (status: string) => {
        const isUnread = status === "UNREAD";

        return (
            <span
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                    backgroundColor: isUnread ? colors.error50 : colors.success50,
                    color: isUnread ? colors.error600 : colors.success600,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
            >
                {enumToNormalKey(status)}
            </span>
        );
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-md px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.neutral50,
                    maxHeight: "92vh"
                }}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div
                    className="flex items-start justify-between px-8 py-6 border-b"
                    style={{
                        borderColor: colors.neutral200,
                        backgroundColor: colors.neutral50,
                    }}
                >
                    <div>
                        <h2
                            className="text-2xl font-semibold tracking-tight"
                            style={{ color: colors.neutral900 }}
                        >
                            Message Details
                        </h2>

                        <div className="flex items-center gap-4 mt-3">
                            <p
                                className="text-sm"
                                style={{ color: colors.neutral500 }}
                            >
                                {DateUtils.formatDateTimeToDateMonthYear(
                                    message.createdAt
                                )}
                            </p>

                            {renderStatus(message.status)}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
                        style={{
                            color: colors.neutral600,
                            backgroundColor: colors.neutral100
                        }}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-8 py-8 overflow-y-auto flex-1 space-y-8 custom-scroll">

                    {/* Info Card */}
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            backgroundColor: colors.neutral50,
                            border: `1px solid ${colors.neutral200}`
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Name"
                                value={message.name}
                                InputProps={{ readOnly: true }}
                            />

                            <TextField
                                label="Email"
                                value={message.email}
                                InputProps={{ readOnly: true }}
                            />
                        </div>

                        {message.phone && (
                            <div className="mt-6">
                                <TextField
                                    label="Phone"
                                    value={message.phone}
                                    InputProps={{ readOnly: true }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Message Section */}
                    <div>
                        <p
                            className="text-sm font-semibold mb-3 tracking-wide uppercase"
                            style={{ color: colors.neutral600 }}
                        >
                            Message
                        </p>

                        <div
                            className="rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-y-auto custom-scroll"
                            style={{
                                backgroundColor: colors.neutral50,
                                border: `1px solid ${colors.neutral200}`,
                                color: colors.neutral800,
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)"
                            }}
                        >
                            {message.message}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex justify-end px-8 py-5 border-t"
                    style={{
                        borderColor: colors.neutral200,
                        backgroundColor: colors.neutral50
                    }}
                >
                    <Button
                        onClick={onClose}
                        label="Close"
                        variant="primaryContained"
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageDetailModal;
