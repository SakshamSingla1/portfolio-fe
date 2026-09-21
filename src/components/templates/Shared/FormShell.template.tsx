import React from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface FormShellProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  breadcrumb?: string;
  onBack?: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}

const FormShell: React.FC<FormShellProps> = ({
  title,
  subtitle,
  accentColor,
  breadcrumb,
  onBack,
  onSubmit,
  children,
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

  const accent = accentColor ?? colors.primary600;

  // Lets Enter submit the form from any field, without a native <form> (no
  // button here is type="submit"). Defers to any inner handler that already
  // consumed Enter itself (radio pills, MUI Autocomplete option selection)
  // by checking defaultPrevented, since those fire first during bubbling.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSubmit) return;
    if (e.key !== "Enter" || e.shiftKey || e.defaultPrevented) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ padding: isMobile ? "8px 4px 16px" : "16px 16px 24px" }}
    >
      {/* ── Page header card ────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
        }}
      >
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}28 100%)`,
          }}
        />

        <div className={isMobile ? "px-3 py-3" : "px-5 py-4"}>
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
            style={{ fontSize: isMobile ? 18 : 20, color: colors.neutral900, letterSpacing: "-0.025em" }}
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
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
        }}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default FormShell;
