import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor } from "../../../utils/helper";
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
  home: <FaHome />,
  education: <FaGraduationCap />,
  experience: <FaBriefcase />,
  skills: <FaCode />,
  fitness: <FaDumbbell />,
  globe: <FaGlobe />,
  profile: <FaUser />,
  contact: <FaEnvelope />,
  settings: <FaCog />,
};

const useStyles = createUseStyles({
  sidebar: (c: any) => ({
    width: c.collapsed ? 72 : 240,
    background: c.neutral0,
    borderRight: `1px solid ${c.neutral200}`,
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
  footer: (c: any) => ({
    borderTop: `1px solid ${c.neutral200}`,
  }),
  footerBtn: (c: any) => ({
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    color: c.neutral700,
    "&:hover": {
      background: c.neutral50,
      color: c.primary700,
    },
  }),
});

const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed }) => {
  const { user, defaultTheme, navlinks, logout } = useAuthenticatedUser();
  const location = useLocation();
  const navigate = useNavigate();

  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary100: getColor(defaultTheme, "primary100") ?? "#E0E7FF",
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
    neutral0: "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
    neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
  };

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
          if (!item?.path || !user?.role) return null;

          const fullPath = resolveRolePath(item.path, user.role);
          const isActive =
            location.pathname === fullPath ||
            location.pathname.startsWith(`${fullPath}/`);

          return (
            <NavItem
              key={item.name}
              to={fullPath}
              label={item.name}
              icon={iconMap[item.icon ?? "home"]}
              active={isActive}
              collapsed={collapsed}
              colors={colors}
            />
          );
        })}
      </nav>

      <div className={classes.footer}>
        <div
          className={classes.footerBtn}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <FaUser />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
