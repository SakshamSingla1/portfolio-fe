import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/molecules/Sidebar/Sidebar";
import { createUseStyles } from "react-jss";
import {
  FiBell, FiSun, FiMoon,
  FiLogOut, FiSettings, FiUser, FiSearch, FiLayout, FiMenu
} from "react-icons/fi";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "../utils/types";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { useTheme } from "../contexts/ThemeContext";
import { getBreadcrumbsFromUrl } from "../utils/helper";

const useStyles = createUseStyles({
  layoutWrapper: (c: any) => ({
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: c.neutral50,
    color: c.neutral800,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "fixed",
      inset: 0,
      opacity: 0.03,
      pointerEvents: "none",
      zIndex: 1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }
  }),

  ambientGlow: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 0,
  },

  glow1: (c: any) => ({
    position: "absolute",
    top: "-5%",
    right: "-5%",
    width: "40vw",
    height: "40vw",
    background: `radial-gradient(circle, ${c.primary500}10 0%, transparent 70%)`,
    filter: "blur(80px)",
    borderRadius: "50%",
  }),

  glow2: (c: any) => ({
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "35vw",
    height: "35vw",
    background: `radial-gradient(circle, ${c.accent500}10 0%, transparent 70%)`,
    filter: "blur(80px)",
    borderRadius: "50%",
  }),

  sidebarWrapper: (c: any) => ({
    position: c.isMobile ? "fixed" : "sticky",
    top: 0,
    left: 0,
    height: "100vh",
    flexShrink: 0,
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: c.isMobile ? 200 : 100,
    transform: c.isMobile ? (c.isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
    display: "flex",
    flexDirection: "column",
    width: 260,
  }),

  contentWrapper: () => ({
    flexGrow: 1,
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    zIndex: 5,
  }),

  header: (c: any) => ({
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "12px 16px 8px",
    padding: "0 20px",
    background: `${c.neutral0}aa`,
    backdropFilter: "blur(16px)",
    border: `1px solid ${c.neutral200}40`,
    borderRadius: 20,
    position: "sticky",
    top: 12,
    zIndex: 50,
    boxShadow: `0 8px 32px ${c.neutral900}05`,
    transition: "all 0.3s ease",
  }),

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },

  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: (c: any) => c.neutral500,
  },

  breadcrumbItem: (c: any) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      color: c.primary600,
    },
    "&.active": {
      color: c.neutral800,
      fontWeight: 600,
      cursor: "default",
    }
  }),

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  iconButton: (c: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: c.neutral600,
    transition: "all 0.3s ease",
    "&:hover": {
      background: `${c.primary500}10`,
      color: c.primary600,
      transform: "translateY(-2px)",
    },
  }),

  notificationBadge: {
    position: "relative",
  },

  notificationDot: (c: any) => ({
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: c.primary500,
    border: `2px solid ${c.neutral0}`,
  }),

  userDropdownTrigger: () => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 6px 4px 12px",
    transition: "all 0.3s ease",
  }),

  userAvatar: (c: any) => ({
    width: 34,
    height: 34,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${c.primary500}, ${c.primary600})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    boxShadow: `0 4px 12px ${c.primary500}30`,
  }),

  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: (c: any) => c.neutral800,
  },

  dropdownMenu: (c: any) => ({
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    width: 240,
    background: `${c.neutral0}`,
    backdropFilter: "blur(20px)",
    border: `1px solid ${c.neutral200}80`,
    borderRadius: 18,
    boxShadow: `0 16px 48px ${c.neutral900}15`,
    padding: "8px",
    zIndex: 100,
    overflow: "hidden",
  }),

  dropdownHeader: (c: any) => ({
    padding: "12px 16px",
    borderBottom: `1px solid ${c.neutral200}40`,
    marginBottom: 4,
  }),

  dropdownItem: (c: any) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 12,
    color: c.neutral700,
    transition: "all 0.2s ease",
    "&:hover": {
      background: c.neutral50,
      color: c.primary600,
      paddingLeft: 18,
    },
  }),

  mainContent: (c: any) => ({
    flexGrow: 1,
    padding: "12px 16px 20px",
    overflowX: "hidden",
    overflowY: "auto",
    position: "relative",
    zIndex: 1,
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
});

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const colors = useColors();
  const classes = useStyles({ ...colors, isMobile, isSidebarOpen });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthenticatedUser();
  const { isDark, setColorMode, isPreviewActive, activeThemeName, resetTheme } = useTheme();

  const breadcrumbs = useMemo(() => getBreadcrumbsFromUrl(location.pathname), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setColorMode(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropdownOpen && !(e.target as HTMLElement).closest(`.${classes.userDropdownTrigger}`)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen, classes.userDropdownTrigger]);

  return (
    <div className={classes.layoutWrapper}>
      {/* Ambient background effects */}
      <div className={classes.ambientGlow}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={classes.glow1}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.6, 0.4, 0.6],
            rotate: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={classes.glow2}
        />
      </div>

      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(2px)",
              zIndex: 150,
            }}
          />
        )}
      </AnimatePresence>

      <div className={classes.sidebarWrapper}>
        <Sidebar collapsed={false} setCollapsed={() => { }} />
      </div>

      <div className={classes.contentWrapper}>
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            {isMobile && (
              <button
                className={classes.iconButton}
                onClick={() => setIsSidebarOpen(true)}
                style={{ marginRight: 8 }}
                title="Open Menu"
              >
                <FiMenu size={20} />
              </button>
            )}
            <div className={classes.breadcrumbs}>
              <FiLayout size={16} style={{ color: colors.primary500 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.path}>
                      {index > 0 && <span style={{ opacity: 0.3 }}>/</span>}
                      <span
                        className={`${classes.breadcrumbItem} ${isLast ? 'active' : ''}`}
                        onClick={() => !isLast && navigate(crumb.path)}
                      >
                        {crumb.label}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </div>

          <div className={classes.headerRight}>
            <button className={classes.iconButton} title="Global Search">
              <FiSearch size={20} />
            </button>

            <button className={classes.iconButton} onClick={toggleTheme} title="Toggle Theme">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div className={classes.notificationBadge}>
              <button className={classes.iconButton} title="Notifications">
                <FiBell size={20} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={classes.notificationDot}
                />
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <div
                className={classes.userDropdownTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={classes.userAvatar}>
                  {(user as any)?.profileImageUrl ? (
                    <img src={(user as any).profileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{user?.fullName?.split(" ").map((n: string) => n[0]).join("") || "U"}</span>
                  )}
                </div>
                {!isMobile && (
                  <>
                    <span className={classes.userName}>{user?.fullName?.split(" ")[0]}</span>
                  </>
                )}
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={classes.dropdownMenu}
                  >
                    <div className={classes.dropdownHeader}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.neutral800 }}>{user?.fullName}</div>
                      <div style={{ fontSize: 12, color: colors.neutral500 }}>{user?.email}</div>
                    </div>

                    <button className={classes.dropdownItem} onClick={() => navigate("/profile")}>
                      <FiUser size={16} />
                      My Profile
                    </button>

                    <button className={classes.dropdownItem} onClick={() => navigate("/settings")}>
                      <FiSettings size={16} />
                      Dashboard Settings
                    </button>

                    <div style={{ padding: "0 8px", margin: "4px 0" }}>
                      <div style={{ height: 1, background: `${colors.neutral200}40`, width: "100%" }} />
                    </div>

                    <button
                      className={classes.dropdownItem}
                      onClick={handleLogout}
                      style={{ color: colors.error600 }}
                    >
                      <FiLogOut size={16} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className={classes.mainContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ minHeight: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
