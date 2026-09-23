import React, { useMemo, useState } from "react";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import type { IDailyView } from "../../../services/useDashboardService";

interface ViewsHeatmapProps {
  data: IDailyView[];
}

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const WEEKDAY_ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const RANGES = [30, 90] as const;
type Range = (typeof RANGES)[number];

type Cell = IDailyView | null;

const computeStreaks = (list: IDailyView[]): { current: number; longest: number } => {
  let longest = 0;
  let running = 0;
  for (const d of list) {
    if (d.count > 0) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }
  let current = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].count > 0) current++;
    else break;
  }
  return { current, longest };
};

/** GitHub-style contribution calendar for the last ~90 days of portfolio views.
 * Sequential magnitude data gets ONE hue ramped light→dark (per the dataviz
 * skill) — reuses the app's own primary ramp rather than inventing a new hue,
 * so it stays visually consistent with every other primary-tinted chart here. */
const ViewsHeatmap: React.FC<ViewsHeatmapProps> = ({ data: fullData }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const [focused, setFocused] = useState<{ weekIdx: number; dayIdx: number } | null>(null);
  const [range, setRange] = useState<Range>(90);

  const canToggleRange = fullData.length > 30;
  const data = useMemo(
    () => (canToggleRange ? fullData.slice(-range) : fullData),
    [fullData, range, canToggleRange]
  );

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
  const activeDays = data.filter((d) => d.count > 0).length;
  const { current: currentStreak, longest: longestStreak } = useMemo(() => computeStreaks(data), [data]);

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

  const focusedCell = focused ? weeks[focused.weekIdx]?.[focused.dayIdx] : null;

  if (!fullData.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3.5 flex-wrap">
          {currentStreak > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: colors.neutral600 }}>
              🔥 <strong style={{ color: colors.neutral800 }}>{currentStreak}</strong>-day streak
            </span>
          )}
          {longestStreak > currentStreak && (
            <span className="text-[10px] font-medium" style={{ color: colors.neutral400 }}>
              best: {longestStreak}d
            </span>
          )}
          <span className="text-[10px] font-medium" style={{ color: colors.neutral400 }}>
            active {activeDays}/{data.length}d
          </span>
        </div>

        {canToggleRange && (
          <div className="inline-flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${colors.neutral300}` }}>
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => { setRange(r); setFocused(null); }}
                className="px-2 py-0.5 text-[9.5px] font-bold"
                style={{
                  background: range === r ? colors.primary600 : "transparent",
                  color: range === r ? colors.neutral0 : colors.neutral400,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {r}D
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        <div className="inline-flex flex-col gap-2" style={{ minWidth: weeks.length * 17 + 30 }}>
          {/* Month labels */}
          <div className="flex gap-[5px] pl-[26px]">
            {weeks.map((_, weekIdx) => {
              const label = monthLabelFor(weekIdx);
              return (
                <div key={weekIdx} className="text-[8.5px] font-semibold" style={{ width: 12, color: colors.neutral400 }}>
                  {label ?? ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[5px]">
            {/* Weekday row labels */}
            <div className="flex flex-col gap-[5px] shrink-0" style={{ width: 22 }}>
              {WEEKDAY_ROW_LABELS.map((lbl, i) => (
                <div key={i} className="text-[8px] font-medium flex items-center" style={{ height: 12, color: colors.neutral400 }}>
                  {lbl}
                </div>
              ))}
            </div>

            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[5px]">
                {week.map((cell, dayIdx) => {
                  const isFocused = focused?.weekIdx === weekIdx && focused?.dayIdx === dayIdx;
                  return (
                    <div
                      key={dayIdx}
                      onMouseEnter={() => cell && setFocused({ weekIdx, dayIdx })}
                      onMouseLeave={() => setFocused(null)}
                      onClick={() => cell && setFocused(isFocused ? null : { weekIdx, dayIdx })}
                      role={cell ? "button" : undefined}
                      aria-label={cell ? `${cell.count} view${cell.count !== 1 ? "s" : ""} on ${cell.date}` : undefined}
                      className="rounded-[3px] transition-transform duration-100"
                      style={{
                        width: 12,
                        height: 12,
                        background: cell ? levelColors[levelFor(cell.count)] : "transparent",
                        cursor: cell ? "pointer" : "default",
                        transform: isFocused ? "scale(1.35)" : "scale(1)",
                        boxShadow: isFocused
                          ? `0 0 0 1px ${colors.primary600}60`
                          : cell && cell.count > 0
                          ? `0 0 6px -1px ${levelColors[levelFor(cell.count)]}90`
                          : "none",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3.5" style={{ borderTop: `1px solid ${colors.neutral100}` }}>
        <div className="text-[10.5px]" style={{ color: colors.neutral400 }}>
          {focusedCell ? (
            <span>
              <strong style={{ color: colors.neutral700 }}>{focusedCell.count}</strong>{" "}
              view{focusedCell.count !== 1 ? "s" : ""} · {focusedCell.date}
            </span>
          ) : (
            <span>
              <strong style={{ color: colors.neutral700 }}>{totalViews.toLocaleString()}</strong> views in the last {data.length} days
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px]" style={{ color: colors.neutral400 }}>Less</span>
          {levelColors.map((c, i) => (
            <div key={i} className="rounded-[3px]" style={{ width: 10, height: 10, background: c }} />
          ))}
          <span className="text-[8px]" style={{ color: colors.neutral400 }}>More</span>
        </div>
      </div>
    </div>
  );
};

export default ViewsHeatmap;
