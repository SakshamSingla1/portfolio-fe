import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import type { IDashboardSummary } from "../../../services/useDashboardService";

const VIEW_MILESTONES = [50, 100, 250, 500, 1000, 2500, 5000, 10_000, 25_000, 50_000, 100_000];

const COMPLETE_KEY = "dashboard_celebrated_100pct";
const VIEWS_KEY = "dashboard_celebrated_views_milestone";

interface Milestone {
  key: string;
  emoji: string;
  message: string;
}

/** Reads dashboard data and decides whether a NEW milestone was just crossed —
 * localStorage remembers what's already been celebrated so a refresh/refetch
 * doesn't refire the same confetti every 30s on the polling interval. */
const useMilestoneCelebration = (dashboardData: IDashboardSummary | null): {
  milestone: Milestone | null;
  dismiss: () => void;
} => {
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    if (!dashboardData) return;

    const pct = dashboardData.profileCompletion?.percentage ?? 0;
    if (pct === 100 && localStorage.getItem(COMPLETE_KEY) !== "true") {
      localStorage.setItem(COMPLETE_KEY, "true");
      setMilestone({ key: "complete", emoji: "🏆", message: "Portfolio 100% complete!" });
      return;
    }

    const totalViews = dashboardData.viewStats?.totalViews ?? 0;
    const lastCelebrated = Number(localStorage.getItem(VIEWS_KEY) ?? 0);
    const crossed = VIEW_MILESTONES.filter((m) => totalViews >= m && m > lastCelebrated);
    if (crossed.length > 0) {
      const highest = crossed[crossed.length - 1];
      localStorage.setItem(VIEWS_KEY, String(highest));
      setMilestone({ key: `views-${highest}`, emoji: "🎉", message: `${highest.toLocaleString()} portfolio views!` });
    }
  }, [dashboardData]);

  const dismiss = useCallback(() => setMilestone(null), []);

  return { milestone, dismiss };
};

const PARTICLE_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#f43f5e", "#06b6d4"];

const ConfettiBurst: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        angle: (i / 24) * 360 + Math.random() * 15,
        distance: 60 + Math.random() * 70,
        size: 5 + Math.random() * 4,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{ width: p.size, height: p.size, background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x, y, opacity: 0, rotate: p.rotate, scale: 0.5 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
};

const MilestoneCelebration: React.FC<{ dashboardData: IDashboardSummary | null }> = ({ dashboardData }) => {
  const colors = useColors();
  const { milestone, dismiss } = useMilestoneCelebration(dashboardData);

  useEffect(() => {
    if (!milestone) return;
    const t = setTimeout(dismiss, 4500);
    return () => clearTimeout(t);
  }, [milestone, dismiss]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key={milestone.key}
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-5 right-5 z-[1200] flex items-center gap-3 rounded-2xl px-4 py-3.5 overflow-hidden"
          style={{
            background: colors.neutral0,
            border: `1.5px solid ${colors.neutral300}`,
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.02)",
            maxWidth: 320,
          }}
        >
          <ConfettiBurst />
          <div
            className="relative flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 40, height: 40, fontSize: 20, background: `${colors.primary500}14` }}
          >
            {milestone.emoji}
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="text-[13px] font-bold" style={{ color: colors.neutral900 }}>
              {milestone.message}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: colors.neutral400 }}>
              Nice work — keep it up.
            </div>
          </div>
          <button
            onClick={dismiss}
            className="relative shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 20, height: 20, color: colors.neutral400, background: "transparent", border: "none", cursor: "pointer" }}
            aria-label="Dismiss"
          >
            <FiX size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneCelebration;
