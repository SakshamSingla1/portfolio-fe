import React from "react";
import type { ContactUs } from "../../../services/useContactUsService";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";

interface RecentMessagesProps {
  messages: ContactUs[];
}

const getInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return words.length === 1
    ? words[0][0].toUpperCase()
    : (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const getRelativeTime = (dateString: string): string => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const AVATAR_PALETTES = [
  { bg: "#ede9fe", fg: "#7c3aed" },
  { bg: "#dbeafe", fg: "#1d4ed8" },
  { bg: "#d1fae5", fg: "#065f46" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#e0f2fe", fg: "#075985" },
];

// Dark-mode adapted palettes (slightly more saturated)
const AVATAR_PALETTES_DARK = [
  { bg: "#4c1d95", fg: "#c4b5fd" },
  { bg: "#1e3a5f", fg: "#93c5fd" },
  { bg: "#064e3b", fg: "#6ee7b7" },
  { bg: "#78350f", fg: "#fde68a" },
  { bg: "#831843", fg: "#fbcfe8" },
  { bg: "#0c4a6e", fg: "#7dd3fc" },
];

const getAvatarColor = (name: string, isDark: boolean) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % AVATAR_PALETTES.length;
  return isDark ? AVATAR_PALETTES_DARK[idx] : AVATAR_PALETTES[idx];
};

const RecentMessagesTemplate: React.FC<RecentMessagesProps> = ({ messages }) => {
  const colors = useColors();
  const { isDark } = useTheme();

  if (messages.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-8 rounded-xl text-center"
        style={{ border: `1px dashed ${colors.neutral200}` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-lg"
          style={{ background: colors.primary50, color: colors.primary500 }}
        >
          ✉
        </div>
        <div className="text-sm font-medium" style={{ color: colors.neutral600 }}>No messages yet</div>
        <div className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>New inquiries will appear here</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((msg, i) => {
        const isUnread = msg.status?.toUpperCase() === "UNREAD";
        const { bg, fg } = getAvatarColor(msg.name || "?", isDark);
        const initials = getInitials(msg.name);

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5 relative overflow-hidden"
            style={{
              background: isUnread
                ? (isDark ? `${colors.primary900}` : colors.primary50)
                : colors.neutral50,
              border: `1px solid ${isUnread ? colors.primary200 : colors.neutral200}`,
            }}
          >
            {/* Unread accent bar */}
            {isUnread && (
              <div
                className="absolute left-0 top-0 bottom-0 rounded-l-xl"
                style={{ width: 3, background: colors.primary500 }}
              />
            )}

            {/* Avatar */}
            <div
              className="shrink-0 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ width: 34, height: 34, background: bg, color: fg }}
            >
              {initials}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-xs truncate" style={{ color: colors.neutral800 }}>
                  {msg.name}
                </div>
                <div className="text-[10px] shrink-0" style={{ color: colors.neutral400 }}>
                  {getRelativeTime(msg.createdAt)}
                </div>
              </div>
              <div className="text-[11px] mt-0.5 truncate" style={{ color: colors.neutral500 }}>
                {msg.email}
              </div>
              <div
                className="text-xs mt-1 leading-relaxed"
                style={{
                  color: colors.neutral600,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {msg.message}
              </div>
            </div>

            {/* Unread badge */}
            {isUnread && (
              <div
                className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full self-start mt-0.5"
                style={{ background: colors.primary500, color: "#fff" }}
              >
                New
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecentMessagesTemplate;
