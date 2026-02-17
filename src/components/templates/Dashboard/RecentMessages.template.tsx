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
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.neutral50}, ${colors.primary50})`,
      }}
    >
      {messages.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center border border-dashed"
          style={{
            padding: isMobile ? 28 : 40,
            background: colors.neutral50,
            borderColor: colors.neutral300,
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-3"
            style={{
              width: 52,
              height: 52,
              background: colors.primary100,
              color: colors.primary600,
            }}
          >
            <FiInbox size={20} />
          </div>
          <div className="text-sm font-medium" style={{ color: colors.neutral600 }}>
            No recent messages
          </div>
          <div className="text-xs mt-1" style={{ color: colors.neutral400 }}>
            Incoming inquiries will appear here
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col divide-y"
          style={{
            maxHeight: isMobile ? 360 : 440,
            overflowY: "auto",
          }}
        >
          {messages.map((msg) => {
            const isUnread = msg.status?.toUpperCase() === "UNREAD";

            return (
              <div
                key={msg.id}
                className="group relative flex items-start transition-colors duration-200"
                style={{
                  padding: isMobile ? "12px 14px" : "14px 18px",
                  background: isUnread ? colors.primary50 : "#ffffff",
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0"
                  style={{
                    width: 4,
                    background: isUnread
                      ? colors.primary500
                      : colors.neutral200,
                  }}
                />
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: isMobile ? 34 : 38,
                    height: isMobile ? 34 : 38,
                    marginRight: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    background: colors.primary100,
                    color: colors.primary700,
                    boxShadow: `0 0 0 2px ${colors.neutral50}`,
                  }}
                >
                  {getInitials(msg.name)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      className="font-semibold truncate"
                      style={{
                        fontSize: isMobile ? 13 : 14,
                        color: colors.neutral800,
                        maxWidth: "70%",
                      }}
                    >
                      {msg.name}
                    </div>

                    <div
                      className="text-xs"
                      style={{ color: colors.neutral400 }}
                    >
                      {formatDate(msg.createdAt)}
                    </div>
                  </div>

                  <div
                    className="text-xs mt-0.5"
                    style={{ color: colors.neutral500 }}
                  >
                    {msg.email}
                  </div>

                  <div
                    className="text-xs mt-0.5"
                    style={{ color: colors.neutral500 }}
                  >
                    {msg.phone}
                  </div>
                </div>
                <div
                  className="ml-3 rounded-full"
                  style={{
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    background: isUnread
                      ? colors.primary500
                      : colors.neutral200,
                    color: isUnread ? "#ffffff" : colors.neutral700,
                  }}
                >
                  {isUnread ? "Unread" : "Read"}
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
