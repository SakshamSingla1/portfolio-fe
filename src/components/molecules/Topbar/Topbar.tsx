import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";
import { FiChevronRight } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getBreadcrumbsFromUrl } from "../../../utils/helper";
import { useColors } from "../../../utils/types";

const useStyles = createUseStyles({
  topbar: (c: any) => ({
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    borderBottom: `1px solid ${c.neutral200}`,
    background: "#ffffff",
    gap: 12,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexShrink: 0,
  }),
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    overflow: "hidden",
    minHeight: 64,
  },

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

  logoutBtn: (c: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    cursor: "pointer",
    background: c.error50,
    border: `1px solid ${c.error200}`,
    color: c.error600,
    transition: "all 0.25s ease",

    "&:hover": {
      background: c.error200,
      color: c.error500,
      boxShadow: `0 6px 14px ${c.error500}30`,
      transform: "scale(1.05)",
    },

    "&:active": {
      transform: "scale(0.97)",
    },

    "&:focus-visible": {
      outline: `2px solid ${c.error500}`,
      outlineOffset: 2,
    },
  }),
});

const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthenticatedUser();

  const colors = useColors();
  const classes = useStyles(colors);

  const breadcrumbs = useMemo(
    () => getBreadcrumbsFromUrl(location.pathname),
    [location.pathname]
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getDashboardPath = (crumbLabel: string) => {
    const role = "admin";
    if (crumbLabel.toLowerCase() === role || crumbLabel.toLowerCase() === "admin") {
      return `/${role}/profile`;
    }
    return "";
  };

  return (
    <header className={classes.topbar}>
      <div className={classes.left}>
        <nav className={classes.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const dashboardPath = getDashboardPath(crumb.label);
            return (
              <React.Fragment key={crumb.path}>
                {isLast ? (
                  <span className={classes.crumbCurrent}>{crumb.label}</span>
                ) : (
                  <button
                    className={classes.crumbBtn}
                    onClick={() =>
                      navigate(dashboardPath || crumb.path)
                    }
                  >
                    {crumb.label}
                  </button>
                )}
                {!isLast && (
                  <span className={classes.separator}>
                    <FiChevronRight size={12} />
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className={classes.right}>
        <button
          className={classes.logoutBtn}
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <IoMdLogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
