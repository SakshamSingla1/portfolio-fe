import React from "react";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IProfileCompletion } from "../../../services/useDashboardService";
import { useCountUp } from "../../../hooks/useCountUp";
import { motion } from "framer-motion";

interface ProfileCompletionProps {
  profileCompletion: IProfileCompletion;
}

const getMessage = (pct: number): { label: string; sub: string } => {
  if (pct === 100) return { label: "Complete",       sub: "Your portfolio is fully built." };
  if (pct >= 80)   return { label: "Almost there",   sub: "A few more sections to go." };
  if (pct >= 50)   return { label: "Good progress",  sub: "You're past the halfway mark." };
  return               { label: "Getting started", sub: "Fill in key sections to stand out." };
};

const ProfileCompletionTemplate: React.FC<ProfileCompletionProps> = ({ profileCompletion }) => {
  const { percentage, missingSections } = profileCompletion;
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const animatedPct = useCountUp(percentage);

  const size    = isMobile ? 110 : 140;
  const strokeW = isMobile ? 9 : 11;
  const radius  = (size - strokeW) / 2;
  const circ    = 2 * Math.PI * radius;
  const offset  = circ - (animatedPct / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  const isComplete = percentage === 100;
  const { label, sub } = getMessage(percentage);

  const arcColor    = isComplete ? "#10b981" : colors.primary600;
  const arcColorEnd = isComplete ? "#34d399" : colors.primary400;

  // Track color — slightly visible in both modes
  const trackColor = isDark ? colors.neutral200 : colors.neutral100;

  return (
    <div className="flex flex-col items-center">
      {/* Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id="pcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={arcColor} />
              <stop offset="100%" stopColor={arcColorEnd} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeW} />
          {/* Arc */}
          <motion.circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="url(#pcGrad)"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black tabular-nums leading-none"
            style={{ fontSize: isMobile ? 22 : 28, color: colors.neutral900, letterSpacing: "-0.03em" }}
          >
            {animatedPct}
            <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: colors.neutral500 }}>%</span>
          </span>
        </div>

        {/* Complete checkmark */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full text-white"
            style={{ width: 26, height: 26, background: "#10b981", fontSize: 12, fontWeight: 700 }}
          >
            ✓
          </motion.div>
        )}
      </motion.div>

      {/* Status text */}
      <div className="mt-4 text-center">
        <div className="font-bold text-sm" style={{ color: colors.neutral800 }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: colors.neutral500 }}>{sub}</div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-4 w-full rounded-full overflow-hidden"
        style={{ height: 4, background: trackColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${arcColor}, ${arcColorEnd})` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div className="flex justify-between w-full mt-1">
        <span className="text-[10px]" style={{ color: colors.neutral400 }}>0%</span>
        <span className="text-[10px]" style={{ color: colors.neutral400 }}>100%</span>
      </div>

      {/* Missing sections */}
      {!isComplete && missingSections.length > 0 && (
        <div className="mt-4 w-full">
          <div className="text-xs font-semibold mb-2" style={{ color: colors.neutral600 }}>
            Complete these to improve:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSections.map((section, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: isDark ? colors.primary900 : colors.primary50,
                  color: isDark ? colors.primary300 : colors.primary700,
                  border: `1px solid ${isDark ? colors.primary700 : colors.primary200}`,
                }}
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionTemplate;
