import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
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
import { IoNotifications , IoDocuments, IoLinkSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { BsPersonVcard } from "react-icons/bs";
import { GiAchievement } from "react-icons/gi";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { enumToNormalKey} from "../../../utils/helper";
import NavItem from "../NavItem/NavItem";
import { useColors } from "../../../utils/types";

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
  ACHIEVEMENTS: <GiAchievement />,
};

const useStyles = createUseStyles({
  sidebar: (c: any) => ({
    width: c.collapsed ? 72 : 240,
    background: c.neutral0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "width 0.28s ease",
  }),
  logoWrapper: (c: any) => ({
    height: 64,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 20,
    color: c.primary700,
    borderBottom: `1px solid ${c.neutral200}`,
  }),
  nav: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },
  footer: {
    padding: '0.5rem',
    marginTop: 'auto',
    marginBottom: '4rem',
  },
  logoutBtn: (colors: any) => ({
    position: "relative",
    overflow: "hidden",
    background: `linear-gradient(135deg, ${colors.error50}, ${colors.error100})`,
    color: colors.error600,
    borderLeft: `4px solid ${colors.error500}`,
    transition: "all 0.25s ease",
    '& div': {
      background: `${colors.error500}15 !important`,
      color: colors.error600,
      transition: "all 0.25s ease",
    },
    '&:hover': {
      background: `linear-gradient(135deg, ${colors.error100}, ${colors.error200})`,
      color: colors.error700,
      boxShadow: `0 6px 16px ${colors.error500}30`,
      '& div': {
        background: `${colors.error500}25 !important`,
        transform: "scale(1.1)",
      },
    },
    '&:active': {
      transform: "scale(0.98)",
      boxShadow: `0 3px 8px ${colors.error500}25`,
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.error500}`,
      outlineOffset: 2,
    },
    '&::after': {
      content: '""',
      position: "absolute",
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: colors.error500,
      animation: "pulse 1.4s infinite",
      opacity: 0.9,
    },
  })
});

const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed }) => {
  const { user, navlinks } = useAuthenticatedUser();
  const location = useLocation();

  const effectiveRole = useMemo(() => {
    return user?.role === 'SUPER_ADMIN' ? 'ADMIN' : user?.role;
  }, [user?.role]);

  const colors = useColors();

  const classes = useStyles({ ...colors, collapsed });

  const menuItems = useMemo(() => {
    if (!Array.isArray(navlinks)) return [];
    return [...navlinks].sort(
      (a: any, b: any) => (a.index ?? 999) - (b.index ?? 999)
    );
  }, [navlinks]);

  return (
    <aside className={classes.sidebar}>
      <div className={classes.logoWrapper}>
        {collapsed ? "PR" : "Portfolio"}
      </div>

      <nav className={classes.nav}>
        {menuItems.map((item: any) => {
          if (!item?.path) return null;

          const fullPath = resolveRolePath(item.path, effectiveRole);
          const isActive =
            location.pathname === fullPath ||
            location.pathname.startsWith(`${fullPath}/`);

          return (
            <NavItem
              key={item.name}
              to={fullPath}
              label={enumToNormalKey(item.name)}
              icon={iconMap[item.name ?? "home"]}
              active={isActive}
              collapsed={collapsed}
              colors={colors}
            />
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
