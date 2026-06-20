import React from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";

interface ListingShellProps {
  title: string;
  description?: string;
  count?: number;
  accentColor?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const ListingShell: React.FC<ListingShellProps> = ({
  title,
  description,
  count,
  accentColor,
  headerRight,
  children,
}) => {
  const colors = useColors();
  const { isDark } = useTheme();

  const cardShadow = isDark
    ? "0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)"
    : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

  const accent = accentColor ?? colors.primary600;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ padding: "16px 16px 24px" }}
    >
      {/* ── Header card ─────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1px solid ${colors.neutral200}`,
          boxShadow: cardShadow,
        }}
      >
        {/* Accent gradient top line */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}28 100%)`,
          }}
        />

        <div className="flex items-center justify-between px-5 py-4">
          {/* Left: title + count + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className="font-black tracking-tight"
                style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em" }}
              >
                {title}
              </h1>
              {count !== undefined && count > 0 && (
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full tabular-nums"
                  style={{
                    background: isDark ? colors.neutral100 : colors.neutral100,
                    color: colors.neutral500,
                    border: `1px solid ${colors.neutral200}`,
                  }}
                >
                  {count}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>
                {description}
              </p>
            )}
          </div>

          {/* Right: optional CTA slot */}
          {headerRight && (
            <div className="shrink-0 ml-4">{headerRight}</div>
          )}
        </div>

        {/* Subtle bottom meta row */}
        {count !== undefined && (
          <div
            className="px-5 pb-3"
            style={{ borderTop: `1px solid ${colors.neutral100}`, paddingTop: 8 }}
          >
            <span
              className="font-black uppercase tracking-widest"
              style={{ fontSize: "9px", color: colors.neutral300, letterSpacing: "0.12em" }}
            >
              {count === 0 ? "No records" : `${count} ${count === 1 ? "record" : "records"}`}
            </span>
          </div>
        )}
      </div>

      {/* ── Table/list content card ──────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: colors.neutral0,
          border: `1px solid ${colors.neutral200}`,
          boxShadow: cardShadow,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ListingShell;
