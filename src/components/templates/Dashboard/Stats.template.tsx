import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { IStats } from "../../../services/useDashboardService";

import skillsIcon from "../../../assets/icons/skill.png";
import educationIcon from "../../../assets/icons/education.png";
import experienceIcon from "../../../assets/icons/experience.png";
import projectsIcon from "../../../assets/icons/project.png";
import achievementIcon from "../../../assets/icons/achievement.png";
import testimonialIcon from "../../../assets/icons/testimonial.png";
import certificationIcon from "../../../assets/icons/certification.png";
import messageIcon from "../../../assets/icons/messages.png";
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
  icon?: string;
  label: string;
  value?: number;
  color: ColorVariant;
  isMobile: boolean;
  index: number;
}

const colorClasses = {
  indigo: {
    bg: "from-indigo-50 via-indigo-100/50 to-white",
    text: "text-indigo-600",
    border: "border-indigo-100 group-hover:border-indigo-300",
    glow: "group-hover:shadow-indigo-500/10",
  },
  blue: {
    bg: "from-blue-50 via-blue-100/50 to-white",
    text: "text-blue-600",
    border: "border-blue-100 group-hover:border-blue-300",
    glow: "group-hover:shadow-blue-500/10",
  },
  emerald: {
    bg: "from-emerald-50 via-emerald-100/50 to-white",
    text: "text-emerald-600",
    border: "border-emerald-100 group-hover:border-emerald-300",
    glow: "group-hover:shadow-emerald-500/10",
  },
  violet: {
    bg: "from-violet-50 via-violet-100/50 to-white",
    text: "text-violet-600",
    border: "border-violet-100 group-hover:border-violet-300",
    glow: "group-hover:shadow-violet-500/10",
  },
  amber: {
    bg: "from-amber-50 via-amber-100/50 to-white",
    text: "text-amber-600",
    border: "border-amber-100 group-hover:border-amber-300",
    glow: "group-hover:shadow-amber-500/10",
  },
  rose: {
    bg: "from-rose-50 via-rose-100/50 to-white",
    text: "text-rose-600",
    border: "border-rose-100 group-hover:border-rose-300",
    glow: "group-hover:shadow-rose-500/10",
  },
  cyan: {
    bg: "from-cyan-50 via-cyan-100/50 to-white",
    text: "text-cyan-600",
    border: "border-cyan-100 group-hover:border-cyan-300",
    glow: "group-hover:shadow-cyan-500/10",
  },
  purple: {
    bg: "from-purple-50 via-purple-100/50 to-white",
    text: "text-purple-600",
    border: "border-purple-100 group-hover:border-purple-300",
    glow: "group-hover:shadow-purple-500/10",
  },
  red: {
    bg: "from-red-50 via-red-100/50 to-white",
    text: "text-red-600",
    border: "border-red-100 group-hover:border-red-300",
    glow: "group-hover:shadow-red-500/10",
  },
} as const;

const useCountUp = (value = 0, delay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const duration = 1000;
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
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);
  return count;
};

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value = 0,
  color,
  isMobile,
  index,
}) => {
  const theme = colorClasses[color];
  const animatedValue = useCountUp(value, index * 50 + 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br transition-all duration-300 shadow-sm ${theme.bg} ${theme.border} ${theme.glow}`}
    >
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-white/40" />

      <img
        src={icon}
        alt={label}
        className={`absolute pointer-events-none object-contain opacity-20 group-hover:opacity-40 transition-all duration-500 ${isMobile ? "w-48 h-48 -right-9 -bottom-18" : "w-96 h-96 -right-18 -bottom-36"
          }`}
      />

      <div className={`relative z-10 ${isMobile ? "p-4" : "p-6"}`}>
        <div className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
          {label}
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <div
            className={`font-extrabold leading-none text-slate-900 ${isMobile ? "text-2xl" : "text-3xl"
              }`}
          >
            {animatedValue}
          </div>
          {label === "Unread" && value > 0 && (
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse ml-1" />
          )}
        </div>
      </div>
    </motion.div>
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
  ] as const;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}
    >
      {statsConfig.map((item, index) => (
        <StatsCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          color={item.color}
          isMobile={isMobile}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default React.memo(StatsTemplate);
