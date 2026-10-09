// Shared, pure formatting helpers for portfolio-view analytics — used by both the home
// Dashboard's "Portfolio Views" widget (ViewAnalytics.template.tsx) and the dedicated
// Analytics page, so the two don't drift with duplicated copies of the same logic.

export const COUNTRY_TO_CODE: Record<string, string> = {
    "United States": "US", "United Kingdom": "GB", "India": "IN", "Germany": "DE", "France": "FR",
    "Canada": "CA", "Australia": "AU", "Pakistan": "PK", "Brazil": "BR", "Japan": "JP", "China": "CN",
    "Russia": "RU", "South Korea": "KR", "Netherlands": "NL", "Italy": "IT", "Spain": "ES", "Mexico": "MX",
    "Indonesia": "ID", "Turkey": "TR", "Saudi Arabia": "SA", "Poland": "PL", "Sweden": "SE", "Switzerland": "CH",
    "Singapore": "SG", "UAE": "AE", "South Africa": "ZA", "Nigeria": "NG", "Egypt": "EG", "Argentina": "AR",
    "Colombia": "CO", "Malaysia": "MY", "Thailand": "TH", "Vietnam": "VN", "Philippines": "PH", "Bangladesh": "BD",
    "Ukraine": "UA", "Portugal": "PT", "Belgium": "BE", "Austria": "AT", "Denmark": "DK", "New Zealand": "NZ",
    "Ireland": "IE", "Romania": "RO", "Chile": "CL", "Norway": "NO", "Finland": "FI", "Czech Republic": "CZ",
    "Israel": "IL", "Iran": "IR", "Morocco": "MA", "Ghana": "GH", "Kenya": "KE",
};

export const countryFlag = (cc?: string): string => {
    if (!cc || cc.length !== 2) return "🌐";
    return cc.toUpperCase().replace(/./g, (c) =>
        String.fromCodePoint(c.charCodeAt(0) + 127397)
    );
};

export const relTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (s < 60) return "just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d === 1) return "yesterday";
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const exactTime = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        "  " + d.toLocaleDateString([], { month: "short", day: "numeric" });
};
