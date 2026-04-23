import React from "react";
import {
    type ColorTheme,
    useColorThemeService
} from "../../../services/useColorThemeService";
import {
    FiStar,
    FiX,
    FiPlus,
} from "react-icons/fi";
import { TbPalette } from "react-icons/tb";
import Button from "../../atoms/Button/Button";
import { useColors } from "../../../utils/types";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../atoms/GlassCard/GlassCard";
import ColorCard from "./ColorCard.template";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../utils/constant";

interface ColorThemeListingTemplateProps {
    colorThemes: ColorTheme[];
    onRefresh?: () => void;
}

const ColorThemeListingTemplate: React.FC<ColorThemeListingTemplateProps> = ({
    colorThemes,
    onRefresh
}) => {
    const colors = useColors();
    const navigate = useNavigate();
    const { activeThemeName, resetTheme, isPreviewActive } = useTheme();
    const { deleteColorTheme } = useColorThemeService();

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this theme?")) {
            try {
                await deleteColorTheme(id);
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error("Failed to delete theme:", error);
            }
        }
    };

    return (
        <div className="relative w-full max-w-[1200px] mx-auto py-6 sm:py-10 px-4 sm:px-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
            >
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black m-0 tracking-tight uppercase italic" style={{ color: colors.neutral900 }}>
                        Color <span style={{ color: colors.primary500 }}>Engine</span>
                    </h1>
                    <p className="text-xs mt-2 font-bold opacity-30 uppercase tracking-[0.2em]" style={{ color: colors.neutral600 }}>
                        Advanced dynamic palette management system
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isPreviewActive && (
                        <Button
                            variant="tertiaryContained"
                            size="small"
                            onClick={resetTheme}
                            className="h-10 px-6 rounded-xl font-black tracking-widest text-[10px]"
                            label="RESET PREVIEW"
                        />
                    )}
                    <Button
                        variant="primaryContained"
                        size="small"
                        onClick={() => navigate(ADMIN_ROUTES.COLOR_THEME_ADD)}
                        className="h-10 px-8 rounded-xl font-black tracking-widest text-[10px] shadow-xl shadow-primary-500/20"
                        startIcon={<FiPlus size={16} />}
                        label="NEW THEME"
                    />
                </div>
            </motion.div>

            {/* Live Preview Panel */}
            <AnimatePresence>
                {isPreviewActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-12"
                    >
                        <GlassCard className="border-primary-500/30" style={{ borderColor: `${colors.primary500}50` }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-primary-500/10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary-500/5 animate-pulse" />
                                        <FiStar className="text-primary-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black m-0 uppercase italic" style={{ color: colors.neutral900 }}>
                                            Active Injection: <span style={{ color: colors.primary600 }}>{activeThemeName}</span>
                                        </p>
                                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-1">Real-time stylesheet override active</p>
                                    </div>
                                </div>
                                <button onClick={resetTheme} className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors border border-white/5">
                                    <FiX size={18} className="opacity-20 hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {colorThemes.map((theme, i) => (
                    <motion.div
                        key={theme.id || theme.themeName}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    >
                        <ColorCard
                            colorTheme={theme}
                            onDelete={handleDelete}
                        />
                    </motion.div>
                ))}
            </div>

            {/* No Data State */}
            {colorThemes.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 opacity-20">
                        <TbPalette size={40} />
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tighter opacity-20">No Engine Configs Found</h3>
                    <p className="text-xs mt-2 opacity-10 uppercase tracking-[0.3em] font-bold">Initialize a new theme to begin</p>
                </div>
            )}

            {/* Grain Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};

export default ColorThemeListingTemplate;