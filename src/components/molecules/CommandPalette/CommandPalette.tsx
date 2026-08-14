import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiSun, FiMoon, FiLogOut, FiCornerDownLeft, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useTheme } from "../../../contexts/ThemeContext";
import { enumToNormalKey } from "../../../utils/helper";
import { getIconForNavItem } from "../../../utils/navIcons";

interface CommandItem {
    id: string;
    label: string;
    section: "Pages" | "Actions";
    icon: React.ReactElement;
    onSelect: () => void;
}

const CommandPalette: React.FC = () => {
    const colors = useColors();
    const navigate = useNavigate();
    const { rolePermissions, logout } = useAuthenticatedUser();
    const { isDark, setColorMode } = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const close = () => {
        setIsOpen(false);
        setQuery("");
        setActiveIndex(0);
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
            if (isCmdK) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape" && isOpen) {
                close();
            }
        };
        // Lets header UI (the ⌘K hint button) open the palette without prop
        // drilling — CommandPalette is mounted once, self-contained, at the
        // layout root.
        const openHandler = () => setIsOpen(true);
        window.addEventListener("keydown", handler);
        window.addEventListener("open-command-palette", openHandler);
        return () => {
            window.removeEventListener("keydown", handler);
            window.removeEventListener("open-command-palette", openHandler);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Wait a frame — the entrance animation mounts the input, and
            // focusing before it's painted silently no-ops in some browsers.
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    const items: CommandItem[] = useMemo(() => {
        const seen = new Set<string>();
        const pages: CommandItem[] = (rolePermissions?.navLinks ?? [])
            .filter((link) => link.path && !seen.has(link.path) && seen.add(link.path))
            .map((link) => ({
                id: `page-${link.path}`,
                label: enumToNormalKey(link.name),
                section: "Pages" as const,
                icon: getIconForNavItem(link.name),
                onSelect: () => navigate(link.path),
            }));

        const actions: CommandItem[] = [
            {
                id: "toggle-theme",
                label: isDark ? "Switch to light mode" : "Switch to dark mode",
                section: "Actions",
                icon: isDark ? <FiSun /> : <FiMoon />,
                onSelect: () => setColorMode(isDark ? "light" : "dark"),
            },
            {
                id: "sign-out",
                label: "Sign out",
                section: "Actions",
                icon: <FiLogOut />,
                onSelect: () => { logout(); navigate("/login"); },
            },
        ];

        return [...pages, ...actions];
    }, [rolePermissions, isDark, navigate, setColorMode, logout]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => item.label.toLowerCase().includes(q));
    }, [items, query]);

    useEffect(() => { setActiveIndex(0); }, [query]);

    const runItem = (item: CommandItem | undefined) => {
        if (!item) return;
        item.onSelect();
        close();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            runItem(filtered[activeIndex]);
        }
    };

    let renderedSection: string | null = null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-start justify-center z-[2000] px-4 pt-24"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}
                    onClick={close}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
                        style={{
                            background: colors.neutral0,
                            border: `1.5px solid ${colors.neutral300}`,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
                            maxHeight: "70vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
                            style={{ borderBottom: `1px solid ${colors.neutral200}` }}
                        >
                            <FiSearch size={16} style={{ color: colors.neutral400 }} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Jump to a page or run a command…"
                                className="flex-1 bg-transparent outline-none text-sm"
                                style={{ color: colors.neutral800 }}
                            />
                            <kbd
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: colors.neutral100, color: colors.neutral400 }}
                            >
                                ESC
                            </kbd>
                        </div>

                        <div className="overflow-y-auto py-2" style={{ flex: 1 }}>
                            {filtered.length === 0 && (
                                <div className="px-4 py-8 text-center text-sm" style={{ color: colors.neutral400 }}>
                                    No matches for &quot;{query}&quot;
                                </div>
                            )}
                            {filtered.map((item, idx) => {
                                const showHeader = item.section !== renderedSection;
                                renderedSection = item.section;
                                const active = idx === activeIndex;
                                return (
                                    <React.Fragment key={item.id}>
                                        {showHeader && (
                                            <div
                                                className="px-4 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest"
                                                style={{ color: colors.neutral400 }}
                                            >
                                                {item.section}
                                            </div>
                                        )}
                                        <button
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            onClick={() => runItem(item)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                                            style={{
                                                background: active ? `${colors.primary500}12` : "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span
                                                className="flex items-center justify-center rounded-lg shrink-0"
                                                style={{
                                                    width: 28, height: 28,
                                                    background: active ? `${colors.primary500}20` : colors.neutral100,
                                                    color: active ? colors.primary600 : colors.neutral500,
                                                }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium flex-1" style={{ color: colors.neutral800 }}>
                                                {item.label}
                                            </span>
                                            {active && <FiCornerDownLeft size={13} style={{ color: colors.neutral400 }} />}
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div
                            className="flex items-center gap-4 px-4 py-2.5 shrink-0 text-[11px]"
                            style={{ borderTop: `1px solid ${colors.neutral200}`, color: colors.neutral400 }}
                        >
                            <span className="flex items-center gap-1"><FiArrowUp size={11} /><FiArrowDown size={11} /> navigate</span>
                            <span className="flex items-center gap-1"><FiCornerDownLeft size={11} /> select</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
