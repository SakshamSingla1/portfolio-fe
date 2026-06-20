import React from "react";
import { motion } from "framer-motion";
import type { IStats } from "../../../services/useDashboardService";
import { useCountUp } from "../../../hooks/useCountUp";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface StatsProps {
  stats: IStats;
}

const STATS_CONFIG = [
  { label: "Skills",        key: "totalSkills",        accent: "#6366f1", route: "/skills" },
  { label: "Education",     key: "totalEducation",      accent: "#3b82f6", route: "/education" },
  { label: "Experience",    key: "totalExperience",     accent: "#10b981", route: "/experience" },
  { label: "Projects",      key: "totalProjects",       accent: "#8b5cf6", route: "/projects" },
  { label: "Achievements",  key: "totalAchievements",   accent: "#f59e0b", route: "/achievements" },
  { label: "Testimonials",  key: "totalTestimonials",   accent: "#f43f5e", route: "/testimonials" },
  { label: "Certs",         key: "totalCertification",  accent: "#06b6d4", route: "/certifications" },
  { label: "Social",        key: "totalSocialLinks",    accent: "#ec4899", route: "/social-links" },
  { label: "Messages",      key: "totalMessages",       accent: "#a855f7", route: "/messages" },
] as const;

interface StatCellProps {
  label: string;
  value: number;
  accent: string;
  route: string;
  index: number;
  unreadCount?: number;
}

const StatCell: React.FC<StatCellProps> = ({ label, value, accent, route, index, unreadCount }) => {
  const colors = useColors();
  const animatedValue = useCountUp(value, index * 50 + 60);
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => navigate(route)}
      className="group w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ padding: "16px 6px 14px", background: "transparent", border: "none", cursor: "pointer", outline: "none" }}
    >
      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `${accent}08` }}
      />

      {/* Accent bar — bottom on hover */}
      <div
        className="absolute bottom-0 left-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ width: 24, height: 3, background: accent, transform: "translateX(-50%)" }}
      />

      {/* Number */}
      <div className="relative flex items-start">
        <span
          className="tabular-nums font-black leading-none"
          style={{ fontSize: "clamp(18px, 2.2vw, 26px)", color: colors.neutral900, letterSpacing: "-0.03em" }}
        >
          {animatedValue}
        </span>
        {/* Unread badge */}
        {unreadCount !== undefined && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-3 text-[9px] font-bold rounded-full flex items-center justify-center"
            style={{ minWidth: 14, height: 14, background: accent, color: "#fff", lineHeight: 1 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      <span
        className="relative font-semibold uppercase mt-1.5 text-center leading-tight"
        style={{ fontSize: "9px", letterSpacing: "0.08em", color: colors.neutral400 }}
      >
        {label}
      </span>
    </motion.button>
  );
};

const StatsTemplate: React.FC<StatsProps> = ({ stats }) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const { isDark } = useTheme();

  const containerStyle = {
    background: colors.neutral0,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: isDark
      ? "0 1px 4px rgba(0,0,0,0.35)"
      : `0 1px 3px rgba(0,0,0,0.04)`,
  };

  const values = STATS_CONFIG.map((s) => ({
    ...s,
    value: (stats as any)?.[s.key] ?? 0,
    unreadCount: s.key === "totalMessages" ? (stats.unreadMessages ?? 0) : undefined,
  }));

  if (isMobile) {
    // 3×3 grid for 9 items
    return (
      <div style={containerStyle}>
        <div className="grid grid-cols-3">
          {values.map((item, i) => {
            const isLastCol  = (i + 1) % 3 === 0;
            const isLastRow  = i >= 6;
            return (
              <div
                key={item.label}
                style={{
                  borderRight: isLastCol ? "none" : `1px solid ${colors.neutral200}`,
                  borderBottom: isLastRow  ? "none" : `1px solid ${colors.neutral200}`,
                }}
              >
                <StatCell {...item} index={i} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="flex">
        {values.map((item, i) => (
          <div
            key={item.label}
            className="flex-1"
            style={{ borderRight: i < values.length - 1 ? `1px solid ${colors.neutral200}` : "none" }}
          >
            <StatCell {...item} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(StatsTemplate);
