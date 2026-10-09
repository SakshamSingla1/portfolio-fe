import React, { useState, useRef, useEffect } from "react";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { exportToCsv } from "../../../utils/csvExport";
import { exportToJson } from "../../../utils/jsonExport";
import type { IPortfolioView } from "../../../services/useDashboardService";

interface ExportMenuProps {
  recentViews: IPortfolioView[];
  rangeLabel: string;
}

const flattenViews = (views: IPortfolioView[]) =>
  views.map((v) => ({
    timestamp: v.timestamp,
    device: v.device,
    browser: v.browser ?? "",
    os: v.os ?? "",
    country: v.country ?? "",
    city: v.city ?? "",
    referrer: v.referrer,
    sessionId: v.sessionId,
  }));

const ExportMenu: React.FC<ExportMenuProps> = ({ recentViews, rangeLabel }) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabled = recentViews.length === 0;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filenameBase = `portfolio-views-${rangeLabel.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-opacity"
        style={{
          border: `1px solid ${colors.neutral300}`,
          color: colors.neutral600,
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <FiDownload size={12} /> Export <FiChevronDown size={10} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 rounded-lg overflow-hidden z-20"
          style={{
            background: colors.neutral0,
            border: `1px solid ${colors.neutral300}`,
            boxShadow: `0 8px 24px -4px ${colors.neutral900}20`,
            minWidth: 150,
          }}
        >
          <button
            onClick={() => { exportToCsv(filenameBase, flattenViews(recentViews)); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-[11px] font-semibold"
            style={{ background: "transparent", border: "none", color: colors.neutral700, cursor: "pointer" }}
          >
            Export as CSV
          </button>
          <button
            onClick={() => { exportToJson(filenameBase, flattenViews(recentViews)); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-[11px] font-semibold"
            style={{
              background: "transparent",
              border: "none",
              borderTop: `1px solid ${colors.neutral100}`,
              color: colors.neutral700,
              cursor: "pointer",
            }}
          >
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
