import React, { useState, useCallback } from "react";
import Sidebar from "../components/molecules/Sidebar/Sidebar";
import Topbar from "../components/molecules/Topbar/Topbar";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { getColor } from "../utils/helper";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const useStyles = createUseStyles({
  layoutWrapper: (c: any) => ({
    display: "flex",
    height: "100vh",
    background: c.neutral50,
    color: c.neutral800,
  }),
  sidebarWrapper: {
    position: "relative",
    transition: "width 0.28s ease",
  },
  collapseBtn: (c: any) => ({
    position: "absolute",
    top: "50%",
    right: -12, // Overlaps sidebar’s right border
    transform: "translateY(-50%)",
    width: 28,
    height: 28,
    borderRadius: 14,
    background: c.neutral0,
    border: `1px solid ${c.neutral200}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.2s",
    "&:hover": {
      background: c.neutral200,
    },
  }),
  contentWrapper: (c: any) => ({
    flexGrow: 1,
    background: c.neutral0,
    borderLeft: `1px solid ${c.neutral200}`,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  }),
  mainContent: {
    flexGrow: 1,
    padding: 24,
    overflow: "auto",
  },
});

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
    neutral0: "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
  };

  const classes = useStyles(colors);

  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={classes.layoutWrapper}>
      {/* SIDEBAR */}
      <div
        className={classes.sidebarWrapper}
        style={{ width: collapsed ? 64 : 240 }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Collapse / Expand Button on left vertical center */}
        <div className={classes.collapseBtn} onClick={handleToggleSidebar}>
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={classes.contentWrapper}>
        <Topbar onToggleSidebar={handleToggleSidebar} />
        <div className={classes.mainContent}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
