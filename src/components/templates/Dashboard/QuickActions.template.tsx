import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaDumbbell,
} from "react-icons/fa";
import { IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { useColors } from "../../../utils/types";

/* ================= Quick Action Config ================= */

const quickActions = [
  { label: "Add Education", icon: <FaGraduationCap />, route: "/admin/education", color: "bg-indigo-500" },
  { label: "Add Experience", icon: <FaBriefcase />, route: "/admin/experience", color: "bg-orange-500" },
  { label: "Add Skill", icon: <FaDumbbell />, route: "/admin/skills", color: "bg-teal-500" },
  { label: "Add Project", icon: <FaCode />, route: "/admin/projects", color: "bg-blue-500" },
  { label: "Add Social Link", icon: <IoLinkSharp />, route: "/admin/social-links", color: "bg-cyan-500" },
  { label: "Add Certification", icon: <GrCertificate />, route: "/admin/certifications", color: "bg-purple-500" },
  { label: "Add Testimonial", icon: <BsPersonVcard />, route: "/admin/testimonials", color: "bg-pink-500" },
  { label: "Add Achievement", icon: <GiAchievement />, route: "/admin/achievements", color: "bg-emerald-500" },
];

/* ================= Component ================= */

const QuickActionsTemplate: React.FC = () => {
  const navigate = useNavigate();
  const colors = useColors();

  return (
    <div>
      {/* ===== Header ===== */}
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ color: colors.primary900 }}
        >
          Quick Actions
        </h2>
        <p
          className="text-xs mt-1"
          style={{ color: colors.neutral500 }}
        >
          Quickly manage portfolio sections
        </p>
      </div>

      {/* ===== Action List ===== */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.route)}
            className="
              group relative
              flex items-center justify-between
              gap-4
              bg-white
              border border-gray-200
              rounded-xl
              px-4 py-3
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              
              {/* Icon Circle */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${action.color}
                  group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-sm">{action.icon}</div>
              </div>

              {/* Label */}
              <span
                className="text-sm font-medium"
                style={{ color: colors.neutral800 }}
              >
                {action.label}
              </span>
            </div>

            {/* Arrow Indicator */}
            <span
              className="text-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ color: colors.primary500 }}
            >
              →
            </span>

            {/* Subtle Hover Glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(145deg, ${colors.primary50}, transparent)`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsTemplate;
