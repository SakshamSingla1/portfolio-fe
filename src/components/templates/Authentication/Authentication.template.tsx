import React, { useEffect, type ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OnboardingSection from "./OnboardingSection.template";
import { AUTH_STATE, useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion } from "framer-motion";

interface AuthenticationTemplateProps {
  children: ReactNode;
  setAuthState: (authState: AUTH_STATE) => void;
}

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  children,
  setAuthState,
}) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isDesktopView, setIsDesktopView] = useState<boolean>(window.innerWidth >= 1024);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState<boolean>(!token);

  const onFlip = () => {
    if (!isDesktopView && !token) {
      setIsOnboardingVisible(false);
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    } else if (!isDesktopView && token) {
      setIsOnboardingVisible(false);
      setAuthState(AUTH_STATE.RESET_PASSWORD);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsDesktopView(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) setAuthState(AUTH_STATE.RESET_PASSWORD);
  }, [token, setAuthState]);

  const showOnboarding = isDesktopView || isOnboardingVisible;

  // Background is always dark — isDark just shifts the tone
  const pageBg = isDark
    ? `radial-gradient(ellipse at 30% 20%, #0a0f1e 0%, #010410 60%)`
    : `radial-gradient(ellipse at 30% 20%, #1e293b 0%, #020617 60%)`;

  return (
    <div
      style={{
        background: pageBg,
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[0]"
        style={{ backgroundImage: NOISE_SVG, opacity: isDark ? 0.06 : 0.04 }}
      />

      {/* Primary orb — top-left */}
      <motion.div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary500}30 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Primary orb — bottom-right */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary700}22 0%, transparent 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Subtle center glow */}
      <motion.div
        style={{
          position: "absolute",
          top: "40%",
          left: "40%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary600}14 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div
        className={`relative w-full flex md:w-10/12 lg:w-9/12 md:min-h-[650px] lg:min-h-[700px] mx-auto ${
          isDesktopView ? "flex-row items-stretch" : "flex-col items-center justify-center"
        }`}
        style={{ zIndex: 2 }}
      >
        {!isDesktopView && showOnboarding && (
          <div className="w-full flex justify-center items-center mt-4 mb-6">
            <div
              className="w-full overflow-hidden rounded-2xl shadow-2xl"
              style={{
                backgroundColor: "rgba(10,15,30,0.85)",
                backdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              <OnboardingSection onFlip={onFlip} />
            </div>
          </div>
        )}

        {isDesktopView && (
          <div className="w-full flex">
            <OnboardingSection onFlip={onFlip} />
          </div>
        )}

        {!(!isDesktopView && showOnboarding) && (
          <div
            className={`dark ${
              isDesktopView
                ? "w-full min-h-full rounded-tr-3xl rounded-br-3xl flex items-center justify-center p-10"
                : "w-full rounded-2xl p-6"
            }`}
            style={{
              backgroundColor: "rgba(12, 16, 32, 0.96)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(28px)",
              boxShadow: "0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationTemplate;
