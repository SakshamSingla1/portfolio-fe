import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface INavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    collapsed: boolean;
    colors: any;
}

const NavItem: React.FC<INavItemProps> = ({
    to,
    icon,
    label,
    active,
    collapsed,
    colors,
}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <Link
            to={to}
            className="group relative flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            style={{
                background: active && !isMobile ? `linear-gradient(to right, ${colors.primary50}, ${colors.primary100})` : "",
                color: active ? colors.primary700 : colors.neutral800,
                justifyContent: collapsed ? "center" : "flex-start",
                borderLeft: active && !isMobile ? `4px solid ${colors.primary500}` : "",
            }}
            title={collapsed ? label : ""}
        >
            <div style={{ marginRight: collapsed ? 0 : 12, position: "relative" }}>
                <div
                    style={{
                        padding: 8,
                        borderRadius: 8,
                        background: active ? `${colors.primary500}20` : `${colors.neutral200}50`,
                        color: active ? colors.primary700 : colors.neutral800,
                        transform: active ? "scale(1.1)" : "",
                        transition: "all 0.3s",
                    }}
                >
                    {icon}
                </div>

                {active && (
                    <div
                        style={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            width: 12,
                            height: 12,
                            backgroundColor: colors.primary500,
                            borderRadius: "50%",
                            border: `2px solid ${colors.neutral50}`,
                            animation: "pulse 1s infinite",
                        }}
                    />
                )}
            </div>

            {!collapsed && (
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            fontWeight: 500,
                            color: active ? colors.primary700 : colors.neutral800,
                        }}
                    >
                        {label}
                    </span>

                    {active && (
                        <div style={{ display: "flex", gap: 2 }}>
                            {[0, 0.2, 0.4].map((d, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor: colors.primary500,
                                        borderRadius: "50%",
                                        animation: "pulse 1s infinite",
                                        animationDelay: `${d}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Link>
    );
}

export default NavItem;
