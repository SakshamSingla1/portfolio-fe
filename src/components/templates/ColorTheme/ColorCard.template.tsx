import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiStar,
  FiCopy,
  FiGrid,
  FiCheck,
  FiLoader,
  FiEdit3,
  FiTrash2,
  FiMaximize2,
  FiChevronRight
} from "react-icons/fi";
import { TbPalette } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  type ColorTheme,
  type ColorGroup,
  type ColorShade
} from "../../../services/useColorThemeService";
import { useProfileThemeService } from "../../../services/useProfileThemeService";
import GlassCard from "../../atoms/GlassCard/GlassCard";
import Button from "../../atoms/Button/Button";
import { useTheme, hexToHsl, type ThemeColors } from "../../../contexts/ThemeContext";
import { useColors } from "../../../utils/types";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

interface ColorCardProps {
  colorTheme: ColorTheme;
  onDelete?: (id: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ colorTheme, onDelete }) => {
  const navigate = useNavigate();
  const { activeThemeName, setActiveTheme, resetTheme } = useTheme();
  const { assignThemeToUser } = useProfileThemeService();
  const colors = useColors();
  const { setDefaultTheme } = useAuthenticatedUser();

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const isActive = activeThemeName === colorTheme.themeName;

  const deriveThemeColors = (theme: ColorTheme): ThemeColors => {
    const findColor = (name: string) => {
      for (const group of theme.palette.colorGroups) {
        for (const shade of group.colorShades) {
          if (shade.colorName.toLowerCase().includes(name)) return hexToHsl(shade.colorCode);
        }
      }
      return "";
    };

    return {
      primary: findColor("primary500") || findColor("primary") || "200 100% 55%",
      accent: findColor("accent500") || findColor("accent") || "260 80% 65%",
      background: "225 25% 6%",
      foreground: "210 20% 92%",
      card: "225 20% 10%",
      muted: "225 15% 14%",
      border: "225 15% 18%",
    };
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      resetTheme();
      return;
    }
    const themeColors = deriveThemeColors(colorTheme);
    setActiveTheme(colorTheme.themeName, themeColors);

    if (colorTheme.id) {
      try {
        setIsAssigning(true);
        await assignThemeToUser(colorTheme.id);
        setDefaultTheme(colorTheme);
      } catch (error) {
        console.error("Failed to assign theme:", error);
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const copyToClipboard = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const primaryColor = colorTheme.palette.colorGroups[0]?.colorShades.find(s => s.colorName.toLowerCase().includes("500"))?.colorCode ||
    colorTheme.palette.colorGroups[0]?.colorShades[0]?.colorCode || "#3B82F6";
  const accentColor = colorTheme.palette.colorGroups[1]?.colorShades.find(s => s.colorName.toLowerCase().includes("500"))?.colorCode ||
    colorTheme.palette.colorGroups[1]?.colorShades[0]?.colorCode || "#8B5CF6";

  return (
    <div className="relative h-full group/card">
      {/* Dynamic Aura Glow */}
      <div
        className="absolute inset-0 blur-[60px] opacity-0 group-hover/card:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primaryColor}, ${accentColor})`,
        }}
      />

      <GlassCard
        className={`h-full relative overflow-hidden transition-all duration-500 border-0 ${isActive ? "ring-1 ring-primary-500/40" : ""
          }`}
        style={{
          boxShadow: isActive
            ? `0 20px 40px ${primaryColor}15`
            : `0 8px 30px rgba(0,0,0,0.15)`,
          backgroundColor: `${colors.neutral0}03`,
          borderColor: isActive ? primaryColor : "transparent",
          padding: "20px",
        }}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center relative overflow-hidden group-hover/card:rotate-12 transition-transform duration-500"
              style={{ background: `linear-gradient(135deg, ${primaryColor}25, ${accentColor}15)`, border: `1px solid ${primaryColor}20` }}
            >
              <TbPalette className="h-4 w-4" style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight m-0 uppercase italic" style={{ color: colors.neutral900 }}>
                {colorTheme.themeName}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black tracking-widest opacity-30 uppercase" style={{ color: colors.neutral500 }}>
                  PRISM v4.0
                </span>
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Action Icons */}
            <div className="flex items-center gap-1 mr-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/card:translate-x-0">
              <button
                onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_VIEW, { params: { id: colorTheme.id } }))}
                className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <FiMaximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_EDIT, { params: { id: colorTheme.id } }))}
                className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <FiEdit3 className="h-3.5 w-3.5" />
              </button>
              {onDelete && colorTheme.id && (
                <button
                  onClick={() => onDelete(colorTheme.id!)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleApply}
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90"
              style={{ color: isActive ? primaryColor : colors.neutral400 }}
            >
              {isActive ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Jewel Box Grid */}
        <div className="space-y-6">
          {colorTheme.palette.colorGroups.map((group: ColorGroup) => (
            <div key={group.groupName}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 italic" style={{ color: colors.neutral900 }}>
                  {group.groupName}
                </span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {group.colorShades.map((shade: ColorShade) => (
                  <motion.div
                    key={shade.colorName}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    className="group/shade relative aspect-square"
                    onClick={(e) => copyToClipboard(shade.colorCode, e)}
                  >
                    <div
                      className="w-full h-full rounded-lg cursor-pointer border border-white/5 shadow-sm overflow-hidden relative"
                      style={{ backgroundColor: shade.colorCode }}
                    >
                      {/* Shine & Copy Reveal */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/shade:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[1px]">
                        <FiCopy className="h-2.5 w-2.5 text-white" />
                      </div>

                      {/* HEX Reveal on Hover */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] px-1.5 py-0.5 rounded font-black opacity-0 group-hover/shade:opacity-100 transition-all pointer-events-none z-20 whitespace-nowrap">
                        {shade.colorCode}
                      </div>

                      {/* Copied State */}
                      <AnimatePresence>
                        {copiedColor === shade.colorCode && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/90 flex items-center justify-center z-30"
                          >
                            <FiCheck className="h-3 w-3 text-green-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-5 border-t flex items-center justify-between" style={{ borderColor: `${colors.neutral200}10` }}>
          <div className="flex items-center gap-2 opacity-20">
            <FiGrid className="h-3 w-3" style={{ color: colors.neutral500 }} />
            <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: colors.neutral500 }}>
              SYSTEM_ACTIVE
            </span>
          </div>

          <Button
            variant={isActive ? "primaryContained" : "tertiaryContained"}
            size="extraSmall"
            className="h-8 rounded-lg font-black tracking-widest text-[9px] px-6 transition-all hover:px-8 shadow-xl"
            disabled={isAssigning}
            onClick={handleApply}
            style={{
              background: isActive ? primaryColor : "rgba(255,255,255,0.02)",
              color: isActive ? "white" : colors.neutral400,
              border: isActive ? "none" : `1px solid ${colors.neutral200}15`
            }}
          >
            {isAssigning ? (
              <FiLoader className="h-3 w-3 animate-spin" />
            ) : isActive ? (
              <span className="flex items-center gap-1.5"><FiStar className="h-3 w-3" /> APPLIED</span>
            ) : (
              <span className="flex items-center gap-1.5">INITIALIZE <FiChevronRight className="h-3.5 w-3.5" /></span>
            )}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ColorCard;