import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { useColors } from "../../../../utils/types";
import { useCountUp } from "../../../../hooks/useCountUp";

// Minimal, flat surface primitives scoped to the redesigned Analytics page only — the
// app's shared "glass" design system (templates/Dashboard/shared/DashboardUI.tsx) is
// used elsewhere and stays untouched.

interface PanelProps {
  title?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  /** Flat 2px top accent for the page's hero panel(s) only — same restrained
   * language as Dashboard's ShimmerTopline, just without the shimmer. */
  accent?: string;
}

export const Panel: React.FC<PanelProps> = ({ title, icon, right, children, noPadding = false, className = "", accent }) => {
  const colors = useColors();
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ background: colors.neutral0, border: `1px solid ${colors.neutral200}` }}
    >
      {accent && <div style={{ height: 2, background: accent }} />}
      {title && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5">
            {icon && <span style={{ color: colors.neutral400, display: "inline-flex" }}>{icon}</span>}
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.neutral500 }}>
              {title}
            </span>
          </div>
          {right}
        </div>
      )}
      {!noPadding && <div className={`px-4 pb-4 ${title ? "" : "pt-4"}`}>{children}</div>}
      {noPadding && children}
    </div>
  );
};

/** Tinted icon badge for a primary KPI number — the one place on this page a
 * splash of per-metric color earns its keep, same restraint as Dashboard's
 * hero stat cards (flat tint + border, no gradient/glow). */
export const MetricTile: React.FC<{
  label: string;
  icon: React.ReactNode;
  accent: string;
  current: number;
  /** Omit entirely for a tile with no period-over-period comparison (e.g. a streak count) —
   * only pass this when there's an actual previous-period value to compare against. */
  percentChange?: number | null;
}> = ({ label, icon, accent, current, percentChange }) => {
  const colors = useColors();
  const animated = useCountUp(current, 0);
  return (
    <div className="flex items-center gap-3">
      <div
        className="shrink-0 flex items-center justify-center rounded-xl"
        style={{ width: 38, height: 38, background: `${accent}14`, border: `1.5px solid ${accent}25`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.neutral400 }}>
          {label}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-black tabular-nums leading-none"
            style={{ fontSize: "clamp(20px, 2.6vw, 26px)", color: colors.neutral900, letterSpacing: "-0.03em" }}
          >
            {animated.toLocaleString()}
          </span>
          {percentChange !== undefined && <DeltaChip percentChange={percentChange} />}
        </div>
      </div>
    </div>
  );
};

export const DeltaChip: React.FC<{ percentChange: number | null }> = ({ percentChange }) => {
  const colors = useColors();
  if (percentChange === null) {
    return (
      <span className="text-[10px] font-semibold" style={{ color: colors.neutral400 }}>
        no prior data
      </span>
    );
  }
  const up = percentChange >= 0;
  const color = up ? colors.success600 : colors.error600;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color }}>
      {up ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
      {Math.abs(percentChange)}%
    </span>
  );
};
