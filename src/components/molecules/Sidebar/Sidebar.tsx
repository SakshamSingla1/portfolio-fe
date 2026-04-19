import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { TbLayoutDashboard, TbCode, TbUser, TbMessageChatbot, TbBell, TbShare, TbLink, TbUsers, TbSettings, TbHelp, TbIcons } from "react-icons/tb";
import { FiBriefcase } from "react-icons/fi";
import { LuGraduationCap, LuFolderKanban, LuAward, LuShieldCheck} from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa6";
import { CgFileDocument } from "react-icons/cg";
import { GoTrophy } from "react-icons/go";
import { IoColorPaletteOutline } from "react-icons/io5";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { enumToNormalKey} from "../../../utils/helper";
import NavItem from "../NavItem/NavItem";
import { useColors } from "../../../utils/types";


const navGroupSequence = {
  OVERVIEW : 1,
  CONTENT : 2,
  EXTRAS : 3,
  LINKS : 4,
  ADMINISTRATION : 5,
  SYSTEM : 6
}

const iconMap: Record<string, JSX.Element> = {
  EDUCATION: <LuGraduationCap />,
  EXPERIENCE: <FiBriefcase />,
  SKILLS: <TbCode />,
  PROJECT: <LuFolderKanban />,
  PROFILE: <TbUser />,
  MESSAGES: <TbMessageChatbot />,
  NOTIFICATIONS: <TbBell />,
  THEMES: <IoColorPaletteOutline />,
  SETTINGS: <TbSettings />,
  NAV_LINKS: <TbLink />,
  RESUMES: <CgFileDocument />,
  SOCIAL_LINKS: <TbShare />,
  CERTIFICATIONS: <LuAward />,
  TESTIMONIALS: <FaRegAddressCard />,
  ACHIEVEMENTS: <GoTrophy />,
  DASHBOARD: <TbLayoutDashboard />,
  USERS: <TbUsers />,
  ROLES_AND_PERMISSIONS: <LuShieldCheck />,
  HELP: <TbHelp />,
  LOGOS: <TbIcons />
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
  groupHeader: (c: any) => ({
    padding: "12px 16px 8px",
    fontSize: 11,
    fontWeight: 600,
    color: c.neutral500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: c.collapsed ? "none" : "block",
  }),
  groupSection: {
    marginBottom: 16,
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
  const { rolePermissions } = useAuthenticatedUser();
  const location = useLocation();

  const colors = useColors();

  const classes = useStyles({ ...colors, collapsed });

  const groupedMenuItems = useMemo(() => {
    if (!rolePermissions?.navLinks) return {};
    
    const groups: Record<string, any[]> = {};
    
    rolePermissions.navLinks.forEach((item: any) => {
      const groupName = item.navGroup || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });
    
    const sortedGroups: Record<string, any[]> = {};
    Object.keys(navGroupSequence).forEach((key) => {
      if (groups[key]) {
        sortedGroups[key] = groups[key];
      }
    });
    Object.keys(groups).forEach((key) => {
      if (!(key in navGroupSequence)) {
        sortedGroups[key] = groups[key];
      }
    });
    
    // Sort items within each group
    Object.keys(sortedGroups).forEach((groupName) => {
      sortedGroups[groupName] = sortedGroups[groupName].sort(
        (a: any, b: any) => (parseInt(a.index) ?? 999) - (parseInt(b.index) ?? 999)
      );
    });
    
    return sortedGroups;
  }, [rolePermissions]);

  return (
    <aside className={classes.sidebar}>
      <div className={classes.logoWrapper}>
        {collapsed ? "PR" : "Portfolio"}
      </div>

      <nav className={classes.nav}>
        {Object.entries(groupedMenuItems).map(([groupName, items]) => (
          <div key={groupName} className={classes.groupSection}>
            {!collapsed && (
              <div className={classes.groupHeader}>
                {enumToNormalKey(groupName)}
              </div>
            )}
            {items.map((item: any) => {
              if (!item?.path) return null;

              const fullPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
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
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
