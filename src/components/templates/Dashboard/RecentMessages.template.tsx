import React from "react";
import type { ContactUs } from "../../../services/useContactUsService";
import { FiInbox } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";

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
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const RecentMessagesTemplate: React.FC<RecentMessagesProps> = ({
  messages,
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${colors.neutral50}, ${colors.primary50})`,
      }}
    >
      {messages.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{
            padding: isMobile ? 32 : 48,
            background: colors.neutral50,
            border: `1px dashed ${colors.neutral300}`,
            borderRadius: 16,
          }}
        >
          <div
            className="rounded-full flex items-center justify-center mb-4"
            style={{
              width: 60,
              height: 60,
              background: colors.primary100,
              color: colors.primary600,
            }}
          >
            <FiInbox size={24} />
          </div>

          <div
            className="text-sm font-semibold"
            style={{ color: colors.neutral600 }}
          >
            No recent messages yet
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: colors.neutral400 }}
          >
            New inquiries will appear here
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col gap-4"
          style={{
            maxHeight: isMobile ? 380 : 440,
            overflowY: "auto",
            padding: isMobile ? 12 : 16,
          }}
        >
          {messages.map((msg) => {
            const isUnread = msg.status?.toUpperCase() === "UNREAD";

            return (
              <div
                key={msg.id}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{
                  padding: isMobile ? "14px" : "18px",
                  background: isUnread ? colors.primary50 : "#ffffff",
                  border: `1px solid ${
                    isUnread ? colors.primary300 : colors.neutral200
                  }`,
                  borderRadius: 16,
                }}
              >
                {isUnread && (
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-l-xl"
                    style={{
                      width: 4,
                      background: colors.primary500,
                    }}
                  />
                )}

                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 font-semibold"
                    style={{
                      width: isMobile ? 38 : 44,
                      height: isMobile ? 38 : 44,
                      fontSize: 13,
                      background: colors.primary100,
                      color: colors.primary700,
                    }}
                  >
                    {getInitials(msg.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ color: colors.neutral800 }}
                      >
                        {msg.name}
                      </div>

                      <div
                        className="text-xs mt-1 sm:mt-0"
                        style={{ color: colors.neutral400 }}
                      >
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>

                    <div
                      className="text-xs mt-1"
                      style={{ color: colors.neutral500 }}
                    >
                      {msg.email} • {msg.phone}
                    </div>

                    <div
                      className="text-sm mt-2 leading-relaxed"
                      style={{ color: colors.neutral700 }}
                    >
                      {msg.message.length > 120
                        ? msg.message.slice(0, 120) + "..."
                        : msg.message}
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    className="rounded-full text-xs font-semibold"
                    style={{
                      padding: "4px 12px",
                      background: isUnread
                        ? colors.primary500
                        : colors.neutral200,
                      color: isUnread ? "#ffffff" : colors.neutral700,
                    }}
                  >
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