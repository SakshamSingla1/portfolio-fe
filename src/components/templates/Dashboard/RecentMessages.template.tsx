import React from "react";
import type { ContactUs } from "../../../services/useContactUsService";
import { FiInbox } from "react-icons/fi";
import { useColors } from "../../../utils/types";

interface RecentMessagesProps {
    messages: ContactUs[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getInitials = (name: string) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const RecentMessagesTemplate: React.FC<RecentMessagesProps> = ({
    messages,
}) => {
    const colors = useColors();

    return (
        <div className="rounded-2xl" style={{ background: `linear-gradient(145deg, ${colors.neutral50}, ${colors.primary50})`, }}>
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 rounded-xl" style={{ background: colors.neutral50, border: `1px dashed ${colors.neutral300}` }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: colors.primary100, color: colors.primary600 }}>
                        <FiInbox size={28} />
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.neutral600 }}>
                        No recent messages yet
                    </div>
                    <div className="text-xs mt-1" style={{ color: colors.neutral400 }}>
                        New inquiries will appear here
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
                    {messages.map((msg) => {
                        const isUnread = msg.status?.toUpperCase() === "UNREAD";
                        return (
                            <div key={msg.id} className="relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ background: isUnread ? colors.primary50 : "#ffffff", border: `1px solid ${isUnread ? colors.primary300 : colors.neutral200}` }}>
                                {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: colors.primary500 }} />}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: colors.primary100, color: colors.primary700 }}>
                                        {getInitials(msg.name)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="text-sm font-semibold" style={{ color: colors.neutral800 }}>
                                                {msg.name}
                                            </div>
                                            <div className="text-xs mt-1 sm:mt-0" style={{ color: colors.neutral400 }}>
                                                {formatDate(msg.createdAt)}
                                            </div>
                                        </div>
                                        <div className="text-xs mt-1" style={{ color: colors.neutral500 }}>
                                            {msg.email} • {msg.phone}
                                        </div>
                                        <div className="text-sm mt-2 leading-relaxed" style={{ color: colors.neutral700 }}>
                                            {msg.message.length > 120 ? msg.message.slice(0, 120) + "..." : msg.message}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="px-3 py-1 text-xs font-semibold rounded-full" style={{ background: isUnread ? colors.primary500 : colors.neutral200, color: isUnread ? "#ffffff" : colors.neutral700 }}>
                                        {isUnread ? "Unread" : "Read"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentMessagesTemplate;
