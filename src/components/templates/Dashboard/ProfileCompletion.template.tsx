import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IProfileCompletion } from "../../../services/useDashboardService";
import { useCountUp } from "../../../hooks/useCountUp";
import { FiCheck, FiMinus, FiArrowRight } from "react-icons/fi";

const SECTION_ROUTES: Record<string, string> = {
  "Profile Basics":  "/profile",
  "Projects":        "/projects",
  "Skills":          "/skills",
  "Experience":      "/experience",
  "Education":       "/education",
  "Testimonials":    "/testimonials",
  "Certifications":  "/certifications",
  "Achievements":    "/achievements",
  "Social Links":    "/social-links",
};

interface ProfileCompletionProps {
  profileCompletion: IProfileCompletion;
}

const COMPLETION_SECTIONS = [
  { key: "Profile Basics",  weight: 10, colors: ["#3b82f6", "#1d4ed8"] }, // Blue
  { key: "Projects",        weight: 15, colors: ["#8b5cf6", "#6d28d9"] }, // Purple
  { key: "Skills",          weight: 15, colors: ["#6366f1", "#4f46e5"] }, // Indigo
  { key: "Experience",      weight: 15, colors: ["#10b981", "#047857"] }, // Emerald Green
  { key: "Education",       weight: 10, colors: ["#06b6d4", "#0891b2"] }, // Cyan
  { key: "Testimonials",    weight: 10, colors: ["#f43f5e", "#be123c"] }, // Rose
  { key: "Certifications",  weight: 10, colors: ["#ec4899", "#be185d"] }, // Pink
  { key: "Achievements",    weight: 5,  colors: ["#f59e0b", "#b45309"] }, // Amber
  { key: "Social Links",    weight: 10, colors: ["#14b8a6", "#0f766e"] }, // Teal
];

const MSG = (pct: number): { label: string; sub: string } => {
  if (pct === 100) return { label: "Fully Complete",  sub: "Outstanding! All sections filled." };
  if (pct >= 80)   return { label: "Almost Done",     sub: "Only a couple of tweaks left." };
  if (pct >= 50)   return { label: "Halfway There",   sub: "Great progress, keep adding." };
  return               { label: "Getting Started", sub: "Add key content to build score." };
};

// Check if a section key is in the backend's missingSections list
const isSectionMissing = (sectionKey: string, missing: string[]) => {
  const k = sectionKey.toLowerCase();
  return missing.some((m) => {
    const desc = m.toLowerCase();
    if (k === "profile basics") return desc.includes("profile");
    if (k === "projects") return desc.includes("project");
    if (k === "skills") return desc.includes("skill");
    if (k === "experience") return desc.includes("experience");
    if (k === "education") return desc.includes("education");
    if (k === "testimonials") return desc.includes("testimonial");
    if (k === "certifications") return desc.includes("certification");
    if (k === "achievements") return desc.includes("achievement");
    if (k === "social links") return desc.includes("social");
    return false;
  });
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
  const navigate = useNavigate();
  const animatedPct = useCountUp(percentage);

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const isComplete = percentage === 100;
  const { label, sub } = MSG(percentage);

  const size = isMobile ? 160 : 210;
  const strokeW = isMobile ? 14 : 18;
  const r = (size - strokeW) / 2 - 8; // Leave margin for clean hover explosion scaling
  const cx = size / 2;
  const cy = size / 2;

  const GAP_DEG = 4;
  const USABLE_DEG = 360 - COMPLETION_SECTIONS.length * GAP_DEG;

  let currentAngle = -90;
  const segments = COMPLETION_SECTIONS.map((section) => {
    const span = (section.weight / 100) * USABLE_DEG;
    const startDeg = currentAngle;
    const endDeg = startDeg + span;
    currentAngle = endDeg + GAP_DEG;
    
    // Resolve completion properly by matching against backend strings
    const complete = !isSectionMissing(section.key, missingSections);
    
    return { ...section, startDeg, endDeg, complete };
  });

  const hoveredSeg = segments.find(s => s.key === hoveredKey);

  // Center display size
  const centerSize = (r * 2) - strokeW + 2;

  return (
    <div className="flex flex-col items-center">
      {/* High-Contrast Glassmorphic Pie/Donut Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} style={{ overflow: "visible", zIndex: 5 }}>
          <defs>
            {/* Active glow shadow for highlighted slice */}
            <filter id="active-glow" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow 
                dx="0" 
                dy="8" 
                stdDeviation="8" 
                floodColor={hoveredSeg ? hoveredSeg.colors[0] : "#000"} 
                floodOpacity={isDark ? 0.45 : 0.25} 
              />
            </filter>
            
            {/* Linear Gradients for each segment */}
            {COMPLETION_SECTIONS.map((sec) => (
              <linearGradient id={`grad-${sec.key.replace(/\s+/g, "-")}`} key={sec.key} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={sec.colors[0]} />
                <stop offset="100%" stopColor={sec.colors[1]} />
              </linearGradient>
            ))}
          </defs>

          {/* Background Ring Track (Low contrast base guide) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"}
            strokeWidth={strokeW - 2}
          />

          {/* Custom SVG Segments */}
          {segments.map((seg) => {
            const isHovered = hoveredKey === seg.key;
            const anyHovered = hoveredKey !== null;
            
            // Calculate translation vector along the bisector angle of the slice
            const midDeg = (seg.startDeg + seg.endDeg) / 2;
            const rad = (midDeg * Math.PI) / 180;
            const explosionOffset = isMobile ? 6 : 9;
            const tx = isHovered ? explosionOffset * Math.cos(rad) : 0;
            const ty = isHovered ? explosionOffset * Math.sin(rad) : 0;

            const route = SECTION_ROUTES[seg.key];
            const isClickable = !seg.complete && !!route;

            // Determine opacity to emphasize the hovered segment
            const opacity = isHovered ? 1 : anyHovered ? 0.35 : 1;

            return (
              <motion.path
                key={seg.key}
                d={arcPath(cx, cy, r, seg.startDeg, seg.endDeg)}
                fill="none"
                stroke={seg.complete ? `url(#grad-${seg.key.replace(/\s+/g, "-")})` : (isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)")}
                strokeWidth={isHovered ? strokeW + 4 : strokeW}
                strokeLinecap="round"
                filter={isHovered ? "url(#active-glow)" : undefined}
                style={{ cursor: isClickable ? "pointer" : "default" }}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => isClickable && navigate(route)}
                animate={{ x: tx, y: ty, opacity }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
              />
            );
          })}
        </svg>

        {/* 3D Glassmorphic Center Card */}
        <div
          style={{
            position: "absolute",
            width: centerSize,
            height: centerSize,
            borderRadius: "50%",
            background: isDark ? "rgba(28, 28, 30, 0.5)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.7)"}`,
            boxShadow: isDark 
              ? "inset 0 1px 2px rgba(255,255,255,0.15), 0 12px 30px rgba(0, 0, 0, 0.4)" 
              : "inset 0 1px 3px rgba(255,255,255,0.8), 0 12px 30px rgba(35, 71, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10
          }}
        >
          <AnimatePresence mode="wait">
            {hoveredSeg ? (
              <motion.div
                key={hoveredSeg.key}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-center px-3"
              >
                <span
                  className="font-bold truncate max-w-[120px] text-center"
                  style={{
                    fontSize: isMobile ? "9.5px" : "11px",
                    color: hoveredSeg.colors[0],
                    textTransform: "uppercase",
                    letterSpacing: "0.08em"
                  }}
                >
                  {hoveredSeg.key}
                </span>
                <span
                  className="font-black my-1"
                  style={{
                    fontSize: isMobile ? 22 : 28,
                    color: colors.neutral900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1
                  }}
                >
                  +{hoveredSeg.weight}%
                </span>
                <span
                  className="font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{
                    fontSize: "7.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: hoveredSeg.complete ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.1)",
                    color: hoveredSeg.complete ? "#10b981" : "#ef4444"
                  }}
                >
                  {hoveredSeg.complete ? "Filled" : "Missing"}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="overall"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <span
                  className="font-bold text-[8.5px] uppercase tracking-widest text-center"
                  style={{ color: colors.neutral400, letterSpacing: "0.15em" }}
                >
                  Score
                </span>
                <span
                  className="font-black tabular-nums leading-none flex items-start my-0.5"
                  style={{
                    fontSize: isMobile ? 32 : 40,
                    color: colors.neutral900,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {animatedPct}
                  <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 700, color: colors.neutral400, marginLeft: 1 }}>%</span>
                </span>
                <span
                  className="font-semibold text-[8px] uppercase tracking-wider text-center px-2 py-0.5 rounded-full"
                  style={{ 
                    background: isComplete ? "rgba(16, 185, 129, 0.12)" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                    color: isComplete ? "#10b981" : colors.neutral500
                  }}
                >
                  {isComplete ? "Completed" : label.split(" ")[0]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Complete checkmark badge */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
            style={{ 
              width: 34, 
              height: 34, 
              background: "#10b981", 
              boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
              zIndex: 15
            }}
          >
            <FiCheck size={18} color="#fff" strokeWidth={3.5} />
          </motion.div>
        )}
      </motion.div>

      {/* Status text */}
      <div className="mt-5 text-center">
        <div className="text-sm font-black" style={{ color: colors.neutral800 }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>{sub}</div>
      </div>

      {/* Section grid — 3 columns of glassmorphic status pills */}
      <div className="mt-6 w-full grid grid-cols-3 gap-2.5">
        {segments.map((seg) => {
          const route = SECTION_ROUTES[seg.key];
          const isClickable = !seg.complete && !!route;
          const isHighlighted = hoveredKey === seg.key;
          const primaryColor = seg.colors[0];

          const pill = (
            <>
              <div
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: seg.complete ? `${primaryColor}22` : "transparent",
                  border: seg.complete
                    ? "none"
                    : `1.5px solid ${isDark ? colors.neutral600 : colors.neutral300}`,
                  color: seg.complete
                    ? primaryColor
                    : isDark ? colors.neutral500 : colors.neutral400,
                }}
              >
                {seg.complete
                  ? <FiCheck size={8} strokeWidth={3} />
                  : <FiMinus size={8} strokeWidth={2.5} />}
              </div>
              <div className="flex flex-col flex-1 truncate min-w-0">
                <span
                  className="font-bold leading-none truncate"
                  style={{
                    fontSize: "9px",
                    color: seg.complete
                      ? primaryColor
                      : isDark ? colors.neutral500 : colors.neutral400,
                  }}
                >
                  {seg.key}
                </span>
                <span 
                  className="text-[7px] font-semibold mt-0.5" 
                  style={{ color: isHighlighted ? primaryColor : colors.neutral400 }}
                >
                  {seg.weight}% Weight
                </span>
              </div>
              {isClickable && (
                <FiArrowRight
                  size={7.5}
                  style={{ color: colors.neutral400, flexShrink: 0 }}
                />
              )}
            </>
          );

          const baseStyle = {
            background: seg.complete
              ? isDark ? `${primaryColor}16` : `${primaryColor}08`
              : isDark ? colors.neutral100 : colors.neutral50,
            border: isHighlighted
              ? `1.5px solid ${primaryColor}`
              : `1.5px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
            transform: isHighlighted ? "scale(1.04) translateY(-1px)" : "scale(1)",
            boxShadow: isHighlighted ? `0 6px 14px ${primaryColor}22` : "none",
            transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"
          };

          return isClickable ? (
            <button
              key={seg.key}
              onClick={() => navigate(route)}
              onMouseEnter={() => setHoveredKey(seg.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 w-full text-left"
              style={{ ...baseStyle, cursor: "pointer" }}
            >
              {pill}
            </button>
          ) : (
            <div
              key={seg.key}
              onMouseEnter={() => setHoveredKey(seg.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-2"
              style={baseStyle}
            >
              {pill}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCompletionTemplate;
