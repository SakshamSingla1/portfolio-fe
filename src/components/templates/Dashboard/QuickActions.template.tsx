import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap, FaBriefcase, FaCode, FaDumbbell,
} from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Project",       subLabel: "Add to portfolio",  icon: FaCode,          route: "/projects",       dot: "#8b5cf6", matchKey: "project" },
  { label: "Skill",         subLabel: "Technical skills",  icon: FaDumbbell,      route: "/skills",         dot: "#6366f1", matchKey: "skill" },
  { label: "Experience",    subLabel: "Work history",      icon: FaBriefcase,     route: "/experience",     dot: "#10b981", matchKey: "experience" },
  { label: "Education",     subLabel: "Academic record",   icon: FaGraduationCap, route: "/education",      dot: "#3b82f6", matchKey: "education" },
  { label: "Certification", subLabel: "Certificates",      icon: GrCertificate,   route: "/certifications", dot: "#06b6d4", matchKey: "certification" },
  { label: "Achievement",   subLabel: "Milestones",        icon: GiAchievement,   route: "/achievements",   dot: "#f59e0b", matchKey: "achievement" },
  { label: "Social Link",   subLabel: "Online presence",   icon: IoLinkSharp,     route: "/social-links",   dot: "#ec4899", matchKey: "social" },
  { label: "Testimonial",   subLabel: "Recommendations",   icon: BsPersonVcard,   route: "/testimonials",   dot: "#f43f5e", matchKey: "testimonial" },
] as const;

interface QuickActionsProps {
  /** Profile-completion "missing" descriptions (e.g. "Add at least one project") — when
   * provided, the matching quick actions are surfaced first and flagged as recommended,
   * turning a static grid into "here's what to do next" instead of a fixed menu. */
  missingSections?: string[];
}

const QuickActionsTemplate: React.FC<QuickActionsProps> = ({ missingSections }) => {
  const navigate = useNavigate();
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const missingKeys = (missingSections ?? []).map((m) => m.toLowerCase());
  const isMissing = (matchKey: string) => missingKeys.some((m) => m.includes(matchKey));

  const orderedActions = [...QUICK_ACTIONS].sort((a, b) => {
    const aMissing = isMissing(a.matchKey) ? 0 : 1;
    const bMissing = isMissing(b.matchKey) ? 0 : 1;
    return aMissing - bMissing;
  });

  return (
    <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-2.5`}>
      {orderedActions.map((action, i) => {
        const Icon = action.icon;
        const missing = isMissing(action.matchKey);
        return (
          <motion.button
            key={action.label}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(action.route)}
            className="group flex flex-col w-full text-left relative overflow-hidden"
            style={{
              padding: "16px 14px 14px",
              background: missing ? `${action.dot}08` : isDark ? colors.neutral100 : colors.neutral0,
              border: missing ? `1.5px solid ${action.dot}40` : `1.5px solid ${colors.neutral300}`,
              borderRadius: 14,
              cursor: "pointer",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = `${action.dot}55`;
              el.style.boxShadow = `0 6px 20px ${action.dot}22`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = missing ? `${action.dot}40` : colors.neutral200;
              el.style.boxShadow = "none";
            }}
          >
            {missing && (
              <div
                className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full"
                style={{ width: 16, height: 16, background: `${action.dot}18`, color: action.dot }}
                title="Missing from your portfolio"
              >
                <FiAlertCircle size={9} />
              </div>
            )}

            <div
              className="flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
              style={{ width: 44, height: 44, background: `${action.dot}18`, color: action.dot }}
            >
              <Icon size={18} />
            </div>

            <div className="mt-3 flex-1">
              <div
                className="font-black uppercase"
                style={{ fontSize: "8.5px", color: missing ? action.dot : colors.neutral400, letterSpacing: "0.1em" }}
              >
                {missing ? "Missing" : "Add"}
              </div>
              <div
                className="font-bold mt-0.5 leading-tight"
                style={{ fontSize: 13, color: colors.neutral800 }}
              >
                {action.label}
              </div>
              <div className="mt-0.5" style={{ fontSize: "10px", color: colors.neutral400 }}>
                {action.subLabel}
              </div>
            </div>

            <div className="mt-2.5 flex items-center">
              <div
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ color: action.dot }}
              >
                <span style={{ fontSize: "10px", fontWeight: 700 }}>Go</span>
                <FiArrowRight size={10} />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActionsTemplate;
