import React, { useEffect, type ReactNode, useState } from "react";
import { createUseStyles } from "react-jss";
import OnboardingSection from "./OnboardingSection.template";
import { AUTH_STATE } from "../../../utils/types";
import { motion } from "framer-motion";

interface AuthenticationTemplateProps {
  children: ReactNode;
  setAuthState: (authState: AUTH_STATE) => void;
}

const useStyles = createUseStyles({
  background: {
    background: "radial-gradient(circle at 50% 50%, #0f172a, #020617)",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
});

const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  children,
  setAuthState,
}) => {
  const classes = useStyles();

  const [isDesktopView, setIsDesktopView] = useState<boolean>(window.innerWidth >= 1024);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState<boolean>(true);

  const onFlip = () => {
    if (!isDesktopView) {
      setIsOnboardingVisible(false);
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showOnboarding = isDesktopView || isOnboardingVisible;

  return (
    <div className={`${classes.background}`}>
      {/* Floating Glowing Orbs for a premium God-UI aesthetic */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div
        className={`relative z-10 w-full flex md:w-10/12 lg:w-9/12 md:min-h-[650px] lg:min-h-[700px] mx-auto 
        ${isDesktopView ? "flex-row items-stretch" : "flex-col items-center justify-center"}`}
      >
        {!isDesktopView && showOnboarding && (
          <div className="w-full flex justify-center items-center mt-4 mb-6">
            <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
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
            className={`
              bg-white/90 backdrop-blur-xl text-textSecondary border border-white/20 shadow-2xl
              ${isDesktopView
                ? "w-full min-h-full rounded-tr-3xl rounded-br-3xl flex items-center justify-center p-10"
                : "w-full rounded-2xl p-6"
              }
            `}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationTemplate;
