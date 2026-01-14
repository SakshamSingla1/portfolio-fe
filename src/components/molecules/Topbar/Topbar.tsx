import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { FiMenu, FiChevronRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getBreadcrumbsFromUrl, getColor } from "../../../utils/helper";

const useStyles = createUseStyles({
  topbar: (c: any) => ({
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    borderBottom: `1px solid ${c.neutral200}`,
    background: c.neutral0,
    gap: 12,
    position: "sticky",
    top: 0,
    zIndex: 50,
  }),

  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    overflow: "hidden",
  },

  menuBtn: (c: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
    color: c.neutral800,
    transition: "all 0.2s",
    "&:hover": {
      background: c.neutral50,
    },
  }),

  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    overflow: "hidden",
    gap: 4,
  },

  crumbBtn: (c: any) => ({
    background: "transparent",
    border: "none",
    padding: "2px 6px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    color: c.primary500,
    whiteSpace: "nowrap",
    fontWeight: 500,
    transition: "all 0.2s",
    "&:hover": {
      background: c.primary50,
      color: c.primary700,
    },
    "&:focus-visible": {
      outline: `2px solid ${c.primary500}`,
      outlineOffset: 2,
    },
  }),

  crumbCurrent: (c: any) => ({
    fontSize: 13,
    fontWeight: 600,
    color: c.neutral800,
    padding: "2px 6px",
    whiteSpace: "nowrap",
  }),

  separator: (c: any) => ({
    display: "inline-flex",
    alignItems: "center",
    margin: "0 4px",
    color: c.neutral800,
    opacity: 0.4,
  }),

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  iconBtn: (c: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    background: c.neutral50,
    border: `1px solid ${c.neutral200}`,
    color: c.neutral800,
    transition: "all 0.2s",
    "&:hover": {
      background: c.neutral200,
    },
  }),

  profileMenu: {
    position: "relative",
  },

  dropdown: (c: any) => ({
    position: "absolute",
    top: 40,
    right: 0,
    background: c.neutral0,
    border: `1px solid ${c.neutral200}`,
    borderRadius: 6,
    boxShadow: `0 4px 12px ${c.neutral200}`,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    minWidth: 120,
    zIndex: 100,
  }),

  dropdownItem: (c: any) => ({
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
    color: c.neutral800,
    borderRadius: 4,
    transition: "all 0.2s",
    "&:hover": {
      background: c.neutral50,
    },
  }),
});

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const breadcrumbs = useMemo(() => getBreadcrumbsFromUrl(location.pathname), [location.pathname]);

  return (
    <header className={classes.topbar}>
      {/* LEFT: Menu & Breadcrumbs */}
      <div className={classes.left}>
        <button className={classes.menuBtn} onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <FiMenu size={18} />
        </button>

        <nav className={classes.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                {isLast ? (
                  <span className={classes.crumbCurrent}>{crumb.label}</span>
                ) : (
                  <button className={classes.crumbBtn} onClick={() => navigate(crumb.path)}>
                    {crumb.label}
                  </button>
                )}
                {!isLast && <span className={classes.separator}><FiChevronRight size={12} /></span>}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Topbar;
