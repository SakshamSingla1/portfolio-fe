import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  FiHome, FiBriefcase, FiLogOut
} from "react-icons/fi";
import { LuGraduationCap, LuFolderKanban, LuAward, LuShieldCheck } from "react-icons/lu";
import { TbCode, TbUser, TbMessageChatbot, TbBell, TbSettings, TbLink, TbShare, TbLayoutDashboard, TbUsers, TbHelp, TbIcons } from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { CgFileDocument } from "react-icons/cg";
import { createUseStyles } from "react-jss";
import { FaRegAddressCard } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import NavItem from "../NavItem/NavItem";
import { useColors } from "../../../utils/types";
import { enumToNormalKey } from "../../../utils/helper";

// Icon mapping for dynamic navigation items
const getIconForItem = (itemName: string) => {
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
  return iconMap[itemName] || <FiHome />;
};

const useStyles = createUseStyles({
  sidebar: (c: any) => ({
    width: c.collapsed ? 80 : 260,
    background: `${c.neutral0}cc`,
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: "100vh",
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRight: `1px solid ${c.neutral200}50`,
    position: "relative",
    zIndex: 100,
    overflow: "hidden",
  }),
  logoWrapper: (c: any) => ({
    height: 80,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: c.collapsed ? "center" : "flex-start",
    borderBottom: `1px solid ${c.neutral200}30`,
  }),
  nav: (c: any) => ({
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "12px 8px",
    minHeight: 0,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: `${c.primary500}40`,
      borderRadius: "10px",
      "&:hover": {
        background: `${c.primary500}60`,
      },
    },
  }),
  groupHeader: (c: any) => ({
    padding: "16px 12px 8px",
    fontSize: 10,
    fontWeight: 700,
    color: c.neutral400,
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    display: c.collapsed ? "none" : "block",
  }),
  groupSection: {
    marginBottom: 20,
  },
  footer: (c: any) => ({
    padding: "16px",
    background: `${c.neutral50}80`,
    backdropFilter: "blur(10px)",
    borderTop: `1px solid ${c.neutral200}40`,
    flexShrink: 0,
    marginTop: "auto",
  }),
  userCard: (c: any) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px",
    borderRadius: 16,
    background: c.collapsed ? "transparent" : `${c.neutral0}dd`,
    border: c.collapsed ? "none" : `1px solid ${c.neutral200}80`,
    marginBottom: 12,
    transition: "all 0.3s ease",
    boxShadow: c.collapsed ? "none" : `0 4px 12px ${c.neutral900}05`,
    "&:hover": {
      borderColor: c.primary500,
      transform: "translateY(-1px)",
      boxShadow: `0 8px 16px ${c.neutral900}10`,
    }
  }),
  avatar: (c: any) => ({
    width: 42,
    height: 42,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${c.primary500}, ${c.primary600})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: c.neutral0,
    fontWeight: 700,
    fontSize: 16,
    boxShadow: `0 4px 12px ${c.primary500}40`,
  }),
  logoutBtn: (c: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: c.collapsed ? "center" : "flex-start",
    width: "100%",
    padding: "12px",
    borderRadius: 14,
    background: "transparent",
    color: c.error600,
    border: `1px solid ${c.error500}20`,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    gap: 12,
    "&:hover": {
      background: c.error50,
      borderColor: c.error500,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${c.error500}15`,
    },
    "&:active": {
      transform: "scale(0.98)",
    }
  })
});

const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed }) => {
  const { user, rolePermissions, logout } = useAuthenticatedUser();
  const location = useLocation();

  const colors = useColors();
  const classes = useStyles({ ...colors, collapsed });

  // Create navigation groups from rolePermissions
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
    const navGroupSequence = {
      OVERVIEW: 1,
      CONTENT: 2,
      EXTRAS: 3,
      LINKS: 4,
      ADMINISTRATION: 5,
      SYSTEM: 6
    };

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
        <motion.div
          layout
          initial={false}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <motion.div
            layoutId="logo-icon"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.primary500}, ${colors.primary600})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 16px ${colors.primary500}30`,
              zIndex: 2
            }}
          >
            <span style={{ color: "white", fontWeight: 800, fontSize: 22 }}>S</span>
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: colors.neutral800,
                  margin: 0,
                  letterSpacing: "-0.5px"
                }}>Portfolio</h2>
                <p style={{
                  fontSize: 10,
                  color: colors.neutral500,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  margin: 0
                }}>Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <nav className={classes.nav}>
        {Object.entries(groupedMenuItems).map(([groupName, items]) => (
          <div key={groupName} className={classes.groupSection}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={classes.groupHeader}
                >
                  {groupName}
                </motion.div>
              )}
            </AnimatePresence>

            {items.map((item: any) => {
              if (!item?.path) return null;
              const fullPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
              const isActive = location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);

              return (
                <NavItem
                  key={item.name}
                  to={fullPath}
                  label={enumToNormalKey(item.name)}
                  icon={getIconForItem(item.name)}
                  active={isActive}
                  collapsed={collapsed}
                  colors={colors}
                />
              );
            })}
          </div>
        ))}
      </nav>

      <div className={classes.footer}>
        <div className={classes.userCard}>
          <div className={classes.avatar}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                style={{ flex: 1, overflow: "hidden" }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.neutral800, whiteSpace: "nowrap" }}>
                  {user?.fullName || 'User'}
                </div>
                <div style={{ fontSize: 11, color: colors.neutral500, whiteSpace: "nowrap" }}>
                  {user?.email || 'user@example.com'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className={classes.logoutBtn}
          onClick={logout}
          title="Sign out"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            width: "100%",
          }}
        >
          <FiLogOut size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
