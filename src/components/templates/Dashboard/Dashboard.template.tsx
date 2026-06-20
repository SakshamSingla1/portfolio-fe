import React, { useContext } from "react";
import { type IDashboardSummary } from "../../../services/useDashboardService";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { AuthenticatedUserContext } from "../../../contexts/AuthenticatedUserContext";
import { motion } from "framer-motion";

import StatsTemplate from "./Stats.template";
import ViewAnalyticsTemplate from "./ViewAnalytics.template";
import ProfileCompletionTemplate from "./ProfileCompletion.template";
import RecentMessagesTemplate from "./RecentMessages.template";
import RecentActivitiesTemplate from "./RecentActivities.template";
import QuickActionsTemplate from "./QuickActions.template";

interface DashboardTemplateProps {
  dashboardData: IDashboardSummary | null;
}

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Working late";
};

const formatDate = (): string =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

/* ─ Avatar helpers ───────────────────────────────────────────────── */
const AVATAR_PALETTES = [
  { bg: "#ede9fe", fg: "#7c3aed" },
  { bg: "#dbeafe", fg: "#1d4ed8" },
  { bg: "#d1fae5", fg: "#065f46" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#e0f2fe", fg: "#075985" },
];
const AVATAR_PALETTES_DARK = [
  { bg: "#4c1d95", fg: "#c4b5fd" },
  { bg: "#1e3a5f", fg: "#93c5fd" },
  { bg: "#064e3b", fg: "#6ee7b7" },
  { bg: "#78350f", fg: "#fde68a" },
  { bg: "#831843", fg: "#fbcfe8" },
  { bg: "#0c4a6e", fg: "#7dd3fc" },
];
const avatarPalette = (name: string, dark: boolean) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  const idx = Math.abs(h) % AVATAR_PALETTES.length;
  return dark ? AVATAR_PALETTES_DARK[idx] : AVATAR_PALETTES[idx];
};
const getInitials = (name: string) => {
  const w = name.trim().split(/\s+/);
  return w.length === 1 ? w[0][0].toUpperCase() : (w[0][0] + w[w.length - 1][0]).toUpperCase();
};

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ dashboardData }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const { user } = useContext(AuthenticatedUserContext);

  // Prefer profileSummary from API (more complete), fall back to auth user
  const fullName      = dashboardData?.profileSummary?.fullName || user?.fullName || "";
  const profileTitle  = dashboardData?.profileSummary?.title || "";
  const profileLoc    = dashboardData?.profileSummary?.location || "";
  const profileImg    = dashboardData?.profileSummary?.profileImageUrl || "";
  const firstName     = fullName.split(" ")[0] || "there";

  const cardShadow = isDark
    ? "0 1px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
    : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)";

  /* ─── Card shell ─────────────────────────────────────────────────── */
  const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children, className = "",
  }) => (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: colors.neutral0,
        border: `1px solid ${colors.neutral200}`,
        boxShadow: cardShadow,
      }}
    >
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );

  /* ─── Section label ──────────────────────────────────────────────── */
  const SectionLabel: React.FC<{ children: React.ReactNode; count?: number; accent?: string }> = ({
    children, count, accent,
  }) => (
    <div className="flex items-center justify-between mb-4">
      <span
        className="text-[10px] font-black uppercase tracking-[0.1em]"
        style={{ color: accent ?? colors.primary700 }}
      >
        {children}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full"
          style={{
            background: isDark ? colors.primary900 : colors.primary50,
            color: isDark ? colors.primary300 : colors.primary700,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );

  /* ─── Skeleton ───────────────────────────────────────────────────── */
  const Skeleton = () => (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
      <div className={isMobile ? "space-y-4" : "col-span-7 space-y-4"}>
        {[60, 280, 200].map((h, i) => (
          <div
            key={i}
            className="rounded-2xl animate-pulse"
            style={{ height: h, background: colors.neutral100 }}
          />
        ))}
      </div>
      <div className={isMobile ? "space-y-4" : "col-span-5 space-y-4"}>
        {[260, 200].map((h, i) => (
          <div
            key={i}
            className="rounded-2xl animate-pulse"
            style={{ height: h, background: colors.neutral100 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "12px 10px 24px" : "20px 20px 32px" }}>

      {/* ─ Greeting header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between mb-5"
      >
        {/* Left: greeting text */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: isMobile ? 18 : 22, color: colors.neutral900, lineHeight: 1.2 }}
          >
            {getGreeting()}, {firstName}.
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-xs" style={{ color: colors.neutral500 }}>{formatDate()}</p>
            {profileTitle && (
              <>
                <span style={{ color: colors.neutral300, fontSize: 10 }}>·</span>
                <p className="text-xs font-medium" style={{ color: colors.neutral600 }}>{profileTitle}</p>
              </>
            )}
            {profileLoc && (
              <>
                <span style={{ color: colors.neutral300, fontSize: 10 }}>·</span>
                <p className="text-xs" style={{ color: colors.neutral500 }}>{profileLoc}</p>
              </>
            )}
          </div>
        </div>

        {/* Right: avatar */}
        {fullName && (
          <div className="ml-4 shrink-0">
            {profileImg ? (
              <img
                src={profileImg}
                alt={fullName}
                className="rounded-full object-cover"
                style={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  border: `2px solid ${colors.primary200}`,
                }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center font-bold"
                style={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  fontSize: isMobile ? 14 : 16,
                  ...avatarPalette(fullName, isDark),
                  border: `2px solid ${colors.primary200}`,
                }}
              >
                {getInitials(fullName)}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {!dashboardData ? (
        <Skeleton />
      ) : (
        <div className="space-y-4">

          {/* ─ Stats strip ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <StatsTemplate stats={dashboardData.stats} />
          </motion.div>

          {/* ─ View Analytics hero ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <ViewAnalyticsTemplate viewStats={dashboardData.viewStats} />
          </motion.div>

          {/* ─ Main grid ───────────────────────────────────────────── */}
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>

            {/* Left column */}
            <div className={`space-y-4 ${isMobile ? "" : "col-span-7"}`}>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card>
                  <SectionLabel count={dashboardData.recentMessages.length}>
                    Recent Messages
                  </SectionLabel>
                  <RecentMessagesTemplate messages={dashboardData.recentMessages} />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Card>
                  <SectionLabel>Quick Add</SectionLabel>
                  <QuickActionsTemplate />
                </Card>
              </motion.div>
            </div>

            {/* Right column */}
            <div className={`space-y-4 ${isMobile ? "" : "col-span-5"}`}>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <Card>
                  <SectionLabel>Portfolio Score</SectionLabel>
                  <ProfileCompletionTemplate profileCompletion={dashboardData.profileCompletion} />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                <Card>
                  <SectionLabel count={dashboardData.recentActivities.length}>
                    Activity
                  </SectionLabel>
                  <RecentActivitiesTemplate activities={dashboardData.recentActivities} />
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTemplate;
