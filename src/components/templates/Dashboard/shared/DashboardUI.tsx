import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../../utils/types";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useCardShadow } from "../../../../hooks/useCardShadow";

/* ─── Glass design system ────────────────────────────────────────────────
 * One shared surface language for the "premium glass + glow" dashboard
 * look: frosted, translucent panels floating over the AmbientAurora wash
 * below, with a soft colored glow instead of a flat drop shadow. Every
 * widget on the dashboard pulls from these same few primitives so the
 * whole page reads as one coherent design rather than each panel
 * reinventing its own blur/glow values. */

/** Frosted-glass surface style: translucent gradient fill + backdrop blur +
 * a soft ambient glow in `accent` (defaults to the theme's primary hue).
 * Needs something colorful behind it (see AmbientAurora) to actually read
 * as "glass" rather than a plain tinted card. */
export const useGlassSurface = (accent?: string): React.CSSProperties => {
  const colors = useColors();
  const { isDark } = useTheme();
  const glow = accent ?? colors.primary500;

  return useMemo<React.CSSProperties>(() => ({
    background: isDark
      ? `linear-gradient(135deg, ${colors.neutral100}A8 0%, ${colors.neutral50}C4 100%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.46) 0%, rgba(250,251,255,0.30) 100%)`,
    backdropFilter: "blur(28px) saturate(190%)",
    WebkitBackdropFilter: "blur(28px) saturate(190%)",
    border: isDark ? `1px solid ${glow}45` : `1px solid ${glow}35`,
    boxShadow: isDark
      ? `0 1px 0 rgba(255,255,255,0.06) inset, 0 28px 56px -18px rgba(0,0,0,0.6), 0 0 56px -10px ${glow}70`
      : `0 1px 0 rgba(255,255,255,0.95) inset, 0 24px 52px -16px ${glow}55, 0 0 32px -6px ${glow}30, 0 4px 14px rgba(15,23,42,0.06)`,
  }), [isDark, glow, colors.neutral100, colors.neutral50]);
};

/** Soft glow behind hero numbers/icons — pairs with useGlassSurface so a
 * KPI reads as luminous rather than flat black-on-white text. */
export const glowTextShadow = (accent: string, isDark: boolean): string =>
  isDark
    ? `0 0 32px ${accent}B0, 0 0 12px ${accent}90`
    : `0 0 28px ${accent}70, 0 0 10px ${accent}50`;

/** Slow-drifting blurred color blobs meant to sit behind a page's glass cards
 * (absolute, inset:0, z-index 0) — the vivid "aurora" a frosted panel needs
 * behind it to actually read as glass instead of a plain translucent card.
 * Spread across percentages of the full container height so a long,
 * data-heavy page (this one can run 3000px+) stays colorful top to bottom
 * instead of only near its very top/bottom edges. Parent must be
 * `position: relative` (and ideally `overflow: hidden`) so the blobs stay
 * clipped to that section instead of bleeding into the rest of the app shell. */
export const AmbientAurora: React.FC<{ className?: string }> = ({ className = "" }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const a = isDark ? "52" : "3D";

  interface Blob {
    color: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    size: number;
    dur: number;
    dx: number[];
    dy: number[];
  }

  const blobs: Blob[] = [
    { color: colors.primary500, top: "-6%", left: "-10%", size: 620, dur: 26, dx: [0, 40, -20, 0], dy: [0, 28, -22, 0] },
    { color: "#8b5cf6", top: "2%", right: "-14%", size: 520, dur: 32, dx: [0, -34, 20, 0], dy: [0, 28, -18, 0] },
    { color: "#ec4899", top: "22%", left: "35%", size: 460, dur: 29, dx: [0, -24, 30, 0], dy: [0, 20, -24, 0] },
    { color: "#14b8a6", top: "42%", left: "-8%", size: 540, dur: 24, dx: [0, 30, -20, 0], dy: [0, -22, 26, 0] },
    { color: "#f59e0b", top: "58%", right: "-10%", size: 480, dur: 30, dx: [0, -26, 22, 0], dy: [0, 24, -20, 0] },
    { color: "#6366f1", top: "78%", left: "18%", size: 560, dur: 27, dx: [0, 26, -30, 0], dy: [0, -20, 24, 0] },
    { color: "#14b8a6", bottom: "-8%", right: "8%", size: 500, dur: 23, dx: [0, 22, -30, 0], dy: [0, -18, 22, 0] },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color}${a} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{ x: b.dx, y: b.dy }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds the gradient accent topline + frosted-glass surface used by the
   * analytics-style "hero" panels, so any section can opt into the same premium
   * surface treatment instead of a flat card. */
  hero?: boolean;
  noPadding?: boolean;
  /** Tints the glass glow + accent topline; defaults to the theme's primary hue. */
  accent?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", hero = false, noPadding = false, accent }) => {
  const colors = useColors();
  const shadow = useCardShadow();
  const glass = useGlassSurface(accent);
  const topline = accent ?? colors.primary600;

  return (
    <div
      className={`rounded-2xl overflow-hidden relative ${className}`}
      style={hero ? glass : { background: colors.neutral0, border: `1.5px solid ${colors.neutral300}`, boxShadow: shadow }}
    >
      {hero && (
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${topline}, ${accent ?? colors.primary400})`,
            boxShadow: `0 0 12px ${topline}80`,
          }}
        />
      )}
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
