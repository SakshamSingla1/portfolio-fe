// Device-mix hues below are picked from the design system's validated
// categorical order (see dataviz skill palette.md, slots 1/2/3) — the
// previous ad-hoc blue/purple/amber trio failed the colorblind-separation
// check (deutan ΔE 1.3, normal-vision ΔE 12 — below the 15 floor).
//
// Kept in its own module (not alongside AnalyticsCharts.tsx's components) so
// that file only exports components -- react-refresh/only-export-components
// flags a file mixing component and non-component exports since Fast Refresh
// can't hot-reload it reliably.
export const DEVICE_HUES_LIGHT: Record<string, string> = {
    DESKTOP: "#2a78d6",
    MOBILE: "#eb6834",
    TABLET: "#1baf7a",
};
export const DEVICE_HUES_DARK: Record<string, string> = {
    DESKTOP: "#3987e5",
    MOBILE: "#d95926",
    TABLET: "#199e70",
};
export const DEVICE_LABEL: Record<string, string> = { DESKTOP: "Desktop", MOBILE: "Mobile", TABLET: "Tablet" };
