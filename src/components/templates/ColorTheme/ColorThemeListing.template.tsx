import React from "react";
import {
    type ColorTheme,
    useColorThemeService
} from "../../../services/useColorThemeService";
import {
    FiStar,
    FiX,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { TbPalette } from "react-icons/tb";
import { useColors } from "../../../utils/types";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../atoms/GlassCard/GlassCard";
import ColorCard from "./ColorCard.template";
import { useTheme } from "../../../contexts/ThemeContext";

import { TablePagination, IconButton } from "@mui/material";
import { type IPagination } from "../../../utils/types";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const { count, page, rowsPerPage, onPageChange } = props;
    const colors = useColors();
    const { isDark } = useTheme();

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    return (
        <div className="flex items-center gap-2 ml-4">
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                size="small"
                sx={{
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    color: colors.neutral900,
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: colors.primary500
                    },
                    '&.Mui-disabled': {
                        opacity: 0.3,
                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                    }
                }}
            >
                <FiChevronLeft size={18} />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                size="small"
                sx={{
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    color: colors.neutral900,
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: colors.primary500
                    },
                    '&.Mui-disabled': {
                        opacity: 0.3,
                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                    }
                }}
            >
                <FiChevronRight size={18} />
            </IconButton>
        </div>
    );
}

interface ColorThemeListingTemplateProps {
    colorThemes: ColorTheme[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    onRefresh?: () => void;
}

const ColorThemeListingTemplate: React.FC<ColorThemeListingTemplateProps> = ({
    colorThemes,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    onRefresh
}) => {
    const colors = useColors();
    const { activeThemeName, resetTheme, isPreviewActive, isDark } = useTheme();
    const { deleteColorTheme } = useColorThemeService();

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this theme?")) {
            try {
                await deleteColorTheme(id);
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="relative w-full mx-auto py-6 sm:py-10 px-4 sm:px-6">
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
                                        <p className="text-sm font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

            {colorThemes.length > 0 && (
                <div
                    className="rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 px-4"
                    style={{
                        backgroundColor: isDark ? `${colors.neutral0}05` : colors.neutral0,
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <TablePagination
                        component="div"
                        count={pagination.totalRecords}
                        page={pagination.currentPage}
                        onPageChange={handlePaginationChange}
                        rowsPerPage={pagination.pageSize}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[6, 12, 18, 24]}
                        ActionsComponent={TablePaginationActions}
                        sx={{
                            border: 'none',
                            '.MuiTablePagination-toolbar': {
                                paddingY: '12px',
                                color: colors.neutral900,
                            },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                fontSize: '10px',
                                letterSpacing: '0.1em',
                                opacity: 0.6,
                                color: colors.neutral900,
                            },
                            '.MuiTablePagination-select': {
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                borderRadius: '8px',
                                paddingY: '4px',
                                paddingX: '8px',
                                marginRight: '8px',
                                fontWeight: 700,
                                fontSize: '12px',
                                color: colors.neutral900,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                            },
                            '.MuiTablePagination-selectIcon': {
                                color: colors.neutral900,
                            }
                        }}
                    />
                </div>
            )}

            {colorThemes.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 opacity-20">
                        <TbPalette size={40} />
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tighter opacity-20">No Engine Configs Found</h3>
                    <p className="text-xs mt-2 opacity-10 uppercase tracking-[0.3em] font-bold">Initialize a new theme to begin</p>
                </div>
            )}

            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};

export default ColorThemeListingTemplate;