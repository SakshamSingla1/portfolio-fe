import React, { useCallback, useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { FiBell, FiCheck, FiInbox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { DateUtils } from "../../../utils/helper";
import useNotificationService, { type NotificationResponse } from "../../../services/useNotificationService";

const POLL_INTERVAL_MS = 30000;

const useStyles = createUseStyles({
    wrapper: {
        position: "relative",
    },
    iconButton: (c: any) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: c.isMobile ? 20 : 40,
        height: c.isMobile ? 20 : 40,
        borderRadius: c.isMobile ? 8 : 12,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: c.neutral600,
        transition: "all 0.3s ease",
        "&:hover": {
            background: `${c.primary500}10`,
            color: c.primary600,
            transform: "translateY(-2px)",
        },
    }),
    dot: (c: any) => ({
        position: "absolute",
        top: c.isMobile ? 1 : 8,
        right: c.isMobile ? 3 : 8,
        width: c.isMobile ? 7 : 8,
        height: c.isMobile ? 7 : 8,
        borderRadius: "50%",
        background: c.primary500,
        border: `2px solid ${c.neutral0}`,
    }),
    panel: (c: any) => ({
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: c.isMobile ? 300 : 360,
        maxHeight: 420,
        display: "flex",
        flexDirection: "column",
        background: c.neutral0,
        backdropFilter: "blur(20px)",
        border: `1px solid ${c.neutral200}80`,
        borderRadius: 18,
        boxShadow: `0 16px 48px ${c.neutral900}15`,
        zIndex: 100,
        overflow: "hidden",
    }),
    header: (c: any) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: `1px solid ${c.neutral200}40`,
    }),
    title: (c: any) => ({
        fontSize: 14,
        fontWeight: 700,
        color: c.neutral800,
    }),
    markAll: (c: any) => ({
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        color: c.primary600,
        "&:disabled": {
            color: c.neutral400,
            cursor: "default",
        },
    }),
    list: {
        overflowY: "auto",
        flex: 1,
    },
    item: (c: any) => ({
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        textAlign: "left",
        padding: "12px 16px",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${c.neutral200}30`,
        cursor: "pointer",
        transition: "background 0.15s ease",
        "&:hover": {
            background: c.neutral50,
        },
    }),
    itemTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    itemTitle: (c: any) => ({
        fontSize: 13,
        fontWeight: 700,
        color: c.neutral800,
        flex: 1,
    }),
    unreadDot: (c: any) => ({
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: c.primary500,
        flexShrink: 0,
    }),
    itemMessage: (c: any) => ({
        fontSize: 12,
        color: c.neutral600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
    }),
    itemTime: (c: any) => ({
        fontSize: 11,
        color: c.neutral400,
        marginTop: 2,
    }),
    empty: (c: any) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "32px 16px",
        color: c.neutral400,
        fontSize: 13,
    }),
});

const NotificationBell: React.FC = () => {
    const colors = useColors();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const jssTheme = { ...colors, isMobile };
    const classes = useStyles(jssTheme);
    const navigate = useNavigate();
    const notificationService = useNotificationService();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        const res = await notificationService.getUnreadCount();
        const count = res?.data?.data;
        if (typeof count === "number") setUnreadCount(count);
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await notificationService.getAll({ page: "0", size: "10" });
            setNotifications(res?.data?.data?.content ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next) loadNotifications();
    };

    const handleItemClick = async (n: NotificationResponse) => {
        if (!n.isRead) {
            await notificationService.markAsRead(n.id);
            setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        setIsOpen(false);
        if (n.link) navigate(n.link);
    };

    const handleMarkAllAsRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
    };

    return (
        <div className={classes.wrapper} ref={wrapperRef}>
            <button className={classes.iconButton} onClick={handleToggle} title="Notifications">
                <FiBell size={20} />
                {unreadCount > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={classes.dot} />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={classes.panel}
                    >
                        <div className={classes.header}>
                            <span className={classes.title}>Notifications</span>
                            <button
                                className={classes.markAll}
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <FiCheck size={14} />
                                Mark all read
                            </button>
                        </div>

                        <div className={classes.list}>
                            {loading && (
                                <div className={classes.empty}>Loading…</div>
                            )}
                            {!loading && notifications.length === 0 && (
                                <div className={classes.empty}>
                                    <FiInbox size={24} />
                                    <span>No notifications yet</span>
                                </div>
                            )}
                            {!loading && notifications.map((n) => (
                                <button key={n.id} className={classes.item} onClick={() => handleItemClick(n)}>
                                    <div className={classes.itemTitleRow}>
                                        <span className={classes.itemTitle}>{n.title}</span>
                                        {!n.isRead && <span className={classes.unreadDot} />}
                                    </div>
                                    {n.message && <span className={classes.itemMessage}>{n.message}</span>}
                                    <span className={classes.itemTime}>
                                        {DateUtils.formatDateTimeToDateMonthYear(n.createdAt)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
