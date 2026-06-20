import React from "react";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";

interface IActivity {
  type: string;
  description: string;
  timestamp: string;
  entityId?: string;
}

interface RecentActivitiesProps {
  activities: IActivity[];
}

const TYPE_META: Record<string, { dot: string; label: string; route: string }> = {
  PROFILE:        { dot: "#0ea5e9", label: "Profile",      route: "/profile" },
  EDUCATION:      { dot: "#6366f1", label: "Education",    route: "/education" },
  EXPERIENCE:     { dot: "#f97316", label: "Experience",   route: "/experience" },
  SKILLS:         { dot: "#10b981", label: "Skills",       route: "/skills" },
  SKILL:          { dot: "#10b981", label: "Skills",       route: "/skills" },
  PROJECTS:       { dot: "#3b82f6", label: "Projects",     route: "/projects" },
  PROJECT:        { dot: "#3b82f6", label: "Projects",     route: "/projects" },
  CONTACT:        { dot: "#f43f5e", label: "Message",      route: "/messages" },
  CONTACT_US:     { dot: "#f43f5e", label: "Message",      route: "/messages" },
  MESSAGE:        { dot: "#f43f5e", label: "Message",      route: "/messages" },
  TESTIMONIAL:    { dot: "#a855f7", label: "Testimonial",  route: "/testimonials" },
  TESTIMONIALS:   { dot: "#a855f7", label: "Testimonial",  route: "/testimonials" },
  CERTIFICATION:  { dot: "#06b6d4", label: "Cert",         route: "/certifications" },
  CERTIFICATIONS: { dot: "#06b6d4", label: "Cert",         route: "/certifications" },
  ACHIEVEMENT:    { dot: "#f59e0b", label: "Achievement",  route: "/achievements" },
  ACHIEVEMENTS:   { dot: "#f59e0b", label: "Achievement",  route: "/achievements" },
};

const getTypeMeta = (type: string) =>
  TYPE_META[type?.toUpperCase()] ?? { dot: "#94a3b8", label: type, route: "/" };

const getRelativeTime = (dateString: string): string => {
  const now  = Date.now();
  const then = new Date(dateString).getTime();
  const s    = Math.floor((now - then) / 1000);
  const m    = Math.floor(s / 60);
  const h    = Math.floor(m / 60);
  const d    = Math.floor(h / 24);

  if (s < 60)  return "just now";
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (d === 1) return "yesterday";
  if (d < 7)   return `${d}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const RecentActivitiesTemplate: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <div
        className="py-8 text-center rounded-xl text-sm"
        style={{ color: colors.neutral400, border: `1px dashed ${colors.neutral200}` }}
      >
        No activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, i) => {
        const { dot, label, route } = getTypeMeta(activity.type);
        const isLast = i === activities.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex gap-3 relative cursor-pointer group"
            style={{ paddingBottom: isLast ? 0 : 16 }}
            onClick={() => navigate(route)}
          >
            {/* Timeline line */}
            {!isLast && (
              <div
                className="absolute left-[7px] top-5 bottom-0 w-px"
                style={{
                  background: isDark
                    ? `linear-gradient(to bottom, ${colors.neutral700}, transparent)`
                    : `linear-gradient(to bottom, ${colors.neutral200}, transparent)`,
                }}
              />
            )}

            {/* Dot */}
            <div className="shrink-0 mt-1" style={{ width: 15, height: 15 }}>
              <div
                className="rounded-full transition-transform duration-200 group-hover:scale-125"
                style={{ width: 15, height: 15, background: dot, boxShadow: `0 0 0 3px ${dot}22` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: dot }}
                >
                  {label}
                </span>
                <span className="text-[10px]" style={{ color: colors.neutral400 }}>
                  · {getRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed line-clamp-2 group-hover:underline decoration-dotted"
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
