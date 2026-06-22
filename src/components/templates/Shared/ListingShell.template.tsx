import React, { useState } from "react";
import { motion } from "framer-motion";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../atoms/Button/Button";
import { FiPlus, FiSearch, FiFilter, FiChevronUp, FiChevronDown } from "react-icons/fi";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from "@mui/material";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useCountUp } from "../../../hooks/useCountUp";

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

const StatCard: React.FC<{
  label: string;
  value: number;
  icon?: React.ReactNode;
  isMobile: boolean;
  accentColor: string;
}> = ({ label, value, icon, isMobile, accentColor }) => {
  const animatedValue = useCountUp(value);
  const colors = useColors();

  return (
    <div
      className="rounded-xl border flex flex-col items-center justify-center text-center p-4 transition-all duration-300 hover:shadow-sm"
      style={{
        background: colors.neutral50,
        borderColor: colors.neutral300,
      }}
    >
      {icon && (
        <div className="mb-1.5 text-lg" style={{ color: accentColor }}>
          {icon}
        </div>
      )}
      <span
        className="text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: colors.neutral400 }}
      >
        {label}
      </span>
      <span
        className="font-extrabold"
        style={{
          fontSize: isMobile ? "20px" : "24px",
          color: colors.neutral900,
        }}
      >
        {animatedValue}
      </span>
    </div>
  );
};

const ListingShell: React.FC<ListingShellProps> = ({
  title,
  description,
  count,
  accentColor,
  children,
  addButtonLabel,
  addButtonOnClick,
  isAddButtonVisible = true,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterContent,
  stats
}) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);

  const cardShadow = isDark
    ? "0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)"
    : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)";

  const accent = accentColor ?? colors.primary600;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ padding: isMobile ? "8px 8px 16px" : "16px 16px 24px" }}
    >
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: colors.neutral0,
          border: `1.5px solid ${colors.neutral300}`,
          boxShadow: cardShadow,
        }}
      >
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}28 100%)`,
          }}
        />

        <div className={`flex items-center justify-between ${isMobile ? "px-4 py-3" : "px-5 py-4"}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className="font-black tracking-tight"
                style={{ fontSize: isMobile ? 17 : 20, color: colors.neutral900, letterSpacing: "-0.025em" }}
              >
                {title}
              </h1>
              {count !== null && Number(count) > 0 && (
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full tabular-nums"
                  style={{
                    background: isDark ? colors.neutral100 : colors.neutral100,
                    color: colors.neutral500,
                    border: `1.5px solid ${colors.neutral300}`,
                  }}
                >
                  {count}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs mt-0.5" style={{ color: colors.neutral400 }}>
                {description}
              </p>
            )}
          </div>
          {isAddButtonVisible && (
            <div>
              <Button
                label={isMobile ? <FiPlus size={18} /> : addButtonLabel}
                variant="primaryContained"
                startIcon={isMobile ? undefined : <FiPlus />}
                onClick={addButtonOnClick}
                size={isMobile ? "small" : "medium"}
                style={isMobile ? { minWidth: 36, width: 36, height: 36, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" } : {}}
              />
            </div>
          )}
        </div>

        {/* Stats Area */}
        {stats && stats.length > 0 && (
          <div
            className={`grid gap-4 ${isMobile ? "grid-cols-2 px-4 pb-3" : `grid-cols-${Math.min(stats.length, 4)} px-5 pb-4`}`}
            style={{ borderTop: `1px solid ${colors.neutral100}`, paddingTop: 16 }}
          >
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                isMobile={isMobile}
                accentColor={accent}
              />
            ))}
          </div>
        )}

        {/* Filters/Search Area */}
        {(onSearchChange || filterContent) && (
          <div
            className={`${isMobile ? "px-4 pb-3" : "px-5 pb-4"}`}
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
                        value={searchValue ?? ""}
                        onChange={(e) => onSearchChange(e.target.value)}
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
                      value={searchValue ?? ""}
                      onChange={(e) => onSearchChange(e.target.value)}
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
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ListingShell;
