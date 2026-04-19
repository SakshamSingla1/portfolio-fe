import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createUseStyles } from "react-jss";

export interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    collapsed?: boolean;
    colors: any;
}

const useStyles = createUseStyles({
    navItem: ({ colors, active, collapsed }: any) => ({
        display: "flex",
        alignItems: "center",
        padding: "12px 14px",
        margin: "4px 10px",
        borderRadius: "14px",
        textDecoration: "none",
        color: active ? colors.primary700 : colors.neutral600,
        background: active 
            ? `linear-gradient(135deg, ${colors.primary500}18, ${colors.primary600}08)` 
            : "transparent",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        minHeight: 50,
        gap: 14,
        cursor: "pointer",
        overflow: "hidden",
        border: `1px solid ${active ? `${colors.primary500}25` : "transparent"}`,
        boxShadow: active ? `0 6px 18px ${colors.primary500}10` : "none",
        "&:hover": {
            background: active ? `linear-gradient(135deg, ${colors.primary500}25, ${colors.primary600}15)` : `${colors.neutral200}30`,
            color: active ? colors.primary800 : colors.neutral800,
            transform: "translateX(4px)",
            "& $navIcon": {
                background: active ? colors.primary500 : `${colors.primary500}15`,
                color: active ? colors.neutral0 : colors.primary600,
                transform: "scale(1.1)",
            }
        },
        "&:active": {
            transform: "scale(0.97)",
        },
        ...(collapsed && {
            padding: 12,
            margin: "4px auto",
            justifyContent: "center",
            width: 52,
            minWidth: 52,
            gap: 0,
            "&:hover": {
                transform: "scale(1.08)",
            }
        })
    }),
    navIcon: ({ colors, active }: any) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        minWidth: 36,
        borderRadius: 10,
        background: active ? colors.primary500 : `${colors.neutral200}50`,
        color: active ? colors.neutral0 : colors.neutral500,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        fontSize: 19,
        boxShadow: active ? `0 6px 14px ${colors.primary500}40` : "none",
    }),
    navLabel: ({ active }: any) => ({
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
        flex: 1,
        letterSpacing: "0.2px",
    }),
    navIndicator: ({ colors }: any) => ({
        position: "absolute",
        left: 0,
        top: "20%",
        bottom: "20%",
        width: 4,
        background: colors.primary500,
        borderRadius: "0 4px 4px 0",
        boxShadow: `2px 0 10px ${colors.primary500}50`,
    }),
    activeGlow: ({ colors }: any) => ({
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 0% 50%, ${colors.primary500}15, transparent 70%)`,
        pointerEvents: "none",
    })
});

const NavItem: React.FC<NavItemProps> = ({
    to,
    icon,
    label,
    active = false,
    collapsed = false,
    colors,
}) => {
    const classes = useStyles({ colors, active, collapsed });

    return (
        <Link
            to={to}
            className={classes.navItem}
            title={collapsed ? label : ""}
        >
            {active && <div className={classes.activeGlow} />}
            
            <motion.div 
                className={classes.navIcon}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {icon}
            </motion.div>

            <AnimatePresence mode="wait">
                {!collapsed && (
                    <motion.span 
                        className={classes.navLabel}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>

            {active && (
                <motion.div 
                    className={classes.navIndicator} 
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            {active && collapsed && (
                <motion.div 
                    layoutId="active-dot-collapsed"
                    style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: colors.primary500,
                        boxShadow: `0 0 8px ${colors.primary500}`,
                        y: "-50%"
                    }}
                />
            )}
        </Link>
    );
};

export default NavItem;
