import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useColors } from "../../../utils/types";
import { useIsMobile } from "../../../hooks/useIsMobile";
import DatePicker from "../../atoms/DatePicker/DatePicker";
import type { IAnalyticsRangeKey } from "../../../services/useDashboardService";

interface RangeValue {
  range: IAnalyticsRangeKey;
  startDate?: string;
  endDate?: string;
}

interface RangeControlProps {
  value: RangeValue;
  onChange: (next: RangeValue) => void;
}

const PRESETS: { key: IAnalyticsRangeKey; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "custom", label: "Custom" },
];

const RangeControl: React.FC<RangeControlProps> = ({ value, onChange }) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const { range, startDate, endDate } = value;

  return (
    <div className={`flex items-center gap-2 ${isMobile ? "flex-wrap" : ""}`}>
      <div className="inline-flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${colors.neutral300}` }}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onChange({ range: p.key, startDate, endDate })}
            className="px-3 py-1.5 text-[11px] font-bold transition-colors"
            style={{
              background: range === p.key ? colors.primary600 : "transparent",
              color: range === p.key ? colors.neutral0 : colors.neutral500,
              border: "none",
              cursor: "pointer",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {range === "custom" && (
        <div className="flex items-center gap-2">
          <DatePicker
            value={startDate ? dayjs(startDate) : null}
            onChange={(v: Dayjs | null) => onChange({ range: "custom", startDate: v?.format("YYYY-MM-DD"), endDate })}
            maxDate={endDate ? dayjs(endDate) : dayjs()}
            fullWidth={false}
            textFieldProps={{ size: "small", style: { width: 130 } }}
          />
          <span style={{ color: colors.neutral400, fontSize: 11 }}>to</span>
          <DatePicker
            value={endDate ? dayjs(endDate) : null}
            onChange={(v: Dayjs | null) => onChange({ range: "custom", startDate, endDate: v?.format("YYYY-MM-DD") })}
            minDate={startDate ? dayjs(startDate) : undefined}
            maxDate={dayjs()}
            fullWidth={false}
            textFieldProps={{ size: "small", style: { width: 130 } }}
          />
        </div>
      )}
    </div>
  );
};

export default RangeControl;
