import React from "react";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiUser, FiBook, FiBriefcase, FiZap, FiCode,
  FiMessageSquare, FiStar, FiAward, FiTrendingUp,
} from "react-icons/fi";

interface IActivity {
  type: string;
  description: string;
  timestamp: string;
  entityId?: string;
}

interface RecentActivitiesProps {
  activities: IActivity[];
}

const TYPE_META: Record<string, {
  dot: string; label: string; route: string;
  icon: React.ComponentType<{ size?: number }>;
}> = {
  PROFILE:        { dot: "#0ea5e9", label: "Profile",     route: "/profile",        icon: FiUser },
  EDUCATION:      { dot: "#6366f1", label: "Education",   route: "/education",      icon: FiBook },
  EXPERIENCE:     { dot: "#f97316", label: "Experience",  route: "/experience",     icon: FiBriefcase },
  SKILLS:         { dot: "#10b981", label: "Skills",      route: "/skills",         icon: FiZap },
  SKILL:          { dot: "#10b981", label: "Skills",      route: "/skills",         icon: FiZap },
  PROJECTS:       { dot: "#3b82f6", label: "Projects",    route: "/projects",       icon: FiCode },
  PROJECT:        { dot: "#3b82f6", label: "Projects",    route: "/projects",       icon: FiCode },
  CONTACT:        { dot: "#f43f5e", label: "Message",     route: "/messages",       icon: FiMessageSquare },
  CONTACT_US:     { dot: "#f43f5e", label: "Message",     route: "/messages",       icon: FiMessageSquare },
  MESSAGE:        { dot: "#f43f5e", label: "Message",     route: "/messages",       icon: FiMessageSquare },
  TESTIMONIAL:    { dot: "#a855f7", label: "Testimonial", route: "/testimonials",   icon: FiStar },
  TESTIMONIALS:   { dot: "#a855f7", label: "Testimonial", route: "/testimonials",   icon: FiStar },
  CERTIFICATION:  { dot: "#06b6d4", label: "Cert",        route: "/certifications", icon: FiAward },
  CERTIFICATIONS: { dot: "#06b6d4", label: "Cert",        route: "/certifications", icon: FiAward },
  ACHIEVEMENT:    { dot: "#f59e0b", label: "Achievement", route: "/achievements",   icon: FiTrendingUp },
  ACHIEVEMENTS:   { dot: "#f59e0b", label: "Achievement", route: "/achievements",   icon: FiTrendingUp },
};

const getTypeMeta = (type: string) =>
  TYPE_META[type?.toUpperCase()] ?? { dot: "#94a3b8", label: type, route: "/", icon: FiCode };

const relTime = (dateString: string): string => {
  const s = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 60) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d === 1) return "yesterday";
  if (d < 7)  return `${d}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const RecentActivitiesTemplate: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <div
        className="py-8 text-center rounded-xl"
        style={{ border: `1px dashed ${colors.neutral200}` }}
      >
        <div className="text-sm font-semibold" style={{ color: colors.neutral500 }}>
          No activity yet
        </div>
        <div className="text-xs mt-1" style={{ color: colors.neutral400 }}>
          Actions you take will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, i) => {
        const { dot, label, route, icon: Icon } = getTypeMeta(activity.type);
        const isLast = i === activities.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex gap-3 relative cursor-pointer group"
            style={{ paddingBottom: isLast ? 0 : 18 }}
            onClick={() => navigate(route)}
          >
            {/* Timeline connector */}
            {!isLast && (
              <div
                className="absolute left-[14px] top-8 bottom-0 w-px"
                style={{
                  background: isDark
                    ? `linear-gradient(to bottom, ${colors.neutral700}, transparent)`
                    : `linear-gradient(to bottom, ${colors.neutral200}, transparent)`,
                }}
              />
            )}

            {/* Icon container */}
            <div
              className="shrink-0 flex items-center justify-center rounded-lg mt-0.5 transition-transform duration-200 group-hover:scale-110"
              style={{
                width: 28,
                height: 28,
                background: `${dot}18`,
                color: dot,
              }}
            >
              <Icon size={12} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: dot }}
                >
                  {label}
                </span>
                <span className="text-[10px]" style={{ color: colors.neutral400 }}>
                  · {relTime(activity.timestamp)}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed line-clamp-2 group-hover:underline decoration-dotted underline-offset-2"
                style={{ color: colors.neutral600 }}
              >
                {activity.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecentActivitiesTemplate;
