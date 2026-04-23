import React from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hover = false, style = {} }) => {
  const colors = useColors();

  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`relative p-5 rounded-[24px] border overflow-hidden transition-all duration-300 ${className}`}
      style={{
        backgroundColor: `${colors.neutral0}80`,
        borderColor: `${colors.neutral200}40`,
        backdropFilter: "blur(12px)",
        boxShadow: hover ? `0 20px 40px ${colors.neutral900}08` : "none",
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
