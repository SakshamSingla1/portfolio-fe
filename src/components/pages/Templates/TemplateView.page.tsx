import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiEdit2, FiArrowLeft, FiMail, FiMessageSquare, FiMessageCircle,
    FiCopy, FiCheck, FiZap, FiEye, FiCode, FiCalendar, FiDatabase,
} from "react-icons/fi";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplate } from "../../../services/useTemplateService";
import { HTTP_STATUS } from "../../../utils/types";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { DateUtils, makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";

const TABS = [
    { key: "email",    label: "Email",    flag: "isEmail"    as const, Icon: FiMail },
    { key: "sms",      label: "SMS",      flag: "isSms"      as const, Icon: FiMessageSquare },
    { key: "whatsapp", label: "WhatsApp", flag: "isWhatsapp" as const, Icon: FiMessageCircle },
];

const VAR_REGEX = /\{\{(\w+)\}\}/g;

const extractVars = (text: string): string[] => {
    const found = new Set<string>();
    let match: RegExpExecArray | null;
    VAR_REGEX.lastIndex = 0;
    while ((match = VAR_REGEX.exec(text)) !== null) found.add(match[1]);
    return Array.from(found);
};

const substituteVars = (text: string, vals: Record<string, string>): string =>
    text.replace(/\{\{(\w+)\}\}/g, (_, k) => vals[k] ?? `{{${k}}}`);

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// ── Skeleton ────────────────────────────────────────────────────────────────────
const LoadingSkeleton: React.FC<{ colors: ReturnType<typeof useColors> }> = ({ colors }) => (
    <div className="grid gap-y-6 max-w-4xl animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg" style={{ background: colors.neutral200 }} />
                <div>
                    <div className="h-6 w-48 rounded" style={{ background: colors.neutral200 }} />
                    <div className="h-4 w-32 rounded mt-1" style={{ background: colors.neutral100 }} />
                </div>
            </div>
            <div className="h-9 w-32 rounded-lg" style={{ background: colors.neutral200 }} />
        </div>
        <div className="h-4 w-64 rounded" style={{ background: colors.neutral100 }} />
        <div className="rounded-xl h-64" style={{ background: colors.neutral100 }} />
    </div>
);

// ── Copy button ─────────────────────────────────────────────────────────────────
const CopyButton: React.FC<{ text: string; label?: string; colors: ReturnType<typeof useColors>; isDark: boolean }> = ({
    text, label = "Copy", colors, isDark,
}) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text).catch(() => null);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all font-medium"
            style={{
                color: copied ? colors.success600 : colors.neutral400,
                background: isDark ? colors.neutral800 : colors.neutral100,
                border: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}`,
            }}
        >
            {copied ? <FiCheck size={11} /> : <FiCopy size={11} />}
            {copied ? "Copied!" : label}
        </button>
    );
};

// ── Field row ───────────────────────────────────────────────────────────────────
const FieldRow: React.FC<{
    label: string; value: string; icon?: React.ReactNode;
    copyable?: boolean; mono?: boolean;
    colors: ReturnType<typeof useColors>; isDark: boolean;
}> = ({ label, value, icon, copyable = false, mono = false, colors, isDark }) => (
    <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: colors.neutral400 }}>
            {icon}
            {label}
        </div>
        <div
            className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg"
            style={{ background: isDark ? colors.neutral800 : colors.neutral50, border: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}` }}
        >
            <p className={`text-sm flex-1 break-all ${mono ? "font-mono" : ""}`} style={{ color: colors.neutral800 }}>
                {value}
            </p>
            {copyable && <CopyButton text={value} colors={colors} isDark={isDark} />}
        </div>
    </div>
);

// ── Variable highlight renderer ─────────────────────────────────────────────────
const HighlightedBody: React.FC<{
    html: string; varValues: Record<string, string>;
    colors: ReturnType<typeof useColors>; isDark: boolean;
}> = ({ html, varValues, colors, isDark }) => {
    const rendered = substituteVars(html, varValues);
    return (
        <div
            className="prose prose-sm max-w-none text-sm overflow-auto"
            style={{
                color: colors.neutral800,
                background: isDark ? colors.neutral900 : colors.neutral0,
                border: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}`,
                borderRadius: 12,
                padding: "16px 20px",
                maxHeight: 420,
            }}
            dangerouslySetInnerHTML={{ __html: rendered || "<em style='color: gray'>No body content</em>" }}
        />
    );
};

// ── Main Page ───────────────────────────────────────────────────────────────────
const TemplateViewPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const templateService = useTemplateService();
    const colors = useColors();
    const { isDark } = useTheme();

    const [template, setTemplate] = useState<INotificationTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("email");
    const [varValues, setVarValues] = useState<Record<string, string>>({});
    const [bodyView, setBodyView] = useState<"preview" | "source">("preview");

    useEffect(() => {
        setLoading(true);
        templateService.getTemplateById(Number(id))
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const t = res.data.data;
                    setTemplate(t);
                    const first = TABS.find((tab) => t[tab.flag] === 1);
                    if (first) setActiveTab(first.key);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const goBack = () => navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {
        query: { page: searchParams.get("page") || "", size: searchParams.get("size") || "", search: searchParams.get("search") || "" },
    }));

    const goEdit = () => navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_EDIT, {
        query: { page: searchParams.get("page") || "", size: searchParams.get("size") || "", search: searchParams.get("search") || "" },
        params: { id },
    }));

    const getBodyContent = (tab: string) => {
        if (tab === "email")    return template?.messageBody    || "";
        if (tab === "sms")      return template?.message        || "";
        if (tab === "whatsapp") return template?.whatsappTemplateBody || "";
        return "";
    };

    const currentBody    = getBodyContent(activeTab);
    const currentSubject = activeTab === "email" ? (template?.subject || "") : "";

    const detectedVars = useMemo(() => {
        const fromBody    = extractVars(stripHtml(currentBody));
        const fromSubject = extractVars(currentSubject);
        return Array.from(new Set([...fromSubject, ...fromBody]));
    }, [currentBody, currentSubject, activeTab]);

    const previewSubject = useMemo(() => substituteVars(currentSubject, varValues), [currentSubject, varValues]);

    if (loading) return (
        <div className="p-6">
            <LoadingSkeleton colors={colors} />
        </div>
    );

    if (!template) return (
        <div
            className="flex flex-col items-center justify-center h-64 rounded-2xl gap-3"
            style={{ border: `1.5px dashed ${colors.neutral300}`, color: colors.neutral400 }}
        >
            <FiDatabase size={28} />
            <p className="text-sm font-medium">Template not found</p>
        </div>
    );

    const channelBadges = [
        { flag: template.isEmail,    label: "Email",    bg: colors.primary100,   fg: colors.primary700,   Icon: FiMail },
        { flag: template.isSms,      label: "SMS",      bg: colors.success100,   fg: colors.success700,   Icon: FiMessageSquare },
        { flag: template.isWhatsapp, label: "WhatsApp", bg: colors.secondary100, fg: colors.secondary700, Icon: FiMessageCircle },
    ].filter((c) => c.flag === 1);

    const activeChannels = TABS.filter((t) => template[t.flag] === 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid gap-y-6 max-w-4xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={goBack}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: colors.neutral500, background: isDark ? colors.neutral800 : colors.neutral100 }}
                    >
                        <FiArrowLeft size={16} />
                    </button>
                    <div>
                        <h1
                            className="text-xl font-bold tracking-tight"
                            style={{ color: colors.neutral900 }}
                        >
                            {template.template}
                        </h1>
                        <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                            {channelBadges.map(({ label, bg, fg, Icon }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                    style={{ background: bg, color: fg }}
                                >
                                    <Icon size={10} /> {label}
                                </span>
                            ))}
                            {channelBadges.length === 0 && (
                                <span className="text-xs italic" style={{ color: colors.neutral400 }}>No channels enabled</span>
                            )}
                        </div>
                    </div>
                </div>
                <Button variant="primaryContained" label="Edit Template" onClick={goEdit} startIcon={<FiEdit2 size={14} />} />
            </div>

            {/* Meta row */}
            <div
                className="flex flex-wrap gap-x-6 gap-y-2 text-sm px-1"
                style={{ color: colors.neutral500 }}
            >
                <span className="flex items-center gap-1.5">
                    <FiCalendar size={12} />
                    Created: <strong style={{ color: colors.neutral700 }}>{DateUtils.dateTimeSecondToDate(template.createdAt ?? "")}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                    <FiCalendar size={12} />
                    Updated: <strong style={{ color: colors.neutral700 }}>{DateUtils.dateTimeSecondToDate(template.updatedAt ?? "")}</strong>
                </span>
                {template.additionalData && (
                    <span>Additional: <strong style={{ color: colors.neutral700 }}>{template.additionalData}</strong></span>
                )}
            </div>

            {/* Channel content */}
            {activeChannels.length > 0 ? (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1.5px solid ${isDark ? colors.neutral700 : colors.neutral200}` }}
                >
                    {/* Tab bar */}
                    <div
                        className="flex border-b"
                        style={{
                            borderColor: isDark ? colors.neutral700 : colors.neutral200,
                            background: isDark ? colors.neutral800 : colors.neutral50,
                        }}
                    >
                        {activeChannels.map(({ key, label, Icon }) => {
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setActiveTab(key)}
                                    className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
                                    style={{
                                        borderColor: isActive ? colors.primary500 : "transparent",
                                        color: isActive ? colors.primary700 : colors.neutral500,
                                        background: isActive ? (isDark ? colors.neutral900 : colors.neutral0) : "transparent",
                                    }}
                                >
                                    <Icon size={13} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-5 grid gap-y-5">
                        {/* Subject (email) */}
                        {activeTab === "email" && template.subject && (
                            <FieldRow
                                label="Subject" value={previewSubject || template.subject}
                                icon={<FiMail size={11} />} copyable mono
                                colors={colors} isDark={isDark}
                            />
                        )}

                        {/* WhatsApp template name */}
                        {activeTab === "whatsapp" && template.whatsappTemplateName && (
                            <FieldRow
                                label="Template Name (Meta)" value={template.whatsappTemplateName}
                                copyable mono colors={colors} isDark={isDark}
                            />
                        )}

                        {/* SMS / WhatsApp recipient */}
                        {(activeTab === "sms" || activeTab === "whatsapp") && template.messageTo && (
                            <FieldRow
                                label="Recipient" value={template.messageTo}
                                icon={<FiMessageSquare size={11} />} copyable mono
                                colors={colors} isDark={isDark}
                            />
                        )}

                        {/* Body + view toggle */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: colors.neutral400 }}>
                                    Body
                                </div>
                                <div className="flex items-center gap-2">
                                    <CopyButton
                                        text={stripHtml(currentBody)}
                                        label="Copy plain text"
                                        colors={colors} isDark={isDark}
                                    />
                                    <div
                                        className="flex rounded-lg overflow-hidden"
                                        style={{ border: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}` }}
                                    >
                                        {([["preview", FiEye], ["source", FiCode]] as const).map(([mode, Icon]) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setBodyView(mode)}
                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors"
                                                style={{
                                                    background: bodyView === mode
                                                        ? isDark ? colors.neutral700 : colors.neutral200
                                                        : "transparent",
                                                    color: bodyView === mode ? colors.neutral800 : colors.neutral400,
                                                }}
                                            >
                                                <Icon size={11} />
                                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={bodyView}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {bodyView === "preview" ? (
                                        <HighlightedBody
                                            html={currentBody} varValues={varValues}
                                            colors={colors} isDark={isDark}
                                        />
                                    ) : (
                                        <pre
                                            className="text-xs overflow-auto rounded-xl p-4"
                                            style={{
                                                background: isDark ? colors.neutral800 : colors.neutral900,
                                                color: isDark ? colors.neutral200 : colors.neutral100,
                                                border: `1px solid ${isDark ? colors.neutral700 : colors.neutral800}`,
                                                maxHeight: 420,
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            }}
                                        >
                                            {currentBody || "(empty)"}
                                        </pre>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Email extra fields */}
                        {activeTab === "email" && (template.emailTo || template.emailCc || template.emailBcc || template.emailReplyTo) && (
                            <div
                                className="grid grid-cols-2 gap-3 pt-4 border-t"
                                style={{ borderColor: isDark ? colors.neutral700 : colors.neutral100 }}
                            >
                                {[
                                    { label: "To",       value: template.emailTo },
                                    { label: "CC",       value: template.emailCc },
                                    { label: "BCC",      value: template.emailBcc },
                                    { label: "Reply-To", value: template.emailReplyTo },
                                ].filter((f) => f.value).map((f) => (
                                    <div key={f.label}>
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: colors.neutral400 }}>{f.label}</p>
                                        <p className="text-sm font-mono" style={{ color: colors.neutral700 }}>{f.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-xl p-8 text-center text-sm"
                    style={{
                        border: `1.5px dashed ${isDark ? colors.neutral700 : colors.neutral300}`,
                        color: colors.neutral400,
                    }}
                >
                    No channels are enabled for this template.
                </div>
            )}

            {/* Variable Playground */}
            {detectedVars.length > 0 && (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1.5px solid ${isDark ? colors.neutral700 : colors.neutral200}` }}
                >
                    <div
                        className="flex items-center gap-2 px-5 py-3 border-b"
                        style={{
                            borderColor: isDark ? colors.neutral700 : colors.neutral200,
                            background: isDark ? colors.neutral800 : colors.neutral50,
                        }}
                    >
                        <FiZap size={14} style={{ color: colors.primary500 }} />
                        <span className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                            Variable Playground
                        </span>
                        <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{
                                background: isDark ? colors.neutral700 : colors.neutral200,
                                color: colors.neutral500,
                            }}
                        >
                            {detectedVars.length}
                        </span>
                        <span className="ml-auto text-xs" style={{ color: colors.neutral400 }}>
                            Fill in sample values to preview substitution above
                        </span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {detectedVars.map((v) => (
                            <div key={v}>
                                <label
                                    className="block text-xs font-mono font-semibold mb-1.5"
                                    style={{ color: colors.primary600 }}
                                >
                                    {`{{${v}}}`}
                                </label>
                                <input
                                    type="text"
                                    value={varValues[v] ?? ""}
                                    onChange={(e) => setVarValues((prev) => ({ ...prev, [v]: e.target.value }))}
                                    placeholder={`Sample value for ${v}`}
                                    className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
                                    style={{
                                        background: isDark ? colors.neutral900 : colors.neutral0,
                                        border: `1.5px solid ${isDark ? colors.neutral600 : colors.neutral300}`,
                                        color: colors.neutral900,
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = colors.primary400; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? colors.neutral600 : colors.neutral300; }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TemplateViewPage;
