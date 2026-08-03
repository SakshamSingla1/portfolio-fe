import React from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../../utils/types";
import { useTheme } from "../../../../contexts/ThemeContext";

/* ─── Shared shadow / surface tokens ────────────────────────────
   One scale used across every Dashboard + Analytics card so the
   whole surface reads as a single, consistent design language
   instead of some sections having a "hero" treatment and others
   being flat. ────────────────────────────────────────────────── */
export const useCardShadow = (): string => {
  const { isDark } = useTheme();
  return isDark
    ? "0 2px 8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset"
    : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)";
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds the gradient accent topline + soft tinted background wash used by the
   * analytics-style "hero" panels, so any section can opt into the same premium
   * surface treatment instead of a flat card. */
  hero?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", hero = false, noPadding = false }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const shadow = useCardShadow();

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: hero
          ? isDark
            ? `linear-gradient(135deg, ${colors.neutral50} 0%, ${colors.neutral0} 100%)`
            : `linear-gradient(135deg, #fafbff 0%, #ffffff 100%)`
          : colors.neutral0,
        border: `1.5px solid ${colors.neutral300}`,
        boxShadow: shadow,
      }}
    >
      {hero && (
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${colors.primary600}, ${colors.primary400})`,
          }}
        />
      )}
      <div className={noPadding ? "" : "p-4 sm:p-5"}>{children}</div>
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
