/** Single source of truth for "which hue means which content type" on the
 * Dashboard. Before this, Stats/QuickActions/ProfileCompletion/RecentActivities
 * each invented their own hex per category independently, so the same
 * category (e.g. "Projects") could be violet in one widget and blue in
 * another -- the inconsistency is what reads as "arbitrary," not the number
 * of colors. Every widget should import from here instead of hardcoding hex.
 */
export const SECTION_COLORS = {
  profile: "#0ea5e9",
  projects: "#8b5cf6",
  skills: "#6366f1",
  experience: "#10b981",
  education: "#3b82f6",
  messages: "#a855f7",
  testimonials: "#f43f5e",
  certifications: "#06b6d4",
  achievements: "#f59e0b",
  social: "#ec4899",
} as const;

export type SectionKey = keyof typeof SECTION_COLORS;

/** Same idea, for the three portfolio-performance metrics that appear on both
 * the Dashboard (EngagementStrip, the analytics card's hero) and the
 * dedicated /analytics page (OverviewPanel's KPI tiles) -- without this they
 * drifted independently too (Dashboard had CV Downloads as violet and Unique
 * as emerald; Analytics had them the other way around). "Views" matches the
 * brand primary color used for it throughout the Dashboard's own analytics
 * widget, so it isn't listed as a separate hex here -- pass colors.primary600.
 */
export const METRIC_COLORS = {
  uniqueVisitors: "#8b5cf6",
  resumeDownloads: "#10b981",
} as const;
