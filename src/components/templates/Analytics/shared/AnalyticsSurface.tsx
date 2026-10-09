import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { useColors } from "../../../../utils/types";

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
}

export const Panel: React.FC<PanelProps> = ({ title, icon, right, children, noPadding = false, className = "" }) => {
  const colors = useColors();
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: colors.neutral0, border: `1px solid ${colors.neutral200}` }}
    >
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
