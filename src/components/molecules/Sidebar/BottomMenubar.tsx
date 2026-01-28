import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { createUseStyles } from "react-jss";
import {
  FaHome,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaCog,
  FaEnvelope,
  FaUser,
  FaDumbbell,
  FaGlobe,
  FaLink,
  FaPaintRoller,
} from "react-icons/fa";
import { IoNotifications, IoDocuments, IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";

import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { enumToNormalKey } from "../../../utils/helper";
import { useColors } from "../../../utils/types";
import NavItem from "../NavItem/NavItem";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

const resolveRolePath = (rawPath: string, role?: string): string => {
  if (!rawPath || !role) return "";
  const cleanRole = role.toLowerCase();
  const cleanPath = rawPath.replace(/^\/+|\/+$/g, "");

  if (cleanPath.startsWith(`${cleanRole}/`)) return `/${cleanPath}`;
  if (cleanPath.includes("{role}"))
    return `/${cleanPath.replace("{role}", cleanRole)}`;

  return `/${cleanRole}/${cleanPath}`;
};

const iconMap: Record<string, JSX.Element> = {
  HOME: <FaHome />,
  EDUCATION: <FaGraduationCap />,
  EXPERIENCE: <FaBriefcase />,
  SKILLS: <FaDumbbell />,
  PROJECTS: <FaCode />,
  PROFILE: <FaUser />,
  GLOBE: <FaGlobe />,
  CONTACT_US: <FaEnvelope />,
  TEMPLATES: <IoNotifications />,
  COLOR_THEMES: <FaPaintRoller />,
  SETTINGS: <FaCog />,
  NAVLINKS: <FaLink />,
  RESUMES: <IoDocuments />,
  SOCIAL_LINKS: <IoLinkSharp />,
  CERTIFICATIONS: <GrCertificate />,
  TESTIMONIALS: <BsPersonVcard />,
};

/* ---------------------------------------------
   Styles
--------------------------------------------- */

const useStyles = createUseStyles({
  bar: (c: any) => ({
    position: "fixed",
    left: 12,
    right: 12,
    bottom: "env(safe-area-inset-bottom, 16px)",
    height: 84,
    padding: "0 8px",
    backdropFilter: "blur(14px)",
    background: "rgba(255, 255, 255, 0.21)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: 22,
    border: `1px solid ${c.neutral200}`,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
    zIndex: 1000,

    "@media (min-width: 768px)": {
      display: "none",
    },
  }),

  scrollContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    gap: 4,
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  item: {
    minWidth: 72,
    height: "100%",
    flexShrink: 0,
    scrollSnapAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",

    "&:active": {
      transform: "scale(0.95)",
    },
  },

  navItemWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

/* ---------------------------------------------
   Component
--------------------------------------------- */

const MobileBottomBar = () => {
  const { user, navlinks } = useAuthenticatedUser();
  const location = useLocation();
  const colors = useColors();
  const classes = useStyles(colors);

  const role = user?.role === "SUPER_ADMIN" ? "ADMIN" : user?.role;

  const menuItems = useMemo(() => {
    if (!Array.isArray(navlinks)) return [];
    return [...navlinks].sort(
      (a: any, b: any) => (a.index ?? 999) - (b.index ?? 999)
    );
  }, [navlinks]);

  return (
    <div className={classes.bar}>
      <div className={classes.scrollContainer}>
        {menuItems.map((item: any) => {
          const path = resolveRolePath(item.path, role);
          const active = location.pathname.startsWith(path);

          return (
            <div key={item.name} className={classes.item}>
              <div className={classes.navItemWrapper}>
                <NavItem
                  to={path}
                  icon={iconMap[item.name]}
                  label={enumToNormalKey(item.name)}
                  active={active}
                  collapsed
                  colors={colors}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;
