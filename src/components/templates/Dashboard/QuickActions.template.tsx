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
import { useIsMobile } from "../../../hooks/useIsMobile";
import { motion } from "framer-motion";
import { useGlassSurface } from "./shared/dashboardMotion";
import { SECTION_COLORS } from "./shared/sectionColors";

const QUICK_ACTIONS = [
  { label: "Project",       subLabel: "Add to portfolio",  icon: FaCode,          route: "/projects",       dot: SECTION_COLORS.projects,      matchKey: "project" },
  { label: "Skill",         subLabel: "Technical skills",  icon: FaDumbbell,      route: "/skills",         dot: SECTION_COLORS.skills,        matchKey: "skill" },
  { label: "Experience",    subLabel: "Work history",      icon: FaBriefcase,     route: "/experience",     dot: SECTION_COLORS.experience,    matchKey: "experience" },
  { label: "Education",     subLabel: "Academic record",   icon: FaGraduationCap, route: "/education",      dot: SECTION_COLORS.education,     matchKey: "education" },
  { label: "Certification", subLabel: "Certificates",      icon: GrCertificate,   route: "/certifications", dot: SECTION_COLORS.certifications, matchKey: "certification" },
  { label: "Achievement",   subLabel: "Milestones",        icon: GiAchievement,   route: "/achievements",   dot: SECTION_COLORS.achievements,  matchKey: "achievement" },
  { label: "Social Link",   subLabel: "Online presence",   icon: IoLinkSharp,     route: "/social-links",   dot: SECTION_COLORS.social,        matchKey: "social" },
  { label: "Testimonial",   subLabel: "Recommendations",   icon: BsPersonVcard,   route: "/testimonials",   dot: SECTION_COLORS.testimonials,  matchKey: "testimonial" },
] as const;

type QuickAction = (typeof QUICK_ACTIONS)[number];

interface QuickActionsProps {
  /** Profile-completion "missing" descriptions (e.g. "Add at least one project") — when
   * provided, the matching quick actions are surfaced first and flagged as recommended,
   * turning a static grid into "here's what to do next" instead of a fixed menu. */
  missingSections?: string[];
}

interface QuickActionTileProps {
  action: QuickAction;
  missing: boolean;
  index: number;
  onNavigate: (route: string) => void;
}

/** A single quick-action tile. Pulled into its own component so each one can
 * carry its own small, functional accent (icon color, "missing" badge) without
 * the whole tile's surface changing -- the surface itself is the same calm
 * `useGlassSurface` card every other dashboard panel uses, just with a
 * missing-item border tint swapped in when relevant. */
const QuickActionTile: React.FC<QuickActionTileProps> = ({ action, missing, index, onNavigate }) => {
  const colors = useColors();
  const surface = useGlassSurface();
  const Icon = action.icon;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      onClick={() => onNavigate(action.route)}
      className="group flex flex-col w-full text-left relative"
      style={{
        padding: "18px 16px 16px",
        background: surface.background,
        boxShadow: surface.boxShadow,
        border: missing ? `1.5px solid ${action.dot}40` : `1.5px solid ${colors.neutral300}`,
        borderRadius: 14,
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.2s",
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
        className="flex items-center justify-center rounded-xl"
        style={{ width: 44, height: 44, background: `${action.dot}12`, border: `1.5px solid ${action.dot}25` }}
      >
        <Icon size={18} style={{ color: action.dot }} />
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
};

const QuickActionsTemplate: React.FC<QuickActionsProps> = ({ missingSections }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const missingKeys = (missingSections ?? []).map((m) => m.toLowerCase());
  const isMissing = (matchKey: string) => missingKeys.some((m) => m.includes(matchKey));

  const orderedActions = [...QUICK_ACTIONS].sort((a, b) => {
    const aMissing = isMissing(a.matchKey) ? 0 : 1;
    const bMissing = isMissing(b.matchKey) ? 0 : 1;
    return aMissing - bMissing;
  });

  return (
    <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-3`}>
      {orderedActions.map((action, i) => (
        <QuickActionTile
          key={action.label}
          action={action}
          missing={isMissing(action.matchKey)}
          index={i}
          onNavigate={navigate}
        />
      ))}
    </div>
  );
};

export default QuickActionsTemplate;
