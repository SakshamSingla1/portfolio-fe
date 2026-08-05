import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";
import Button from "../../atoms/Button/Button";
import { FiPlus, FiSearch, FiFilter, FiChevronUp, FiChevronDown } from "react-icons/fi";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from "@mui/material";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useCountUp } from "../../../hooks/useCountUp";
import { usePermissionHelper } from "../../../hooks/usePermissionHelper";
import { useDebounce } from "../../../utils/helper";

export interface ListingStat {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

interface ListingShellProps {
  title: string;
  description?: string;
  count?: number | null;
  accentColor?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  addButtonLabel?: string;
  addButtonOnClick?: () => void;
  isAddButtonVisible?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterContent?: React.ReactNode;
  stats?: ListingStat[];
}

const StatChip: React.FC<{
  label: string;
  value: number;
  icon?: React.ReactNode;
  accentColor: string;
  colors: ReturnType<typeof useColors>;
}> = ({ label, value, icon, accentColor, colors }) => {
  const animatedValue = useCountUp(value);
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border"
      style={{
        backgroundColor: `${accentColor}10`,
        borderColor: `${accentColor}25`,
        color: accentColor,
      }}
    >
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      <span className="font-black text-sm tabular-nums">{animatedValue}</span>
      <span style={{ color: colors.neutral500 }}>{label}</span>
    </div>
  );
};

const ListingShell: React.FC<ListingShellProps> = ({
  title,
  description,
  count,
  accentColor,
  icon,
  children,
  addButtonLabel,
  addButtonOnClick,
  isAddButtonVisible = true,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterContent,
  stats,
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const { canAdd } = usePermissionHelper();
  const [showFilters, setShowFilters] = useState(false);

  // The text field updates instantly (so typing feels responsive), but the
  // callback that actually drives each page's React Query queryKey/network
  // fetch is debounced — this one shared shell backs ~19 listing pages, and
  // none of them debounced search themselves, so every keystroke was firing
  // a full network request plus a full table recompute.
  const [localSearch, setLocalSearch] = useState(searchValue ?? "");
  useEffect(() => {
    setLocalSearch(searchValue ?? "");
  }, [searchValue]);
  const debouncedSearchChange = useDebounce((val: string) => onSearchChange?.(val), 400);
  const handleSearchInput = (val: string) => {
    setLocalSearch(val);
    debouncedSearchChange(val);
  };

  const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";
  const accent = accentColor ?? colors.primary600;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ padding: isMobile ? "8px 4px 16px" : "16px 16px 24px", position: "relative", overflow: "hidden" }}
    >
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-20%", right: "-8%",
          width: "45vw", height: "45vw",
          background: `radial-gradient(circle, ${accent}, transparent)`,
          filter: "blur(120px)",
          opacity: 0.05,
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: "-10%", left: "-5%",
          width: "30vw", height: "30vw",
          background: `radial-gradient(circle, ${colors.secondary500 ?? colors.neutral400}, transparent)`,
          filter: "blur(100px)",
          opacity: 0.04,
          zIndex: 0,
        }}
      />

      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent} 0%, ${accent}28 100%)` }} />

        <div className={`flex items-center justify-between gap-4 ${isMobile ? "px-3 py-3.5" : "px-5 py-4"}`}>
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {icon && (
              <div
                className="flex items-center justify-center shrink-0 rounded-2xl"
                style={{
                  width: isMobile ? 44 : 52,
                  height: isMobile ? 44 : 52,
                  backgroundColor: `${accent}12`,
                  border: `1.5px solid ${accent}25`,
                  color: accent,
                  fontSize: isMobile ? 18 : 22,
                }}
              >
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1
                  className="font-black tracking-tight m-0"
                  style={{
                    fontSize: isMobile ? 18 : 24,
                    color: colors.neutral900,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {title}
                </h1>
                {count !== null && count !== undefined && Number(count) > 0 && (
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums"
                    style={{
                      background: `${accent}12`,
                      color: accent,
                      border: `1.5px solid ${accent}25`,
                    }}
                  >
                    {count}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs mt-0.5 m-0" style={{ color: colors.neutral400 }}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {isAddButtonVisible && canAdd && (
            <div className="shrink-0">
              <Button
                label={isMobile ? <FiPlus size={18} /> : addButtonLabel}
                variant="primaryContained"
                startIcon={isMobile ? undefined : <FiPlus />}
                onClick={addButtonOnClick}
                size={isMobile ? "small" : "medium"}
                style={
                  isMobile
                    ? {
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }
                    : {}
                }
              />
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div
            className={`flex flex-wrap gap-2 ${isMobile ? "px-3 pb-3" : "px-5 pb-4"}`}
            style={{ borderTop: `1px solid ${colors.neutral100}`, paddingTop: 12 }}
          >
            {stats.map((stat, idx) => (
              <StatChip
                key={idx}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                accentColor={accent}
                colors={colors}
              />
            ))}
          </div>
        )}

        {(onSearchChange || filterContent) && (
          <div
            className={`${isMobile ? "px-3 pb-3" : "px-5 pb-4"}`}
            style={{ borderTop: `1px solid ${colors.neutral100}`, paddingTop: 14 }}
          >
            {isMobile ? (
              <div className="w-full">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between p-3 rounded-lg mb-3 transition-colors duration-200"
                  style={{
                    background: colors.neutral100,
                    color: colors.neutral800,
                    border: `1.5px solid ${colors.neutral300}`,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FiFilter size={18} style={{ color: colors.neutral500 }} />
                    <span>Filters</span>
                  </span>
                  <span className="transform transition-transform duration-200">
                    {showFilters ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </span>
                </button>
                {showFilters && (
                  <div className="space-y-3 pt-1">
                    {onSearchChange && (
                      <TextField
                        placeholder={searchPlaceholder ?? "Search..."}
                        value={localSearch}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" className="pl-[11px]">
                              <FiSearch size={18} />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />
                    )}
                    {filterContent}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                {onSearchChange && (
                  <div className="w-full sm:w-72">
                    <TextField
                      placeholder={searchPlaceholder ?? "Search..."}
                      value={localSearch}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" className="pl-[11px]">
                            <FiSearch size={18} />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  </div>
                )}
                {filterContent}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ListingShell;
