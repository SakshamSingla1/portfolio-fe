import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap, FaBriefcase, FaCode, FaDumbbell,
} from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Education",     icon: FaGraduationCap, route: "/education",     dot: "#3b82f6" },
  { label: "Experience",    icon: FaBriefcase,     route: "/experience",     dot: "#10b981" },
  { label: "Skill",         icon: FaDumbbell,      route: "/skills",         dot: "#6366f1" },
  { label: "Project",       icon: FaCode,          route: "/projects",       dot: "#8b5cf6" },
  { label: "Social Link",   icon: IoLinkSharp,     route: "/social-links",   dot: "#ec4899" },
  { label: "Certification", icon: GrCertificate,   route: "/certifications", dot: "#06b6d4" },
  { label: "Testimonial",   icon: BsPersonVcard,   route: "/testimonials",   dot: "#f43f5e" },
  { label: "Achievement",   icon: GiAchievement,   route: "/achievements",   dot: "#f59e0b" },
] as const;

const QuickActionsTemplate: React.FC = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const { isDark } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2">
      {QUICK_ACTIONS.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            whileHover={{ y: -1 }}
            onClick={() => navigate(action.route)}
            className="group flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2.5 transition-all duration-200"
            style={{
              background: isDark ? colors.neutral100 : colors.neutral0,
              border: `1px solid ${colors.neutral200}`,
              cursor: "pointer",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${action.dot}60`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${action.dot}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = colors.neutral200;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            {/* Icon dot */}
            <div
              className="flex items-center justify-center rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ width: 32, height: 32, background: `${action.dot}18`, color: action.dot }}
            >
              <Icon size={13} />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium leading-tight truncate" style={{ color: colors.neutral700 }}>
                Add {action.label}
              </div>
            </div>

            {/* Arrow */}
            <FiArrowRight
              size={12}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ color: action.dot }}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActionsTemplate;
