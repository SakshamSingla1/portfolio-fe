import React from "react";
import { motion } from "framer-motion";
import type { IStats } from "../../../services/useDashboardService";
import { useCountUp } from "../../../hooks/useCountUp";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FiCode, FiZap, FiBriefcase, FiMail } from "react-icons/fi";

interface StatsProps {
  stats: IStats;
}

const HERO_STATS = [
  { label: "Projects",   key: "totalProjects",   accent: "#8b5cf6", icon: FiCode,      route: "/projects" },
  { label: "Skills",     key: "totalSkills",     accent: "#6366f1", icon: FiZap,       route: "/skills" },
  { label: "Experience", key: "totalExperience", accent: "#10b981", icon: FiBriefcase, route: "/experience" },
  { label: "Messages",   key: "totalMessages",   accent: "#a855f7", icon: FiMail,      route: "/messages" },
] as const;

const SECONDARY_STATS = [
  { label: "Education",    key: "totalEducation",    accent: "#3b82f6", route: "/education" },
  { label: "Achievements", key: "totalAchievements", accent: "#f59e0b", route: "/achievements" },
  { label: "Testimonials", key: "totalTestimonials", accent: "#f43f5e", route: "/testimonials" },
  { label: "Certs",        key: "totalCertification",accent: "#06b6d4", route: "/certifications" },
  { label: "Social",       key: "totalSocialLinks",  accent: "#ec4899", route: "/social-links" },
] as const;

/* ─── Hero stat cell ─────────────────────────────────────────── */
interface HeroStatCellProps {
  label: string;
  value: number;
  accent: string;
  icon: React.ComponentType<{ size?: number }>;
  route: string;
  index: number;
  unreadCount?: number;
  isMobile: boolean;
}

const HeroStatCell: React.FC<HeroStatCellProps> = ({
  label, value, accent, icon: Icon, route, index, unreadCount, isMobile,
}) => {
  const colors = useColors();
  const animatedValue = useCountUp(value, index * 80 + 100);
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -1 }}
      onClick={() => navigate(route)}
      className="group relative flex flex-col w-full text-left overflow-hidden"
      style={{
        padding: isMobile ? "18px 14px 16px" : "22px 20px 18px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {/* Hover fill */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `linear-gradient(135deg, ${accent}0a, ${accent}04)` }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ height: 2, background: accent }}
      />

      {/* Icon container */}
      <div
        className="relative flex items-center justify-center rounded-xl mb-4 transition-transform duration-200 group-hover:scale-110"
        style={{
          width: isMobile ? 36 : 42,
          height: isMobile ? 36 : 42,
          background: `${accent}18`,
          color: accent,
        }}
      >
        <Icon size={isMobile ? 15 : 18} />
      </div>

      {/* Number + unread badge */}
      <div className="relative flex items-end gap-1.5 mb-2">
        <span
          className="tabular-nums font-black leading-none"
          style={{
            fontSize: isMobile ? "clamp(24px, 5vw, 32px)" : "clamp(28px, 2.8vw, 40px)",
            color: colors.neutral900,
            letterSpacing: "-0.04em",
          }}
        >
          {animatedValue}
        </span>
        {unreadCount !== undefined && unreadCount > 0 && (
          <span
            className="mb-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
            style={{ background: accent, color: "#fff" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount} new
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className="relative font-bold uppercase"
        style={{ fontSize: "9px", color: colors.neutral400, letterSpacing: "0.1em" }}
      >
        {label}
      </span>
    </motion.button>
  );
};

/* ─── Secondary stat cell ────────────────────────────────────── */
interface SecondaryStatCellProps {
  label: string;
  value: number;
  accent: string;
  route: string;
  index: number;
}

const SecondaryStatCell: React.FC<SecondaryStatCellProps> = ({
  label, value, accent, route, index,
}) => {
  const colors = useColors();
  const animatedValue = useCountUp(value, (index + 4) * 70 + 220);
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)}
      className="group flex flex-col items-center justify-center w-full transition-colors duration-150"
      style={{
        padding: "12px 8px 10px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <div
        className="rounded-full mb-1.5 transition-transform duration-150 group-hover:scale-125"
        style={{ width: 6, height: 6, background: accent }}
      />
      <span
        className="tabular-nums font-black"
        style={{ fontSize: 16, color: colors.neutral800, letterSpacing: "-0.03em", lineHeight: 1 }}
      >
        {animatedValue}
      </span>
      <span
        className="font-semibold uppercase mt-1 text-center"
        style={{ fontSize: "8.5px", letterSpacing: "0.07em", color: colors.neutral400 }}
      >
        {label}
      </span>
    </button>
  );
};

/* ─── Container ──────────────────────────────────────────────── */
const StatsTemplate: React.FC<StatsProps> = ({ stats }) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const { isDark } = useTheme();

  const containerStyle = {
    background: colors.neutral0,
    border: `1.5px solid ${colors.neutral300}`,
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03)"
      : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
  };

  return (
    <div style={containerStyle}>
      {/* Accent top line */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${colors.primary600} 0%, ${colors.primary400} 55%, ${colors.primary600}00 100%)`,
      }} />

      {/* Hero row */}
      <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
        {HERO_STATS.map((s, i) => {
          const value = (stats as any)?.[s.key] ?? 0;
          const unreadCount = s.key === "totalMessages" ? (stats.unreadMessages ?? 0) : undefined;
          const isRightEdge = isMobile ? i % 2 === 1 : i === HERO_STATS.length - 1;
          const isBottomRow = isMobile && i >= 2;
          return (
            <div
              key={s.label}
              style={{
                borderRight: isRightEdge ? "none" : `1.5px solid ${colors.neutral300}`,
                borderBottom: isBottomRow ? "none" : (isMobile && i < 2 ? `1.5px solid ${colors.neutral300}` : "none"),
              }}
            >
              <HeroStatCell
                {...s}
                value={value}
                index={i}
                unreadCount={unreadCount}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: colors.neutral200 }} />

      {/* Secondary row */}
      {isMobile ? (
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {SECONDARY_STATS.map((s, i) => {
            const value = (stats as any)?.[s.key] ?? 0;
            return (
              <div
                key={s.label}
                style={{
                  borderRight: i < SECONDARY_STATS.length - 1 ? `1.5px solid ${colors.neutral300}` : "none",
                  minWidth: 74,
                  flexShrink: 0,
                }}
              >
                <SecondaryStatCell {...s} value={value} index={i} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-5">
          {SECONDARY_STATS.map((s, i) => {
            const value = (stats as any)?.[s.key] ?? 0;
            return (
              <div
                key={s.label}
                style={{ borderRight: i < SECONDARY_STATS.length - 1 ? `1.5px solid ${colors.neutral300}` : "none" }}
              >
                <SecondaryStatCell {...s} value={value} index={i} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(StatsTemplate);
