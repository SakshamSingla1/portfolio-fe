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
    border: "border-indigo-300",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 via-blue-100 to-white",
    textLight: "text-blue-600",
    textDark: "text-blue-900",
    glow: "shadow-blue-200/50",
    border: "border-blue-300",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 via-emerald-100 to-white",
    textLight: "text-emerald-600",
    textDark: "text-emerald-900",
    glow: "shadow-emerald-200/50",
    border: "border-emerald-300",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 via-violet-100 to-white",
    textLight: "text-violet-600",
    textDark: "text-violet-900",
    glow: "shadow-violet-200/50",
    border: "border-violet-300",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 via-amber-100 to-white",
    textLight: "text-amber-600",
    textDark: "text-amber-900",
    glow: "shadow-amber-200/50",
    border: "border-amber-300",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 via-rose-100 to-white",
    textLight: "text-rose-600",
    textDark: "text-rose-900",
    glow: "shadow-rose-200/50",
    border: "border-rose-300",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-50 via-cyan-100 to-white",
    textLight: "text-cyan-600",
    textDark: "text-cyan-900",
    glow: "shadow-cyan-200/50",
    border: "border-cyan-300",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 via-purple-100 to-white",
    textLight: "text-purple-600",
    textDark: "text-purple-900",
    glow: "shadow-purple-200/50",
    border: "border-purple-300",
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 via-red-100 to-white",
    textLight: "text-red-600",
    textDark: "text-red-900",
    glow: "shadow-red-200/50",
    border: "border-red-300",
  },
} as const;

const useCountUp = (value = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 800;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
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
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${theme.bg} ${theme.border}`}>
      <div className="absolute inset-0" />

      <img
        src={icon}
        alt={label}
        className={`absolute right-0 bottom-0 pointer-events-none object-contain ${
          isMobile ? "w-20 h-20" : "w-32 h-32"
        }`}
      />

      <div className={`relative z-10 ${isMobile ? "p-5" : "p-7"}`}>
        <div className={`text-xs font-semibold uppercase tracking-wider ${theme.textLight}`}>
          {label}
        </div>
        <div
          className={`mt-3 font-extrabold leading-none ${theme.textDark} ${
            isMobile ? "text-3xl" : "text-4xl"
          }`}
        >
          {animatedValue}
        </div>

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
    <div
      className={`grid gap-6 ${
        isMobile ? "grid-cols-2" : "grid-cols-4"
      }`}
    >
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
