import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiStar,
  FiCopy,
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
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ColorCardProps {
  colorTheme: ColorTheme;
  onDelete?: (id: number) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ colorTheme, onDelete }) => {
  const navigate = useNavigate();
  const { activeThemeName, setActiveTheme, resetTheme, isDark, setColorMode } = useTheme();
  const { assignThemeToUser } = useProfileThemeService();
  const colors = useColors();
  const { setDefaultTheme, defaultTheme } = useAuthenticatedUser();
  const isMobile = useIsMobile();

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const isActive = activeThemeName === colorTheme.themeName || defaultTheme?.themeName === colorTheme.themeName;

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
        await assignThemeToUser({
          themeId: colorTheme.id ?? null
        });
        setDefaultTheme(colorTheme);
      } catch {
        // assignment failed; spinner stops in finally
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

  const extractShadeNumber = (colorName: string) => colorName.replace(/[^0-9]/g, '') || '—';

  return (
    <motion.div
      className={`relative h-full group/card select-none border rounded-3xl ${isActive ? `border-primary-500` : ''}`}
      onDoubleClick={() => setColorMode(isDark ? "light" : "dark")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="absolute inset-0 blur-[80px] opacity-0 group-hover/card:opacity-20 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primaryColor}, ${accentColor})`,
        }}
      />

      <GlassCard
        className={`h-full relative overflow-hidden transition-all duration-500 ${isActive ? "ring-[3px] ring-primary-500/30" : ""}`}
        style={{
          boxShadow: isActive
            ? `0 25px 50px ${primaryColor}25, inset 0 0 20px ${primaryColor}10`
            : isDark ? `0 8px 30px rgba(0,0,0,0.5)` : `0 8px 30px ${colors.neutral900}08`,
          backgroundColor: isDark ? `${colors.neutral0}05` : `${colors.neutral0}99`,
          backdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid ${isActive ? primaryColor : isDark ? `${colors.neutral200}10` : `${colors.neutral200}`}`,
          padding: isMobile ? "16px" : "20px 24px",
        }}
      >
        {/* shimmer overlay */}
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 translate-x-[-100%] group-hover/card:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner shrink-0"
              style={{ background: `linear-gradient(135deg, ${primaryColor}30, ${accentColor}20)`, border: `1px solid ${primaryColor}30` }}
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <TbPalette className="h-5 w-5" style={{ color: primaryColor }} />
              <div className="absolute inset-0 bg-white/5" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black m-0 tracking-tight leading-none mb-1 truncate" style={{ color: colors.neutral900 }}>
                {colorTheme.themeName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium opacity-50 uppercase tracking-wider" style={{ color: colors.neutral600 }}>
                  {colorTheme.palette.colorGroups.length} Groups · {colorTheme.palette.colorGroups[0]?.colorShades.length ?? 0} Shades each
                </span>
                {isActive && (
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] font-black text-green-600 tracking-widest uppercase">Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* action buttons: always visible on mobile, hover-reveal on desktop */}
            <div className={`flex items-center gap-0.5 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/card:translate-x-0'}`}>
              <button
                onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_VIEW, { params: { id: colorTheme.id } }))}
                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: colors.neutral400 }}
              >
                <FiMaximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_EDIT, { params: { id: colorTheme.id } }))}
                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: colors.neutral400 }}
              >
                <FiEdit3 className="h-3.5 w-3.5" />
              </button>
              {onDelete && colorTheme.id && (
                <button
                  onClick={() => onDelete(colorTheme.id!)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10 hover:text-red-500"
                  style={{ color: colors.neutral400 }}
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleApply}
              className="h-8 w-8 rounded-xl flex items-center justify-center transition-all border shadow-lg active:scale-90"
              style={{
                color: isActive ? primaryColor : colors.neutral400,
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                borderColor: isActive ? primaryColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
              }}
            >
              {isActive ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Color Groups ── */}
        <div className="space-y-4 sm:space-y-5">
          {colorTheme.palette.colorGroups.map((group: ColorGroup) => {
            const groupColor = group.colorShades.find(s => s.colorName.toLowerCase().includes("500"))?.colorCode || primaryColor;
            return (
              <div key={group.groupName} className="relative">
                {/* Group label row */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: groupColor }}
                  />
                  <h3 className="text-[11px] font-black uppercase tracking-widest opacity-50 m-0" style={{ color: colors.neutral900 }}>
                    {group.groupName}
                  </h3>
                  <div className="h-px flex-1 opacity-10" style={{ background: `linear-gradient(to right, ${groupColor}, transparent)` }} />
                  <span className="text-[9px] font-bold opacity-20 tabular-nums">{group.colorShades.length}</span>
                </div>

                {/* Swatches */}
                <div className="flex w-full gap-0.5">
                  {group.colorShades.map((shade: ColorShade) => (
                    <motion.div
                      key={shade.colorName}
                      whileHover={{ scaleY: 1.2, scaleX: 1.05, zIndex: 10 }}
                      className="group/shade relative flex-1 min-w-0"
                      style={{ height: isMobile ? 36 : 44 }}
                      onClick={(e) => copyToClipboard(shade.colorCode, e)}
                    >
                      <div
                        className="w-full h-full rounded cursor-pointer transition-all duration-200 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{
                          backgroundColor: shade.colorCode,
                          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                          borderRadius: 4,
                        }}
                      >
                        {/* hover: copy icon overlay */}
                        <div className="absolute inset-0 bg-white/25 opacity-0 group-hover/shade:opacity-100 transition-opacity flex items-center justify-center">
                          <FiCopy className="h-2.5 w-2.5 text-white mix-blend-difference" />
                        </div>

                        {/* hover: hex tooltip */}
                        <div
                          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded font-black opacity-0 group-hover/shade:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-2xl scale-75 group-hover/shade:scale-100"
                        >
                          {shade.colorCode}
                        </div>

                        {/* copied confirmation */}
                        <AnimatePresence>
                          {copiedColor === shade.colorCode && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-white/95 flex items-center justify-center z-30"
                              style={{ borderRadius: 4 }}
                            >
                              <FiCheck className="h-3.5 w-3.5 text-green-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Shade number labels */}
                <div className="flex w-full gap-0.5 mt-1">
                  {group.colorShades.map((shade: ColorShade) => (
                    <div
                      key={shade.colorName}
                      className="flex-1 min-w-0 text-center overflow-hidden"
                      style={{ fontSize: 7, lineHeight: '10px', opacity: 0.35, color: colors.neutral900, fontFamily: 'monospace', fontWeight: 700 }}
                    >
                      {extractShadeNumber(shade.colorName)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          className="mt-5 pt-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: isActive ? '#22c55e' : primaryColor, boxShadow: isActive ? '0 0 8px rgba(34,197,94,0.5)' : undefined }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase tracking-tight truncate" style={{ color: colors.neutral900 }}>
                {isActive ? 'Active Runtime' : 'Standby Buffer'}
              </span>
              <span className="text-[9px] font-medium opacity-35 truncate" style={{ color: colors.neutral600 }}>
                {colorTheme.palette.colorGroups.reduce((sum, g) => sum + g.colorShades.length, 0)} total color shades
              </span>
            </div>
          </div>

          <Button
            variant={isActive ? "primaryContained" : "tertiaryContained"}
            size="extraSmall"
            className="h-8 rounded-xl font-black tracking-widest text-[9px] px-4 sm:px-6 transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0"
            disabled={isAssigning}
            onClick={handleApply}
            style={{
              background: isActive ? `linear-gradient(135deg, ${primaryColor}, ${accentColor})` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: isActive ? "white" : colors.neutral500,
              border: isActive ? "none" : `1.5px solid ${colors.neutral300}10`
            }}
          >
            {isAssigning ? (
              <FiLoader className="h-3 w-3 animate-spin" />
            ) : isActive ? (
              <span className="flex items-center gap-1.5"><FiStar className="h-3 w-3 fill-white" /> APPLIED</span>
            ) : (
              <span className="flex items-center gap-1.5">APPLY <FiChevronRight className="h-3.5 w-3.5" /></span>
            )}
          </Button>
        </div>
      </GlassCard>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};

export default ColorCard;
