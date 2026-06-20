import React from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IProfileCompletion } from "../../../services/useDashboardService";
import { useCountUp } from "../../../hooks/useCountUp";
import { FiCheck, FiMinus } from "react-icons/fi";

interface ProfileCompletionProps {
  profileCompletion: IProfileCompletion;
}

const COMPLETION_SECTIONS = [
  { key: "Profile Basics",  weight: 10, color: "#0ea5e9" },
  { key: "Projects",        weight: 15, color: "#8b5cf6" },
  { key: "Skills",          weight: 15, color: "#6366f1" },
  { key: "Experience",      weight: 15, color: "#10b981" },
  { key: "Education",       weight: 10, color: "#3b82f6" },
  { key: "Testimonials",    weight: 10, color: "#f43f5e" },
  { key: "Certifications",  weight: 10, color: "#06b6d4" },
  { key: "Achievements",    weight: 5,  color: "#f59e0b" },
  { key: "Social Links",    weight: 10, color: "#ec4899" },
];

const MSG = (pct: number): { label: string; sub: string } => {
  if (pct === 100) return { label: "Complete",      sub: "Every section is filled in." };
  if (pct >= 80)   return { label: "Almost there",  sub: "Just a few sections left." };
  if (pct >= 50)   return { label: "Good progress", sub: "Past the halfway mark." };
  return               { label: "Getting started", sub: "Fill key sections to stand out." };
};

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polarToCart(cx, cy, r, startDeg);
  const e = polarToCart(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
}

const ProfileCompletionTemplate: React.FC<ProfileCompletionProps> = ({ profileCompletion }) => {
  const { percentage, missingSections } = profileCompletion;
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const animatedPct = useCountUp(percentage);

  const isComplete = percentage === 100;
  const { label, sub } = MSG(percentage);

  const size = isMobile ? 122 : 152;
  const strokeW = isMobile ? 10 : 12;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const GAP_DEG = 3;
  const USABLE_DEG = 360 - COMPLETION_SECTIONS.length * GAP_DEG;

  let currentAngle = -90;
  const segments = COMPLETION_SECTIONS.map((section) => {
    const span = (section.weight / 100) * USABLE_DEG;
    const startDeg = currentAngle;
    const endDeg = startDeg + span;
    currentAngle = endDeg + GAP_DEG;
    const complete = !missingSections.some(
      (m) => m.toLowerCase() === section.key.toLowerCase()
    );
    return { ...section, startDeg, endDeg, complete };
  });

  return (
    <div className="flex flex-col items-center">
      {/* Segmented arc */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size}>
          {segments.map((seg, i) => (
            <motion.path
              key={seg.key}
              d={arcPath(cx, cy, r, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={seg.complete ? seg.color : (isDark ? colors.neutral700 : colors.neutral200)}
              strokeWidth={strokeW}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.07 + 0.1, ease: "easeOut" }}
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: isMobile ? 22 : 28,
              color: colors.neutral900,
              letterSpacing: "-0.04em",
            }}
          >
            {animatedPct}
            <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: colors.neutral400 }}>%</span>
          </span>
          <span
            className="font-semibold mt-1 uppercase tracking-widest"
            style={{ fontSize: "8px", color: colors.neutral400 }}
          >
            {isComplete ? "Done" : label.split(" ")[0]}
          </span>
        </div>

        {/* Complete checkmark badge */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
            style={{ width: 26, height: 26, background: "#10b981" }}
          >
            <FiCheck size={13} color="#fff" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>

      {/* Status text */}
      <div className="mt-3 text-center">
        <div className="text-sm font-bold" style={{ color: colors.neutral800 }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>{sub}</div>
      </div>

      {/* Section grid — 3 columns of status pills */}
      <div className="mt-4 w-full grid grid-cols-3 gap-1.5">
        {segments.map((seg) => (
          <div
            key={seg.key}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
            style={{
              background: seg.complete
                ? (isDark ? `${seg.color}22` : `${seg.color}10`)
                : (isDark ? colors.neutral100 : colors.neutral50),
            }}
          >
            {/* Status indicator */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 14,
                height: 14,
                background: seg.complete ? `${seg.color}28` : "transparent",
                border: seg.complete ? "none" : `1.5px solid ${isDark ? colors.neutral600 : colors.neutral300}`,
                color: seg.complete ? seg.color : (isDark ? colors.neutral500 : colors.neutral400),
              }}
            >
              {seg.complete
                ? <FiCheck size={8} strokeWidth={3} />
                : <FiMinus size={8} strokeWidth={2.5} />
              }
            </div>

            <span
              className="font-medium leading-tight truncate"
              style={{
                fontSize: "8.5px",
                color: seg.complete
                  ? seg.color
                  : (isDark ? colors.neutral500 : colors.neutral400),
              }}
            >
              {seg.key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletionTemplate;
