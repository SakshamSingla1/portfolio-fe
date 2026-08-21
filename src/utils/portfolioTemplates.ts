import type { TemplateKey } from "../services/useProfileTemplateService";

export interface PortfolioTemplateOption {
    key: TemplateKey;
    name: string;
    description: string;
}

// These 3 are hand-built React component trees shipped in portfolio-main's
// bundle, not admin-authorable data — so unlike Color Themes, this list is a
// fixed constant rather than a paginated catalog fetched from the backend.
export const PORTFOLIO_TEMPLATES: PortfolioTemplateOption[] = [
    { key: "CLASSIC", name: "Classic", description: "The original layout — profile-left hero, clean bordered section cards." },
    { key: "MODERN", name: "Modern", description: "Bold gradient hero, centered layout, pill-shaped accents throughout." },
    { key: "MINIMAL", name: "Minimal", description: "Centered, typography-first hero with tight spacing and flat surfaces." },
];
