import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { IProfileCompletion, ICompletionSnapshot } from "../../../services/useDashboardService";
import { useProfileTemplateService } from "../../../services/useProfileTemplateService";
import { useCountUp } from "../../../hooks/useCountUp";
import { FiCheck, FiMinus, FiArrowRight, FiArrowUpRight, FiTrendingUp } from "react-icons/fi";
import { useGlassSurface, glowTextShadow } from "./shared/DashboardUI";

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
  "Choose a Template": "/portfolio-templates",
};

interface ProfileCompletionProps {
  profileCompletion: IProfileCompletion;
}

const COMPLETION_SECTIONS = [
  { key: "Profile Basics",  weight: 9,  colors: ["#3b82f6", "#1d4ed8"] }, // Blue
  { key: "Projects",        weight: 13, colors: ["#8b5cf6", "#6d28d9"] }, // Purple
  { key: "Skills",          weight: 13, colors: ["#6366f1", "#4f46e5"] }, // Indigo
  { key: "Experience",      weight: 14, colors: ["#10b981", "#047857"] }, // Emerald Green
  { key: "Education",       weight: 9,  colors: ["#06b6d4", "#0891b2"] }, // Cyan
  { key: "Testimonials",    weight: 9,  colors: ["#f43f5e", "#be123c"] }, // Rose
  { key: "Certifications",  weight: 9,  colors: ["#ec4899", "#be185d"] }, // Pink
  { key: "Achievements",    weight: 5,  colors: ["#f59e0b", "#b45309"] }, // Amber
  { key: "Social Links",    weight: 9,  colors: ["#14b8a6", "#0f766e"] }, // Teal
  { key: "Choose a Template", weight: 10, colors: ["#a855f7", "#7e22ce"] }, // Violet
];

const MSG = (pct: number): { label: string; sub: string } => {
  if (pct === 100) return { label: "Fully Complete",  sub: "Outstanding! All sections filled." };
  if (pct >= 80)   return { label: "Almost Done",     sub: "Only a couple of tweaks left." };
  if (pct >= 50)   return { label: "Halfway There",   sub: "Great progress, keep adding." };
  return               { label: "Getting Started", sub: "Add key content to build score." };
};

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

/** Compact 30-day sparkline for the completion score — a plain SVG polyline rather
 * than pulling in recharts for a handful of points in a ~180px-wide slot. */
const CompletionSparkline: React.FC<{ trend: ICompletionSnapshot[] }> = ({ trend }) => {
  const colors = useColors();
  const width = 100;
  const height = 32;
  const pad = 3;

  const min = Math.min(...trend.map((t) => t.percentage));
  const max = Math.max(...trend.map((t) => t.percentage));
  const range = Math.max(max - min, 1);

  const points = trend.map((t, i) => {
    const x = pad + (i / (trend.length - 1)) * (width - pad * 2);
    const y = height - pad - ((t.percentage - min) / range) * (height - pad * 2);
    return { x, y, ...t };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height - pad} L ${points[0].x.toFixed(2)} ${height - pad} Z`;

  const delta = trend[trend.length - 1].percentage - trend[0].percentage;
  const last = points[points.length - 1];

  return (
    <div className="flex items-center gap-2.5">
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="completion-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.primary500} stopOpacity={0.25} />
            <stop offset="100%" stopColor={colors.primary500} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#completion-spark-fill)" stroke="none" />
        <motion.path
          d={linePath}
          fill="none"
          stroke={colors.primary500}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <circle cx={last.x} cy={last.y} r={2.5} fill={colors.primary500} />
      </svg>
      {delta !== 0 && (
        <div
          className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
          style={{
            background: delta > 0 ? "#dcfce7" : "#fee2e2",
            color: delta > 0 ? "#15803d" : "#b91c1c",
          }}
        >
          <FiArrowUpRight size={8} style={{ transform: delta < 0 ? "rotate(90deg)" : undefined }} />
          {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
};

const ProfileCompletionTemplate: React.FC<ProfileCompletionProps> = ({ profileCompletion }) => {
  const { percentage, missingSections, trend } = profileCompletion;
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const animatedPct = useCountUp(percentage);
  const profileTemplateService = useProfileTemplateService();

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // The backend's profile-completion percentage/missingSections calculation predates
  // template selection, so it isn't included there — fetched separately here instead.
  // NOTE: the API only ever exposes the *current* templateKey, defaulting silently to
  // "CLASSIC" whether the user explicitly picked Classic or never touched this section
  // at all. There's no separate "user has visited /portfolio-templates" flag, so we use
  // "templateKey is still CLASSIC" as the least-bad stand-in for "not yet chosen" — a
  // user who deliberately picked Classic will see this section marked incomplete too.
  const { data: templateKey } = useQuery({
    queryKey: ["profile-template"],
    queryFn: async () => {
      const res = await profileTemplateService.getProfileTemplate();
      if (res?.status === HTTP_STATUS.OK) return res.data.data?.templateKey ?? "CLASSIC";
      return "CLASSIC";
    },
  });
  const isTemplateChosen = templateKey !== undefined && templateKey !== "CLASSIC";

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

    const complete = section.key === "Choose a Template"
      ? isTemplateChosen
      : !isSectionMissing(section.key, missingSections);

    return { ...section, startDeg, endDeg, complete };
  });

  const hoveredSeg = segments.find(s => s.key === hoveredKey);

  const centerSize = (r * 2) - strokeW + 2;

  // Hero accent used for the glowing percentage text + the center glass card —
  // shifts to the hovered slice's color, falling back to green when fully done.
  const heroAccent = hoveredSeg ? hoveredSeg.colors[0] : isComplete ? "#10b981" : colors.primary500;
  const centerGlass = useGlassSurface(heroAccent);

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

            const opacity = isHovered ? 1 : anyHovered ? 0.35 : 1;

            return (
              <motion.path
                key={seg.key}
                d={arcPath(cx, cy, r, seg.startDeg, seg.endDeg)}
                fill="none"
                stroke={seg.complete ? `url(#grad-${seg.key.replace(/\s+/g, "-")})` : (isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)")}
                strokeWidth={isHovered ? strokeW + 4 : strokeW}
                strokeLinecap="round"
                style={{
                  cursor: isClickable ? "pointer" : "default",
                  filter: isHovered
                    ? "url(#active-glow)"
                    : seg.complete
                    ? `drop-shadow(0 0 5px ${seg.colors[0]}66)`
                    : undefined,
                }}
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
            ...centerGlass,
            transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
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
                    lineHeight: 1,
                    textShadow: glowTextShadow(hoveredSeg.colors[0], isDark),
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
                    textShadow: glowTextShadow(heroAccent, isDark),
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

      {trend && trend.length >= 2 && (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1.5">
            <FiTrendingUp size={9} style={{ color: colors.neutral400 }} />
            <span className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: colors.neutral400 }}>
              Last {trend.length} days
            </span>
          </div>
          <CompletionSparkline trend={trend} />
        </div>
      )}

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
                  boxShadow: seg.complete ? `0 0 6px ${primaryColor}55` : undefined,
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

          // Glass-lite: a translucent tint + a touch of backdrop-blur so these read as
          // small elevated panes floating over the aurora wash, not flat neutral chips.
          const baseStyle: React.CSSProperties = {
            background: seg.complete
              ? isDark ? `${primaryColor}1F` : `${primaryColor}0D`
              : isDark ? `${colors.neutral100}CC` : `${colors.neutral50}CC`,
            border: isHighlighted
              ? `1.5px solid ${primaryColor}`
              : `1.5px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
            backdropFilter: "blur(10px) saturate(160%)",
            WebkitBackdropFilter: "blur(10px) saturate(160%)",
            cursor: isClickable ? "pointer" : "default",
          };

          const motionProps = {
            onMouseEnter: () => setHoveredKey(seg.key),
            onMouseLeave: () => setHoveredKey(null),
            className: "flex items-center gap-1.5 rounded-xl px-2.5 py-2 w-full text-left",
            style: baseStyle,
            animate: {
              scale: isHighlighted ? 1.04 : 1,
              y: isHighlighted ? -1 : 0,
              boxShadow: isHighlighted ? `0 6px 14px ${primaryColor}22` : "0 0 0 rgba(0,0,0,0)",
            },
            whileHover: {
              scale: 1.06,
              y: -2,
              boxShadow: `0 10px 24px ${primaryColor}33`,
            },
            transition: { type: "spring" as const, stiffness: 380, damping: 26 },
          };

          return isClickable ? (
            <motion.button
              key={seg.key}
              onClick={() => navigate(route)}
              whileTap={{ scale: 0.97 }}
              {...motionProps}
            >
              {pill}
            </motion.button>
          ) : (
            <motion.div key={seg.key} {...motionProps}>
              {pill}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCompletionTemplate;
