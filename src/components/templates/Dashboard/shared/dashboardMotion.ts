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

/* ─── Glass design system ────────────────────────────────────────────────
 * One shared surface language for the "premium glass + glow" dashboard
 * look: frosted, translucent panels floating over the AmbientAurora wash
 * below, with a soft colored glow instead of a flat drop shadow. Every
 * widget on the dashboard pulls from these same few primitives so the
 * whole page reads as one coherent design rather than each panel
 * reinventing its own blur/glow values. */

/** Frosted-glass surface style: translucent gradient fill + backdrop blur +
 * a soft ambient glow in `accent` (defaults to the theme's primary hue).
 * Needs something colorful behind it (see AmbientAurora) to actually read
 * as "glass" rather than a plain tinted card. */
export const useGlassSurface = (accent?: string): React.CSSProperties => {
  const colors = useColors();
  const { isDark } = useTheme();
  const glow = accent ?? colors.primary500;

  return useMemo<React.CSSProperties>(() => ({
    background: isDark
      ? `linear-gradient(135deg, ${colors.neutral100}A8 0%, ${colors.neutral50}C4 100%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.46) 0%, rgba(250,251,255,0.30) 100%)`,
    backdropFilter: "blur(28px) saturate(190%)",
    WebkitBackdropFilter: "blur(28px) saturate(190%)",
    border: isDark ? `1px solid ${glow}5A` : `1px solid ${glow}48`,
    boxShadow: isDark
      ? `0 1px 0 rgba(255,255,255,0.08) inset, 0 32px 64px -18px rgba(0,0,0,0.65), 0 0 72px -8px ${glow}90`
      : `0 1px 0 rgba(255,255,255,0.95) inset, 0 28px 60px -16px ${glow}70, 0 0 44px -4px ${glow}45, 0 4px 14px rgba(15,23,42,0.07)`,
  }), [isDark, glow, colors.neutral100, colors.neutral50]);
};

/** Soft glow behind hero numbers/icons — pairs with useGlassSurface so a
 * KPI reads as luminous rather than flat black-on-white text. */
export const glowTextShadow = (accent: string, isDark: boolean): string =>
  isDark
    ? `0 0 40px ${accent}D0, 0 0 18px ${accent}B0, 0 0 6px ${accent}90`
    : `0 0 34px ${accent}90, 0 0 14px ${accent}70, 0 0 4px ${accent}50`;
