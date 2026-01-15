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
  FaLink,
  FaPaintRoller,
} from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor , enumToNormalKey} from "../../../utils/helper";
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
};

const useStyles = createUseStyles({
  sidebar: (c: any) => ({
    width: c.collapsed ? 64 : 240,
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
  footer: {
    padding: '0.5rem',
    marginTop: 'auto',
    marginBottom: '4rem',
  },
  logoutBtn: (colors: any) => ({
    '&': {
      background: `linear-gradient(to right, ${colors.primary50}, ${colors.primary100})`,
      color: colors.primary700,
      borderLeft: `4px solid ${colors.primary500}`,
      '& div': {
        background: `${colors.primary500}20 !important`,
      }
    },
    '&:hover, &:focus': {
      background: `linear-gradient(to right, ${colors.primary100}, ${colors.primary200})`,
      color: colors.primary700,
      '& div': {
        background: `${colors.primary500}20 !important`,
      }
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  })
});

const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed }) => {
  const { user, defaultTheme, navlinks, logout } = useAuthenticatedUser();
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveRole = useMemo(() => {
    return user?.role === 'SUPER_ADMIN' ? 'ADMIN' : user?.role;
  }, [user?.role]);

  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary100: getColor(defaultTheme, "primary100") ?? "#E0E7FF",
    primary200: getColor(defaultTheme, "primary200") ?? "#C7D2FE",
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

      <div className={classes.footer}>
        <button
          className={`group relative flex items-center p-3 w-full rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${classes.logoutBtn
            }`}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            color: colors.neutral800,
          }}
          title={collapsed ? "Logout" : ""}
        >
          <div style={{ marginRight: collapsed ? 0 : 12, position: "relative" }}>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                background: `${colors.neutral200}50`,
                color: colors.neutral800,
                transition: "all 0.3s",
              }}
              className="group-hover:bg-primary-100 group-hover:text-primary-600"
            >
              <IoMdLogOut />
            </div>
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 500 }}>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
