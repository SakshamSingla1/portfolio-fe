import React from "react";
import {
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaEnvelope,
  FaUser,
  FaDumbbell,
} from "react-icons/fa";
import { IoDocuments, IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { FiInbox } from "react-icons/fi";
import { useColors } from "../../../utils/types";

const iconMap: Record<string, React.ReactNode> = {
  EDUCATION: <FaGraduationCap />,
  EXPERIENCE: <FaBriefcase />,
  SKILLS: <FaDumbbell />,
  PROJECTS: <FaCode />,
  PROFILE: <FaUser />,
  CONTACT_US: <FaEnvelope />,
  RESUMES: <IoDocuments />,
  SOCIAL_LINKS: <IoLinkSharp />,
  CERTIFICATIONS: <GrCertificate />,
  TESTIMONIALS: <BsPersonVcard />,
  ACHIEVEMENTS: <GiAchievement />,
  MESSAGES: <FiInbox />,
};

interface IActivity {
  type: string;
  description: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: IActivity[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActivityMeta = (type: string) => {
  const upperType = type?.toUpperCase();

  const base = {
    ring: "ring-4 ring-white",
  };

  switch (upperType) {
    case "PROFILE":
      return { ...base, color: "bg-sky-500", light: "bg-sky-100 text-sky-600", border: "border-sky-500", icon: iconMap.PROFILE };

    case "EDUCATION":
      return { ...base, color: "bg-indigo-500", light: "bg-indigo-100 text-indigo-600", border: "border-indigo-500", icon: iconMap.EDUCATION };

    case "EXPERIENCE":
      return { ...base, color: "bg-orange-500", light: "bg-orange-100 text-orange-600", border: "border-orange-500", icon: iconMap.EXPERIENCE };

    case "SKILLS":
      return { ...base, color: "bg-teal-500", light: "bg-teal-100 text-teal-600", border: "border-teal-500", icon: iconMap.SKILLS };

    case "PROJECTS":
      return { ...base, color: "bg-blue-500", light: "bg-blue-100 text-blue-600", border: "border-blue-500", icon: iconMap.PROJECTS };

    case "CONTACT":
    case "CONTACT_US":
      return { ...base, color: "bg-rose-500", light: "bg-rose-100 text-rose-600", border: "border-rose-500", icon: iconMap.CONTACT_US };

    case "TESTIMONIAL":
    case "TESTIMONIALS":
      return { ...base, color: "bg-purple-500", light: "bg-purple-100 text-purple-600", border: "border-purple-500", icon: iconMap.TESTIMONIALS };

    case "CERTIFICATION":
    case "CERTIFICATIONS":
      return { ...base, color: "bg-cyan-500", light: "bg-cyan-100 text-cyan-600", border: "border-cyan-500", icon: iconMap.CERTIFICATIONS };

    case "ACHIEVEMENT":
    case "ACHIEVEMENTS":
      return { ...base, color: "bg-emerald-500", light: "bg-emerald-100 text-emerald-600", border: "border-emerald-500", icon: iconMap.ACHIEVEMENTS };

    case "MESSAGE":
    case "MESSAGES":
      return { ...base, color: "bg-pink-500", light: "bg-pink-100 text-pink-600", border: "border-pink-500", icon: iconMap.MESSAGES };

    default:
      return { ...base, color: "bg-gray-500", light: "bg-gray-100 text-gray-600", border: "border-gray-400", icon: iconMap.PROFILE };
  }
};

const RecentActivitiesTemplate: React.FC<RecentActivitiesProps> = ({
  activities,
}) => {
  const colors = useColors();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold" style={{ color: colors.primary900 }}>
            Recent Activities
          </div>
          <div className="text-xs mt-1" style={{ color: colors.neutral500 }}>
            Track all updates and changes
          </div>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full"
          style={{
            background: colors.primary100,
            color: colors.primary700,
          }}
        >
          {activities.length} Update{activities.length !== 1 ? "s" : ""}
        </div>
      </div>
      {activities.length === 0 ? (
        <div className="py-10 text-center rounded-xl border"
          style={{
            borderColor: colors.neutral300,
            color: colors.neutral500,
          }}
        >
          🚀 No recent activities yet.
        </div>
      ) : (
        <div className="relative pl-10 pt-4 space-y-8 max-h-[450px] overflow-y-auto pr-2">
          <div className="absolute left-15 top-1 bottom-1 w-[2px] rounded-full mt-8"
            style={{
              background: `linear-gradient(to bottom, ${colors.primary200}, ${colors.primary400})`,
            }}
          />
          {activities.map((activity, index) => {
            const { color, light, border, icon, ring } = getActivityMeta(activity.type);
            return (
              <div key={index} className="relative flex items-center gap-4 group">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-110 ${color} ${ring}`}
                  style={{ boxShadow: `0 0 0 4px ${colors.neutral50}` }}
                >
                  <div className="text-xl">{icon}</div>
                </div>
                <div className={`flex-1 rounded-2xl p-4 border ${border}`}
                  style={{ background: "#ffffff" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full ${light}`}>
                      {activity.type}
                    </div>
                    <div className="text-xs" style={{ color: colors.neutral400 }}>
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: colors.neutral700 }}>
                    {activity.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesTemplate;
