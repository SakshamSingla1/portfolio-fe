import { useTheme } from "../contexts/ThemeContext";

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
