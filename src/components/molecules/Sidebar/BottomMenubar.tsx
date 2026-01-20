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
import { IoNotifications , IoDocuments } from "react-icons/io5";

import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { enumToNormalKey } from "../../../utils/helper";
import { useColors } from "../../../utils/types";
import NavItem from "../NavItem/NavItem";

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
};

const useStyles = createUseStyles({
  bar: (c: any) => ({
    position: "fixed",
    left: 12,
    right: 12,
    bottom: 16,
    height: 84,
    background: "#fff",
    borderRadius: 20,
    border: `1px solid ${c.neutral200}`,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    zIndex: 1000,

    "@media (min-width: 768px)": {
      display: "none",
    },
  }),

  scrollContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  item: {
    minWidth: 100,
    flexShrink: 0,
    textAlign: "center",
    fontSize: 14,
    paddingTop: 8,
    cursor: "pointer",
  },
});

const MobileBottomBar = () => {
  const { user, navlinks } = useAuthenticatedUser();
  const location = useLocation();
  const colors = useColors();

  const role = user?.role === "SUPER_ADMIN" ? "ADMIN" : user?.role;

  const classes = useStyles(colors);

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
            <div
              key={item.name}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NavItem
                to={path}
                icon={iconMap[item.name]}
                label={enumToNormalKey(item.name)}
                active={active}
                collapsed
                colors={colors}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;
