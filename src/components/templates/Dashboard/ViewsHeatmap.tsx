import React, { useMemo, useState } from "react";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import type { IDailyView } from "../../../services/useDashboardService";

interface ViewsHeatmapProps {
  data: IDailyView[];
}

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const WEEKDAY_ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type Cell = IDailyView | null;

/** GitHub-style contribution calendar for the last ~90 days of portfolio views.
 * Sequential magnitude data gets ONE hue ramped light→dark (per the dataviz
 * skill) — reuses the app's own primary ramp rather than inventing a new hue,
 * so it stays visually consistent with every other primary-tinted chart here. */
const ViewsHeatmap: React.FC<ViewsHeatmapProps> = ({ data }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState<{ weekIdx: number; dayIdx: number } | null>(null);

  const weeks = useMemo(() => {
    if (!data.length) return [];
    const firstPad = WEEKDAY_INDEX[data[0].day] ?? 0;
    const padded: Cell[] = [...Array(firstPad).fill(null), ...data];
    while (padded.length % 7 !== 0) padded.push(null);

    const result: Cell[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      result.push(padded.slice(i, i + 7));
    }
    return result;
  }, [data]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const totalViews = data.reduce((sum, d) => sum + d.count, 0);

  const levelFor = (count: number): number => {
    if (count <= 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const levelColors = isDark
    ? [colors.neutral200, colors.primary900, colors.primary700, colors.primary500, colors.primary300]
    : [colors.neutral100, colors.primary100, colors.primary300, colors.primary500, colors.primary700];

  const monthLabelFor = (weekIdx: number): string | null => {
    const week = weeks[weekIdx];
    const firstReal = week.find((c) => c !== null);
    if (!firstReal) return null;
    const prevWeek = weekIdx > 0 ? weeks[weekIdx - 1] : null;
    const prevFirstReal = prevWeek?.find((c) => c !== null);
    const month = firstReal.date.split(" ")[0];
    const prevMonth = prevFirstReal?.date.split(" ")[0];
    return month !== prevMonth ? month : null;
  };

  const hoveredCell = hovered ? weeks[hovered.weekIdx]?.[hovered.dayIdx] : null;

  if (!data.length) return null;

  return (
    <div>
      <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
        <div className="inline-flex flex-col gap-1" style={{ minWidth: weeks.length * 13 + 24 }}>
          {/* Month labels */}
          <div className="flex gap-[3px] pl-[22px]">
            {weeks.map((_, weekIdx) => {
              const label = monthLabelFor(weekIdx);
              return (
                <div key={weekIdx} className="text-[8px] font-semibold" style={{ width: 10, color: colors.neutral400 }}>
                  {label ?? ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Weekday row labels */}
            <div className="flex flex-col gap-[3px] shrink-0" style={{ width: 20 }}>
              {WEEKDAY_ROW_LABELS.map((lbl, i) => (
                <div key={i} className="text-[7.5px] font-medium flex items-center" style={{ height: 10, color: colors.neutral400 }}>
                  {lbl}
                </div>
              ))}
            </div>

            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.map((cell, dayIdx) => (
                  <div
                    key={dayIdx}
                    onMouseEnter={() => cell && setHovered({ weekIdx, dayIdx })}
                    onMouseLeave={() => setHovered(null)}
                    className="rounded-[2px] transition-transform duration-100"
                    style={{
                      width: 10,
                      height: 10,
                      background: cell ? levelColors[levelFor(cell.count)] : "transparent",
                      cursor: cell ? "pointer" : "default",
                      transform: hovered?.weekIdx === weekIdx && hovered?.dayIdx === dayIdx ? "scale(1.35)" : "scale(1)",
                      boxShadow: hovered?.weekIdx === weekIdx && hovered?.dayIdx === dayIdx ? `0 0 0 1px ${colors.primary600}60` : "none",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-[10px]" style={{ color: colors.neutral400 }}>
          {hoveredCell ? (
            <span>
              <strong style={{ color: colors.neutral700 }}>{hoveredCell.count}</strong>{" "}
              view{hoveredCell.count !== 1 ? "s" : ""} · {hoveredCell.date}
            </span>
          ) : (
            <span>
              <strong style={{ color: colors.neutral700 }}>{totalViews.toLocaleString()}</strong> views in the last 90 days
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px]" style={{ color: colors.neutral400 }}>Less</span>
          {levelColors.map((c, i) => (
            <div key={i} className="rounded-[2px]" style={{ width: 9, height: 9, background: c }} />
          ))}
          <span className="text-[8px]" style={{ color: colors.neutral400 }}>More</span>
        </div>
      </div>
    </div>
  );
};

export default ViewsHeatmap;
