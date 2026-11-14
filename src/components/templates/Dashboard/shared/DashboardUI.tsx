import React from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../../utils/types";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useGlassSurface } from "./dashboardMotion";

/* ─── Shared surface language ────────────────────────────────────────────
 * Matches the rest of the portal (see ListingShell.template.tsx's card):
 * a plain neutral surface, a neutral border, a soft colorless two-layer
 * shadow, and -- at most -- one or two very faint, static ambient blobs
 * behind the page. Previously this was a "premium glass + glow" look
 * (frosted blur, saturated colored shadows, a continuously animated
 * shimmer sweep, neon text); none of that matched how every other admin
 * page already looks, so the Dashboard read as a different product.
 *
 * useGlassSurface/useTilt/useMagnetic/glowTextShadow live in ./dashboardMotion
 * (not here) so this file exports only components -- react-refresh/only-export-
 * components flags a file mixing component and non-component exports since
 * Fast Refresh can't hot-reload it reliably. */

/** Two faint, static color washes behind a page's cards -- the same
 * treatment ListingShell.template.tsx already uses (so this page reads as
 * the same product as every other admin page), just reused here instead of
 * each page hand-rolling its own pair of divs. Deliberately not animated
 * and capped at a very low opacity: a barely-there ambient tint, not a
 * decoration you're meant to notice. Parent must be `position: relative`
 * (and ideally `overflow: hidden`) so the blobs stay clipped to that
 * section instead of bleeding into the rest of the app shell. */
export const AmbientAurora: React.FC<{ className?: string; accent?: string }> = ({ className = "", accent }) => {
  const colors = useColors();
  const tint = accent ?? colors.primary600;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      <div
        className="absolute rounded-full"
        style={{
          top: "-20%", right: "-8%",
          width: "45vw", height: "45vw",
          background: `radial-gradient(circle, ${tint}, transparent)`,
          filter: "blur(120px)",
          opacity: 0.05,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-10%", left: "-5%",
          width: "30vw", height: "30vw",
          background: `radial-gradient(circle, ${colors.neutral400}, transparent)`,
          filter: "blur(100px)",
          opacity: 0.04,
        }}
      />
    </div>
  );
};

/** A flat, static gradient accent bar -- the same topline ListingShell's
 * header card uses. No longer animated (it used to carry a continuously
 * sweeping light streak); a calm admin dashboard doesn't need a looping
 * animation on every card, all the time, whether or not anything changed. */
export const ShimmerTopline: React.FC<{ color: string; color2?: string }> = ({ color, color2 }) => (
  <div style={{ height: 3, background: `linear-gradient(90deg, ${color} 0%, ${color2 ?? `${color}28`} 100%)` }} />
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds the flat accent topline used by section header panels, so any
   * section can opt into the same "this is a header/primary panel" cue. */
  hero?: boolean;
  noPadding?: boolean;
  /** Tints the topline when hero is set; defaults to the theme's primary hue. */
  accent?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", hero = false, noPadding = false, accent }) => {
  const colors = useColors();
  const surface = useGlassSurface();
  const topline = accent ?? colors.primary600;

  return (
    <div className={`rounded-2xl overflow-hidden relative ${className}`} style={surface}>
      {hero && <ShimmerTopline color={topline} color2={accent ?? colors.primary400} />}
      <div className={noPadding ? "" : "p-5 sm:p-6"}>{children}</div>
    </div>
  );
};

interface SectionLabelProps {
  children: React.ReactNode;
  count?: number;
  accent?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, count, accent }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  return (
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
};

interface PageHeaderBannerProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

/** Shared banner used by Analytics (and available to any other top-level page)
 * so every section header in the admin shares one visual language: icon chip +
 * title + subtitle + gradient accent topline, instead of each page hand-rolling
 * its own variant. */
export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({ icon, title, subtitle, right }) => {
  const colors = useColors();

  return (
    <Card hero className="mb-4">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 38, height: 38, background: `${colors.primary500}12`, color: colors.primary600 }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h1
              className="font-black tracking-tight truncate"
              style={{ fontSize: 20, color: colors.neutral900, letterSpacing: "-0.025em", margin: 0 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs mt-0.5 truncate" style={{ color: colors.neutral400 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </Card>
  );
};

export const SkeletonBlock: React.FC<{ height: number; className?: string }> = ({ height, className = "" }) => {
  const colors = useColors();
  return (
    <div
      className={`rounded-2xl animate-pulse ${className}`}
      style={{ height, background: colors.neutral100 }}
    />
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => {
  const colors = useColors();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-10 px-6 rounded-xl"
      style={{ border: `1px dashed ${colors.neutral200}` }}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xl"
          style={{ background: colors.primary50, color: colors.primary500 }}
        >
          {icon}
        </div>
      )}
      <div className="text-sm font-semibold" style={{ color: colors.neutral600 }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs mt-1 max-w-[280px]" style={{ color: colors.neutral400 }}>
          {subtitle}
        </div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
};
