import React from "react";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FiUser, FiBook, FiBriefcase, FiZap, FiCode,
  FiMessageSquare, FiStar, FiAward, FiTrendingUp,
} from "react-icons/fi";
import { EmptyState } from "./shared/DashboardUI";
import { SECTION_COLORS } from "./shared/sectionColors";

interface IActivity {
  type: string;
  description: string;
  timestamp: string;
  entityId?: string;
}

interface RecentActivitiesProps {
  activities: IActivity[];
}

// Colors pulled from the shared SECTION_COLORS map -- this previously had its
// own ad hoc hex per category that didn't match Stats/QuickActions/ProfileCompletion
// (e.g. "Projects" was blue here but violet everywhere else), so the same
// content type read as a different color depending which widget you looked at.
const TYPE_META: Record<string, {
  dot: string; label: string; route: string;
  icon: React.ComponentType<{ size?: number }>;
}> = {
  PROFILE:        { dot: SECTION_COLORS.profile,       label: "Profile",     route: "/profile",        icon: FiUser },
  EDUCATION:      { dot: SECTION_COLORS.education,     label: "Education",   route: "/education",      icon: FiBook },
  EXPERIENCE:     { dot: SECTION_COLORS.experience,    label: "Experience",  route: "/experience",     icon: FiBriefcase },
  SKILLS:         { dot: SECTION_COLORS.skills,        label: "Skills",      route: "/skills",         icon: FiZap },
  SKILL:          { dot: SECTION_COLORS.skills,        label: "Skills",      route: "/skills",         icon: FiZap },
  PROJECTS:       { dot: SECTION_COLORS.projects,      label: "Projects",    route: "/projects",       icon: FiCode },
  PROJECT:        { dot: SECTION_COLORS.projects,      label: "Projects",    route: "/projects",       icon: FiCode },
  CONTACT:        { dot: SECTION_COLORS.messages,      label: "Message",     route: "/messages",       icon: FiMessageSquare },
  CONTACT_US:     { dot: SECTION_COLORS.messages,      label: "Message",     route: "/messages",       icon: FiMessageSquare },
  MESSAGE:        { dot: SECTION_COLORS.messages,      label: "Message",     route: "/messages",       icon: FiMessageSquare },
  TESTIMONIAL:    { dot: SECTION_COLORS.testimonials,  label: "Testimonial", route: "/testimonials",   icon: FiStar },
  TESTIMONIALS:   { dot: SECTION_COLORS.testimonials,  label: "Testimonial", route: "/testimonials",   icon: FiStar },
  CERTIFICATION:  { dot: SECTION_COLORS.certifications, label: "Cert",        route: "/certifications", icon: FiAward },
  CERTIFICATIONS: { dot: SECTION_COLORS.certifications, label: "Cert",        route: "/certifications", icon: FiAward },
  ACHIEVEMENT:    { dot: SECTION_COLORS.achievements,  label: "Achievement", route: "/achievements",   icon: FiTrendingUp },
  ACHIEVEMENTS:   { dot: SECTION_COLORS.achievements,  label: "Achievement", route: "/achievements",   icon: FiTrendingUp },
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
    return <EmptyState icon={<FiUser />} title="No activity yet" subtitle="Actions you take will appear here" />;
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, i) => {
        const { dot, label, route, icon: Icon } = getTypeMeta(activity.type);
        const isLast = i === activities.length - 1;

        const hoverBg = isDark ? `${dot}16` : `${dot}0D`;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ backgroundColor: hoverBg, transition: { duration: 0.2, ease: "easeOut" } }}
            className="flex gap-3 relative cursor-pointer group rounded-xl px-3 -mx-3"
            style={{ paddingBottom: isLast ? 0 : 22 }}
            onClick={() => navigate(route)}
          >
            {!isLast && (
              <div
                className="absolute left-[14px] top-8 bottom-0 w-px"
                style={{
                  background: isDark
                    ? `linear-gradient(to bottom, ${dot}66 0%, ${colors.neutral700} 40%, transparent 100%)`
                    : `linear-gradient(to bottom, ${dot}4D 0%, ${colors.neutral200} 40%, transparent 100%)`,
                }}
              />
            )}

            <div
              className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
              style={{
                width: 28,
                height: 28,
                background: `${dot}14`,
                border: `1px solid ${dot}25`,
                color: dot,
              }}
            >
              <Icon size={12} />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: dot }}>
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
