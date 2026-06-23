import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiChevronDown, FiSave } from "react-icons/fi";
import { useColors, HTTP_STATUS } from "../../../utils/types";
import { useSeoMetaService, type PageKey, type SeoMetaDTO } from "../../../services/useSeoMetaService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";

const PAGES: { key: PageKey; label: string; description: string }[] = [
    { key: "HOME", label: "Home Page", description: "Main portfolio landing page" },
    { key: "EDUCATION", label: "Education Page", description: "Education & certifications section" },
];

const empty = (key: PageKey): SeoMetaDTO => ({
    pageKey: key, title: "", description: "", keywords: [],
    ogTitle: "", ogDescription: "", ogImageUrl: "", canonicalUrl: "",
    indexable: true, followLinks: true,
});

const SeoTab: React.FC = () => {
    const colors = useColors();
    const seoService = useSeoMetaService();
    const { showSnackbar } = useSnackbar();

    const [activeKey, setActiveKey] = useState<PageKey>("HOME");
    const [data, setData] = useState<Record<PageKey, SeoMetaDTO>>({
        HOME: empty("HOME"),
        EDUCATION: empty("EDUCATION"),
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        seoService.getAll().then((res: any) => {
            if (res?.status === HTTP_STATUS.OK) {
                const list: SeoMetaDTO[] = res.data.data ?? [];
                setData(prev => {
                    const next = { ...prev };
                    list.forEach(item => { if (item.pageKey) next[item.pageKey] = item; });
                    return next;
                });
            }
        });
    }, []);

    const current = data[activeKey];

    const update = (field: keyof SeoMetaDTO, value: any) => {
        setData(prev => ({ ...prev, [activeKey]: { ...prev[activeKey], [field]: value } }));
    };

    const handleKeywordsChange = (raw: string) => {
        update("keywords", raw.split(",").map(s => s.trim()).filter(Boolean));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await seoService.upsert(current);
            if (res?.status === HTTP_STATUS.OK) {
                setData(prev => ({ ...prev, [activeKey]: res.data.data }));
                showSnackbar("success", "SEO settings saved");
            }
        } catch {
            showSnackbar("error", "Failed to save SEO settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "24px", width: "100%" }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center justify-center p-2 rounded-xl"
                    style={{ background: colors.primary100, color: colors.primary600 }}>
                    <FiSearch size={20} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: colors.neutral900 }}>SEO Settings</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: colors.neutral500 }}>
                Control how each page appears in search engines and social previews.
            </p>

            {/* Page selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {PAGES.map(p => (
                    <button key={p.key} onClick={() => setActiveKey(p.key)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                            background: activeKey === p.key ? `${colors.primary500}15` : colors.neutral100,
                            color: activeKey === p.key ? colors.primary600 : colors.neutral500,
                            border: `1.5px solid ${activeKey === p.key ? colors.primary400 : colors.neutral200}`,
                        }}>
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {/* Basic SEO */}
                <SectionCard title="Search Engine" colors={colors}>
                    <TextField label="Page Title" value={current.title ?? ""} onChange={e => update("title", e.target.value)}
                        helperText="Recommended: 50–60 characters" />
                    <TextField label="Meta Description" value={current.description ?? ""}
                        onChange={e => update("description", e.target.value)} multiline rows={3}
                        helperText="Recommended: 150–160 characters" />
                    <TextField label="Keywords (comma-separated)" value={(current.keywords ?? []).join(", ")}
                        onChange={e => handleKeywordsChange(e.target.value)}
                        helperText="e.g. developer, portfolio, react" />
                    <TextField label="Canonical URL" value={current.canonicalUrl ?? ""}
                        onChange={e => update("canonicalUrl", e.target.value)} />
                    <div className="flex gap-4 flex-wrap">
                        <Toggle label="Allow indexing" checked={current.indexable ?? true}
                            onChange={v => update("indexable", v)} colors={colors} />
                        <Toggle label="Follow links" checked={current.followLinks ?? true}
                            onChange={v => update("followLinks", v)} colors={colors} />
                    </div>
                </SectionCard>

                {/* OG / Social */}
                <SectionCard title="Social Preview (Open Graph)" colors={colors} collapsible>
                    <TextField label="OG Title" value={current.ogTitle ?? ""} onChange={e => update("ogTitle", e.target.value)}
                        helperText="Defaults to Page Title if empty" />
                    <TextField label="OG Description" value={current.ogDescription ?? ""}
                        onChange={e => update("ogDescription", e.target.value)} multiline rows={3} />
                    <TextField label="OG Image URL" value={current.ogImageUrl ?? ""}
                        onChange={e => update("ogImageUrl", e.target.value)}
                        helperText="Recommended: 1200×630px" />
                </SectionCard>

                <div className="flex justify-end">
                    <Button label={saving ? "Saving…" : "Save Changes"} variant="primaryContained"
                        disabled={saving} startIcon={<FiSave size={14} />} onClick={handleSave} />
                </div>
            </div>
        </motion.div>
    );
};

const SectionCard: React.FC<{
    title: string; colors: any; collapsible?: boolean; children: React.ReactNode;
}> = ({ title, colors, collapsible, children }) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${colors.neutral200}` }}>
            <button
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
                style={{ background: colors.neutral50, color: colors.neutral700, cursor: collapsible ? "pointer" : "default" }}
                onClick={() => collapsible && setOpen(o => !o)}
            >
                {title}
                {collapsible && <FiChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />}
            </button>
            {open && <div className="flex flex-col gap-4 p-4">{children}</div>}
        </div>
    );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; colors: any }> = ({ label, checked, onChange, colors }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
        <div onClick={() => onChange(!checked)} className="relative" style={{ width: 36, height: 20 }}>
            <div className="rounded-full transition-colors duration-200"
                style={{ width: 36, height: 20, background: checked ? colors.primary500 : colors.neutral300 }} />
            <div className="absolute top-1 rounded-full transition-all duration-200"
                style={{ width: 14, height: 14, background: "#fff", left: checked ? 19 : 3, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
        <span className="text-sm" style={{ color: colors.neutral700 }}>{label}</span>
    </label>
);

export default SeoTab;
