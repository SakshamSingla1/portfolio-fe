import React, { useContext, useState } from "react";
import { type IDashboardSummary, type IViewStats, type IStats } from "../../../services/useDashboardService";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { AuthenticatedUserContext } from "../../../contexts/AuthenticatedUserContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiExternalLink, FiLink, FiCheck, FiPlus } from "react-icons/fi";
import { useSnackbar } from "../../../hooks/useSnackBar";

import StatsTemplate from "./Stats.template";
import ViewAnalyticsTemplate from "./ViewAnalytics.template";
import ProfileCompletionTemplate from "./ProfileCompletion.template";
import RecentMessagesTemplate from "./RecentMessages.template";
import RecentActivitiesTemplate from "./RecentActivities.template";
import QuickActionsTemplate from "./QuickActions.template";
import MilestoneCelebration from "./MilestoneCelebration";
import { Card, SectionLabel, SkeletonBlock } from "./shared/DashboardUI";

interface DashboardTemplateProps {
  dashboardData: IDashboardSummary | null;
}

const EMPTY_VIEW_STATS: IViewStats = {
  totalViews: 0,
  viewsToday: 0,
  viewsThisWeek: 0,
  viewsLastWeek: 0,
  viewsThisMonth: 0,
  uniqueVisitors: 0,
  resumeDownloads: 0,
  weeklyTrend: [],
  deviceBreakdown: {},
  recentViews: [],
  browserBreakdown: {},
  locationBreakdown: {},
  referrerBreakdown: {}
};

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Working late";
};

const formatDate = (): string =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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

interface FocusChipProps {
  label: string;
  color: string;
  onClick?: () => void;
}
const FocusChip: React.FC<FocusChipProps> = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-full transition-opacity duration-150 hover:opacity-80"
    style={{
      padding: "5px 10px 5px 8px",
      background: `${color}14`,
      border: `1px solid ${color}28`,
      cursor: onClick ? "pointer" : "default",
    }}
  >
    <div className="rounded-full shrink-0" style={{ width: 6, height: 6, background: color }} />
    <span className="text-[11px] font-semibold" style={{ color }}>
      {label}
    </span>
    {onClick && <FiArrowRight size={9} color={color} />}
  </button>
);

const LiveSiteControl: React.FC<{ portfolioUrl?: string | null; isMobile: boolean }> = ({
  portfolioUrl,
  isMobile,
}) => {
  const colors = useColors();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  if (!portfolioUrl) {
    return (
      <button
        onClick={() => navigate("/social-links")}
        className="flex items-center gap-1.5 rounded-full transition-opacity duration-150 hover:opacity-80 shrink-0"
        style={{
          padding: "6px 12px 6px 10px",
          background: `${colors.primary600}0e`,
          border: `1px dashed ${colors.primary600}40`,
          cursor: "pointer",
        }}
      >
        <FiPlus size={11} color={colors.primary600} />
        <span className="text-[11px] font-semibold" style={{ color: colors.primary600 }}>
          {isMobile ? "Add site link" : "Add your portfolio link"}
        </span>
      </button>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      showSnackbar("success", "Link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showSnackbar("error", "Failed to copy link");
    }
  };

  const displayHost = portfolioUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full transition-opacity duration-150 hover:opacity-80"
        style={{
          padding: "6px 12px 6px 10px",
          background: `${colors.primary600}14`,
          border: `1px solid ${colors.primary600}28`,
        }}
      >
        <FiExternalLink size={11} color={colors.primary600} />
        <span className="text-[11px] font-semibold truncate max-w-[140px]" style={{ color: colors.primary600 }}>
          {isMobile ? "Live site" : displayHost}
        </span>
      </a>
      <button
        onClick={handleCopy}
        aria-label="Copy portfolio link"
        className="flex items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-80"
        style={{
          width: 26,
          height: 26,
          background: colors.neutral100,
          border: `1px solid ${colors.neutral300}`,
          cursor: "pointer",
        }}
      >
        {copied ? <FiCheck size={11} color={colors.success600} /> : <FiLink size={11} color={colors.neutral500} />}
      </button>
    </div>
  );
};

/** Small circular gauge for the engagement-rate cards — fills the wide empty
 * space next to a lone percentage with a visual read of that same percentage,
 * capped at 100% of the ring regardless of the underlying value. */
const MiniRing: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const size = 44;
  const strokeW = 4;
  const r = (size - strokeW) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(pct, 100));

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke={`${color}20`} strokeWidth={strokeW} />
      <motion.circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </svg>
  );
};

const EngagementStrip: React.FC<{ viewStats: IViewStats; stats: IStats }> = ({
  viewStats,
  stats,
}) => {
  const colors = useColors();
  const { isDark } = useTheme();

  const { totalViews, resumeDownloads, uniqueVisitors } = viewStats;
  const { totalMessages } = stats;

  const rawPct = (n: number) => (totalViews > 0 ? (n / totalViews) * 100 : null);
  const fmt = (pct: number | null) => (pct !== null ? pct.toFixed(1) + "%" : "—");

  const items = [
    {
      label: "Contact Rate",
      pct: rawPct(totalMessages),
      detail: `${totalMessages} message${totalMessages !== 1 ? "s" : ""} · ${totalViews.toLocaleString()} views`,
      color: "#f43f5e",
    },
    {
      label: "CV Download Rate",
      pct: rawPct(resumeDownloads),
      detail: `${resumeDownloads} download${resumeDownloads !== 1 ? "s" : ""} · ${totalViews.toLocaleString()} views`,
      color: "#8b5cf6",
    },
    {
      label: "Unique Rate",
      pct: rawPct(uniqueVisitors),
      detail: `${uniqueVisitors.toLocaleString()} unique · ${totalViews.toLocaleString()} total`,
      color: "#10b981",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map(({ label, pct, detail, color }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl p-3 flex items-center justify-between gap-3"
          style={{
            background: isDark ? `${color}12` : `${color}08`,
            border: `1px solid ${color}22`,
          }}
        >
          <div className="min-w-0">
            <div
              className="font-black tabular-nums"
              style={{ fontSize: 17, color, letterSpacing: "-0.03em", lineHeight: 1 }}
            >
              {fmt(pct)}
            </div>
            <div
              className="font-black uppercase mt-1"
              style={{ fontSize: 8, letterSpacing: "0.1em", color: colors.neutral500, lineHeight: 1.2 }}
            >
              {label}
            </div>
            <div className="mt-1.5 text-[9px]" style={{ color: colors.neutral400, lineHeight: 1.3 }}>
              {detail}
            </div>
          </div>
          {pct !== null && <MiniRing pct={pct} color={color} />}
        </motion.div>
      ))}
    </div>
  );
};

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ dashboardData }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const { user } = useContext(AuthenticatedUserContext);
  const navigate = useNavigate();

  const fullName = dashboardData?.profileSummary?.fullName || user?.fullName || "";
  const profileTitle = dashboardData?.profileSummary?.title || "";
  const profileLoc = dashboardData?.profileSummary?.location || "";
  const profileImg = dashboardData?.profileSummary?.profileImageUrl || "";
  const firstName = fullName.split(" ")[0] || "there";

  const Skeleton = () => (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>
      <div className={isMobile ? "space-y-4" : "col-span-7 space-y-4"}>
        {[60, 280, 200].map((h, i) => (
          <SkeletonBlock key={i} height={h} />
        ))}
      </div>
      <div className={isMobile ? "space-y-4" : "col-span-5 space-y-4"}>
        {[260, 200].map((h, i) => (
          <SkeletonBlock key={i} height={h} />
        ))}
      </div>
    </div>
  );

  const buildFocusChips = () => {
    if (!dashboardData) return [];
    const chips: Array<{ label: string; color: string; route?: string }> = [];

    // Stale unread messages get highest priority (amber warning before generic unread count)
    const STALE_MS = 48 * 3_600_000;
    const staleCount = dashboardData.recentMessages.filter(
      (m) => m.status?.toUpperCase() === "UNREAD" && Date.now() - new Date(m.createdAt).getTime() > STALE_MS
    ).length;
    if (staleCount > 0) {
      chips.push({
        label: `${staleCount} message${staleCount !== 1 ? "s" : ""} unread 48h+`,
        color: "#f59e0b",
        route: "/messages",
      });
    }

    const unread = dashboardData.stats?.unreadMessages ?? 0;
    const freshUnread = unread - staleCount;
    if (freshUnread > 0) {
      chips.push({ label: `${freshUnread} unread ${freshUnread === 1 ? "message" : "messages"}`, color: "#f43f5e", route: "/messages" });
    }

    const pct = dashboardData.profileCompletion?.percentage ?? 100;
    if (pct < 100) {
      chips.push({ label: `Portfolio ${pct}% — improve it`, color: colors.primary600, route: "/profile" });
    }

    const viewsToday = dashboardData.viewStats?.viewsToday ?? 0;
    if (viewsToday > 0) {
      chips.push({ label: `${viewsToday} ${viewsToday === 1 ? "view" : "views"} today`, color: "#10b981" });
    }

    return chips;
  };

  return (
    <div style={{ padding: isMobile ? "12px 10px 24px" : "20px 20px 32px" }}>
      <MilestoneCelebration dashboardData={dashboardData} />

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-4"
      >
        <Card hero>
          <div className="flex items-center justify-between">
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
              <div className="mt-2.5">
                <LiveSiteControl
                  portfolioUrl={dashboardData?.profileSummary?.portfolioUrl}
                  isMobile={isMobile}
                />
              </div>
            </div>

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
          </div>
        </Card>
      </motion.div>

      {!dashboardData ? (
        <Skeleton />
      ) : (
        <div className="space-y-4">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <StatsTemplate stats={dashboardData.stats} />
          </motion.div>

          {(() => {
            const chips = buildFocusChips();
            if (chips.length === 0) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.07 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span
                  className="text-[9px] font-black uppercase tracking-widest shrink-0"
                  style={{ color: colors.neutral400 }}
                >
                  Focus
                </span>
                {chips.map((chip, i) => (
                  <FocusChip
                    key={i}
                    label={chip.label}
                    color={chip.color}
                    onClick={chip.route ? () => navigate(chip.route!) : undefined}
                  />
                ))}
              </motion.div>
            );
          })()}

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <EngagementStrip
              viewStats={dashboardData.viewStats ?? EMPTY_VIEW_STATS}
              stats={dashboardData.stats}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <ViewAnalyticsTemplate viewStats={dashboardData.viewStats ?? EMPTY_VIEW_STATS} />
          </motion.div>

          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-12"}`}>

            {/* Left column */}
            <div className={`space-y-4 ${isMobile ? "" : "col-span-7"}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card hero>
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
                <Card hero>
                  <SectionLabel>Quick Add</SectionLabel>
                  <QuickActionsTemplate missingSections={dashboardData.profileCompletion?.missingSections} />
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
                <Card hero>
                  <SectionLabel>Portfolio Score</SectionLabel>
                  <ProfileCompletionTemplate profileCompletion={dashboardData.profileCompletion} />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                <Card hero>
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
