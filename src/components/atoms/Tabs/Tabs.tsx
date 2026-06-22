import React, { type ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "../../../utils/types";
import { FiChevronDown } from "react-icons/fi";

export interface ITabsSchema {
  label: string;
  component: ReactNode;
  disabled?: boolean;
  value: string;
  icon?: ReactNode;
}

interface TabsProps {
  schema: ITabsSchema[];
  value: string;
  setValue: (value: string) => void;
  fullWidth?: boolean;
  selectedTabStyle?: string;
}

const Tabs: React.FC<TabsProps> = ({
  schema,
  value,
  setValue,
  fullWidth = false,
  selectedTabStyle,
}) => {
  const colors = useColors();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const offsetLeft = el.offsetLeft;
      const elWidth = el.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTo = offsetLeft - containerWidth / 2 + elWidth / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [value]);

  // Track scroll to show fade indicators
  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, [schema]);

  const activeTab = schema.find((t) => t.value === value);

  // ─── Mobile + fullWidth → dropdown picker ───────────────────────────────
  if (isMobile && fullWidth) {
    return (
      <div className="w-full">
        {/* Dropdown trigger button */}
        <div className="relative w-full mb-4">
          <button
            onClick={() => setMobileDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: colors.neutral0,
              border: `1.5px solid ${colors.primary300}`,
              color: colors.primary700,
              boxShadow: `0 2px 10px ${colors.primary100}`,
              minHeight: 48,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span className="flex items-center gap-2">
              {activeTab?.icon && (
                <span style={{ color: colors.primary500 }}>{activeTab.icon}</span>
              )}
              {activeTab?.label ?? "Select tab"}
            </span>
            <motion.span
              animate={{ rotate: mobileDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: colors.primary500 }}
            >
              <FiChevronDown size={16} />
            </motion.span>
          </button>

          <AnimatePresence>
            {mobileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute z-50 w-full mt-1 rounded-2xl overflow-hidden"
                style={{
                  background: colors.neutral0,
                  border: `1.5px solid ${colors.neutral300}`,
                  boxShadow: `0 12px 32px -4px ${colors.neutral900}18`,
                  transformOrigin: "top center",
                }}
              >
                {schema.map((tab, i) => {
                  const isActive = tab.value === value;
                  return (
                    <button
                      key={tab.value}
                      disabled={tab.disabled}
                      onClick={() => {
                        if (!tab.disabled) {
                          setValue(tab.value);
                          setMobileDropdownOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 text-sm font-semibold text-left transition-all duration-150 active:scale-[0.98]"
                      style={{
                        background: isActive ? colors.primary50 : "transparent",
                        color: isActive
                          ? colors.primary700
                          : tab.disabled
                          ? colors.neutral400
                          : colors.neutral700,
                        borderBottom:
                          i < schema.length - 1
                            ? `1px solid ${colors.neutral100}`
                            : "none",
                        minHeight: 48,
                        cursor: tab.disabled ? "not-allowed" : "pointer",
                        opacity: tab.disabled ? 0.5 : 1,
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {tab.icon && (
                        <span
                          style={{
                            color: isActive ? colors.primary500 : colors.neutral400,
                          }}
                        >
                          {tab.icon}
                        </span>
                      )}
                      <span className="flex-1">{tab.label}</span>
                      {isActive && (
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: colors.primary500 }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Panels */}
        <AnimatePresence mode="wait">
          {schema.map(
            (tab) =>
              value === tab.value && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {tab.component}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Default: horizontal scrollable pill strip ──────────────────────────
  // On mobile with many tabs, labels are hidden and only icons are shown
  const iconOnly = isMobile && schema.length > 4 && schema.every((t) => t.icon);

  return (
    <div className="w-full">
      {/* Scrollable tab strip with fade-edge overflow hints */}
      <div className="relative">
        {/* Left fade */}
        {showLeftFade && (
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none rounded-l-2xl"
            style={{
              background: `linear-gradient(to right, ${colors.neutral100}CC, transparent)`,
            }}
          />
        )}
        {/* Right fade */}
        {showRightFade && (
          <div
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none rounded-r-2xl"
            style={{
              background: `linear-gradient(to left, ${colors.neutral100}CC, transparent)`,
            }}
          />
        )}

        <div
          ref={scrollRef}
          className={`flex p-1 rounded-2xl border overflow-x-auto ${fullWidth ? "w-full" : "w-max max-w-full"}`}
          style={{
            backgroundColor: `${colors.neutral100}80`,
            borderColor: colors.neutral300,
            backdropFilter: "blur(8px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {schema.map((tab) => {
            const isActive = value === tab.value;
            return (
              <button
                key={tab.value}
                ref={isActive ? activeRef : undefined}
                onClick={() => !tab.disabled && setValue(tab.value)}
                disabled={tab.disabled}
                title={iconOnly ? tab.label : undefined}
                className={`
                  relative flex items-center justify-center gap-2
                  text-sm font-semibold transition-all duration-300 rounded-xl
                  flex-shrink-0 select-none active:scale-[0.96]
                  ${fullWidth ? "flex-1" : ""}
                  ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  ${selectedTabStyle && isActive ? selectedTabStyle : ""}
                `}
                style={{
                  color: isActive ? colors.primary900 : colors.neutral600,
                  minHeight: 44,
                  padding: iconOnly ? "0" : "10px 16px",
                  width: iconOnly ? 44 : undefined,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Sliding background indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 z-0 rounded-xl shadow-sm"
                    style={{
                      backgroundColor: colors.neutral0,
                      border: `1px solid ${colors.primary200}`,
                      boxShadow: `0 2px 10px ${colors.primary100}`,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  {tab.icon && (
                    <span
                      className={`transition-transform duration-300 ${
                        isActive ? "scale-110" : "scale-100 opacity-70"
                      }`}
                      style={{ color: isActive ? colors.primary500 : "inherit" }}
                    >
                      {tab.icon}
                    </span>
                  )}
                  {!iconOnly && tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {schema.map(
            (tab) =>
              value === tab.value && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {tab.component}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(Tabs);
