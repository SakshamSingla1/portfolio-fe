import React, { useEffect, useState } from "react";
import type { IStats } from "../../../services/useDashboardService";

import skillsIcon from "../../../assets/icons/skill.png";
import educationIcon from "../../../assets/icons/education.png";
import experienceIcon from "../../../assets/icons/experience.png";
import projectsIcon from "../../../assets/icons/project.png";
import achievementIcon from "../../../assets/icons/achievement.png";
import testimonialIcon from "../../../assets/icons/testimonial.png";
import certificationIcon from "../../../assets/icons/certification.png";
import messageIcon from "../../../assets/icons/messages.png";
import unreadIcon from "../../../assets/icons/unread.png";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface StatsProps {
  stats: IStats;
}

type ColorVariant =
  | "indigo"
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan"
  | "purple"
  | "red";

interface StatsCardProps {
  icon: string;
  label: string;
  value?: number;
  color: ColorVariant;
  isMobile: boolean;
}

const colorClasses = {
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 via-indigo-100 to-white",
    textLight: "text-indigo-600",
    textDark: "text-indigo-900",
    glow: "shadow-indigo-200/50",
    border: "border-indigo-200",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 via-blue-100 to-white",
    textLight: "text-blue-600",
    textDark: "text-blue-900",
    glow: "shadow-blue-200/50",
    border: "border-blue-200",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 via-emerald-100 to-white",
    textLight: "text-emerald-600",
    textDark: "text-emerald-900",
    glow: "shadow-emerald-200/50",
    border: "border-emerald-200",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 via-violet-100 to-white",
    textLight: "text-violet-600",
    textDark: "text-violet-900",
    glow: "shadow-violet-200/50",
    border: "border-violet-200",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 via-amber-100 to-white",
    textLight: "text-amber-600",
    textDark: "text-amber-900",
    glow: "shadow-amber-200/50",
    border: "border-amber-200",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 via-rose-100 to-white",
    textLight: "text-rose-600",
    textDark: "text-rose-900",
    glow: "shadow-rose-200/50",
    border: "border-rose-200",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-50 via-cyan-100 to-white",
    textLight: "text-cyan-600",
    textDark: "text-cyan-900",
    glow: "shadow-cyan-200/50",
    border: "border-cyan-200",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 via-purple-100 to-white",
    textLight: "text-purple-600",
    textDark: "text-purple-900",
    glow: "shadow-purple-200/50",
    border: "border-purple-200",
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 via-red-100 to-white",
    textLight: "text-red-600",
    textDark: "text-red-900",
    glow: "shadow-red-200/50",
    border: "border-red-200",
  },
} as const;

const useCountUp = (value: number = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 700;
    const increment = value / (duration / 16);
    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(counter);
  }, [value]);
  return count;
};

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value = 0,
  color,
  isMobile,
}) => {
  const theme = colorClasses[color];
  const animatedValue = useCountUp(value);

  return (
    <div className={`relative rounded-2xl ${theme.bg} ${theme.glow} border ${theme.border} ${isMobile ? "p-5" : "p-7"}`}>
      <img src={icon} alt={label} className={`absolute right-0 top-0 bottom-0 pointer-events-none object-contain ${isMobile ? "w-24 h-24" : "w-40 h-40"}`} />
      <div className="relative z-10">
        <div className={`text-xs font-semibold uppercase tracking-wide ${theme.textLight}`}>{label}</div>
        <div className={`${isMobile ? "text-2xl" : "text-4xl"} font-bold mt-2 ${theme.textDark}`}>{animatedValue}</div>
      </div>
    </div>
  );
};

const StatsTemplate: React.FC<StatsProps> = ({ stats }) => {
  const isMobile = useIsMobile();

  const statsConfig = [
    { icon: skillsIcon, label: "Skills", value: stats?.totalSkills, color: "indigo" },
    { icon: educationIcon, label: "Education", value: stats?.totalEducation, color: "blue" },
    { icon: experienceIcon, label: "Experience", value: stats?.totalExperience, color: "emerald" },
    { icon: projectsIcon, label: "Projects", value: stats?.totalProjects, color: "violet" },
    { icon: achievementIcon, label: "Achievements", value: stats?.totalAchievements, color: "amber" },
    { icon: testimonialIcon, label: "Testimonials", value: stats?.totalTestimonials, color: "rose" },
    { icon: certificationIcon, label: "Certifications", value: stats?.totalCertification, color: "cyan" },
    { icon: messageIcon, label: "Messages", value: stats?.totalMessages, color: "purple" },
    { icon: unreadIcon, label: "Unread", value: stats?.unreadMessages, color: "red" },
  ] as const;

  return (
    <div className={`grid gap-6 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
      {statsConfig.map((item) => (
        <StatsCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          color={item.color}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default React.memo(StatsTemplate);
