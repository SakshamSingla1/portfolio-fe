import React from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";

interface FormShellProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  breadcrumb?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

const FormShell: React.FC<FormShellProps> = ({
  title,
  subtitle,
  accentColor,
  breadcrumb,
  onBack,
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
      {/* ── Page header card ────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1px solid ${colors.neutral200}`,
          boxShadow: cardShadow,
        }}
      >
        {/* Accent top line */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}28 100%)`,
          }}
        />

        <div className="px-5 py-4">
          {/* Breadcrumb / back navigation */}
          {(breadcrumb || onBack) && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 mb-3 hover:opacity-60 transition-opacity duration-150"
              style={{
                background: "none",
                border: "none",
                cursor: onBack ? "pointer" : "default",
                padding: 0,
              }}
            >
              {onBack && <FiArrowLeft size={12} color={colors.neutral400} />}
              <span
                className="font-black uppercase"
                style={{ fontSize: "9px", color: colors.neutral400, letterSpacing: "0.12em" }}
              >
                {breadcrumb}
              </span>
            </button>
          )}

          <h1
            className="font-black tracking-tight"
            style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Form content card ───────────────────────── */}
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

export default FormShell;
