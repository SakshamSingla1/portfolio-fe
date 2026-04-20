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

const quickActions = [
  {
    label: "Add Education",
    icon: FaGraduationCap,
    route: "/education",
    iconColor: "bg-indigo-50 text-indigo-600",
    borderColor: "border-indigo-200",
  },
  {
    label: "Add Experience",
    icon: FaBriefcase,
    route: "/experience",
    iconColor: "bg-orange-50 text-orange-600",
    borderColor: "border-orange-200",
  },
  {
    label: "Add Skill",
    icon: FaDumbbell,
    route: "/skills",
    iconColor: "bg-emerald-50 text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    label: "Add Project",
    icon: FaCode,
    route: "/projects",
    iconColor: "bg-blue-50 text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    label: "Add Social Link",
    icon: IoLinkSharp,
    route: "/social-links",
    iconColor: "bg-cyan-50 text-cyan-600",
    borderColor: "border-cyan-200",
  },
  {
    label: "Add Certification",
    icon: GrCertificate,
    route: "/certifications",
    iconColor: "bg-purple-50 text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    label: "Add Testimonial",
    icon: BsPersonVcard,
    route: "/testimonials",
    iconColor: "bg-pink-50 text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    label: "Add Achievement",
    icon: GiAchievement,
    route: "/achievements",
    iconColor: "bg-amber-50 text-amber-600",
    borderColor: "border-amber-200",
  },
];

const QuickActionsTemplate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.route)}
              className={`
                flex items-center justify-between
                rounded-lg
                px-3 py-2.5
                bg-white border ${action.borderColor}
              `}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`
                    w-9 h-9
                    rounded-md
                    flex items-center justify-center
                    ${action.iconColor}
                  `}
                >
                  <Icon size={15} />
                </div>
                <div className="text-xs font-normal text-gray-800 leading-tight">
                  {action.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsTemplate;
