import { useMemo } from "react";
import type React from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useColors } from "../../../../utils/types";
import { useTheme } from "../../../../contexts/ThemeContext";

// Split out of DashboardUI.tsx (which exports only components) so that file stays
// Fast-Refresh-friendly -- react-refresh/only-export-components flags a file mixing
// component and non-component (hook/function) exports since Fast Refresh can't
// hot-reload it reliably.

/* ─── Motion primitives ──────────────────────────────────────────────────
 * Reserved for "showcase" surfaces (a hero banner, a compact stat tile, a
 * standalone chart panel) — NOT for text-dense list cards (Recent Messages,
 * Activity, checklists), where a constant subtle rotation/offset would make
 * small clickable rows harder to read and target while the user's mouse is
 * right over them. */

/** Cursor-following 3D tilt, capped small (default ±6deg) so it reads as
 * "this surface has weight" rather than a gimmick. Spread the returned
 * `rotateX`/`rotateY` motion values onto a `motion.*` element's `style`
 * (with `transformPerspective`), and the two handlers onto its
 * `onMouseMove`/`onMouseLeave`. */
export const useTilt = (maxDeg = 6) => {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 220, damping: 22, mass: 0.5 });
  const springY = useSpring(py, { stiffness: 220, damping: 22, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxDeg, -maxDeg]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxDeg, maxDeg]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { px.set(0); py.set(0); };

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
};

/** Cursor-magnetic offset — an element nudges a few px toward the cursor
 * within its own bounds, capped and spring-eased back to center on leave.
 * Meant for small, isolated targets (an icon badge, a compact tile) rather
 * than anything with its own internal scroll/click targets. */
export const useMagnetic = (strength = 0.25, max = 10) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * strength;
    const dy = (e.clientY - rect.top - rect.height / 2) * strength;
    x.set(Math.max(-max, Math.min(max, dx)));
    y.set(Math.max(-max, Math.min(max, dy)));
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return { x: springX, y: springY, onMouseMove, onMouseLeave };
};

/* ─── Shared surface language ─────────────────────────────────────────────
 * Previously a "premium glass + glow" look (frosted blur, saturated colored
 * shadows, neon text) layered on top of AmbientAurora's colorful background
 * wash -- replaced with the same restrained surface every other page in the
 * portal already uses (see ListingShell.template.tsx's card: plain neutral
 * background, a neutral border, a soft two-layer shadow with no color in
 * it). Kept as a hook (not a plain style object) so every call site that
 * already depends on it for its surface updates to the calmer look for
 * free, with zero per-file changes -- this is the single source of truth
 * for "what a dashboard card's surface looks like." */
export const useGlassSurface = (_accent?: string): React.CSSProperties => {
  const colors = useColors();
  const { isDark } = useTheme();

  return useMemo<React.CSSProperties>(() => ({
    background: colors.neutral0,
    border: `1.5px solid ${colors.neutral300}`,
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset"
      : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
  }), [isDark, colors.neutral0, colors.neutral300]);
};

/** No-op (same (accent, isDark) signature, both args now ignored) kept only so
 * call sites built around "a KPI number can carry a text shadow" don't need
 * their own follow-up edit -- previously rendered a saturated neon glow
 * behind hero numbers; the portal's actual design language (see
 * ListingShell, every non-Dashboard page) never glows text, so this always
 * returns "none" now. */
export const glowTextShadow = (_accent?: string, _isDark?: boolean): string => "none";
