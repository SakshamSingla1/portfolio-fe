import React, { useEffect, useRef, useState, useMemo } from "react";
import type { FormikProps } from "formik";
import type { Jodit } from "jodit-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch, FiEye, FiX, FiMail, FiMessageSquare, FiMessageCircle,
    FiCopy, FiCheck, FiZap,
} from "react-icons/fi";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS, SORT_ENUM, useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplateFormPayload, ITemplateVariable } from "../../../services/useTemplateService";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import Tabs from "../../atoms/Tabs/Tabs";
import type { ITabsSchema } from "../../atoms/Tabs/Tabs";
import EmailNotificationForm from "./EmailNotificationForm.template";
import SmsNotificationForm from "./SmsNotificationForm.template";
import WhatsappNotificationForm from "./WhatsappNotificationForm.template";

interface TemplateFormProps {
    formik: FormikProps<INotificationTemplateFormPayload>;
    mode: string;
}

const VAR_REGEX = /\{\{(\w+)\}\}/g;

const extractVars = (text: string): string[] => {
    const found = new Set<string>();
    let match: RegExpExecArray | null;
    VAR_REGEX.lastIndex = 0;
    while ((match = VAR_REGEX.exec(text)) !== null) found.add(match[1]);
    return Array.from(found);
};

const substituteVars = (text: string, values: Record<string, string>): string =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`);

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// ── Preview Modal ──────────────────────────────────────────────────────────────
interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    formik: FormikProps<INotificationTemplateFormPayload>;
    variables: ITemplateVariable[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, activeTab, formik, variables }) => {
    const colors = useColors();
    const { isDark } = useTheme();
    const [varValues, setVarValues] = useState<Record<string, string>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const body = useMemo(() => {
        if (activeTab === "email") return formik.values.messageBody || "";
        if (activeTab === "sms") return formik.values.message || "";
        return formik.values.whatsappTemplateBody || "";
    }, [activeTab, formik.values]);

    const subject = activeTab === "email" ? (formik.values.subject || "") : "";

    const detectedVars = useMemo(() => {
        const fromBody = extractVars(stripHtml(body));
        const fromSubject = extractVars(subject);
        const all = new Set([...fromBody, ...fromSubject]);
        return Array.from(all);
    }, [body, subject]);

    // Seed inputs from known variable list on open
    useEffect(() => {
        if (!isOpen) return;
        const seed: Record<string, string> = {};
        detectedVars.forEach((v) => {
            const known = variables.find((k) => k.variableName === v);
            seed[v] = known ? known.variableName : "";
        });
        setVarValues(seed);
    }, [isOpen, detectedVars]);

    const previewBody = useMemo(() => substituteVars(body, varValues), [body, varValues]);
    const previewSubject = useMemo(() => substituteVars(subject, varValues), [subject, varValues]);

    const copyToClipboard = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text).catch(() => null);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: `${colors.neutral900}99`, backdropFilter: "blur(4px)" }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0, y: 12 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 12 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
                        style={{
                            background: isDark ? colors.neutral900 : colors.neutral0,
                            border: `1.5px solid ${isDark ? colors.neutral700 : colors.neutral200}`,
                            boxShadow: `0 24px 64px -12px ${colors.neutral900}40`,
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
                            style={{ borderColor: isDark ? colors.neutral700 : colors.neutral200 }}
                        >
                            <div className="flex items-center gap-2">
                                <FiEye size={18} style={{ color: colors.primary500 }} />
                                <span className="text-base font-semibold" style={{ color: colors.neutral900 }}>
                                    Template Preview
                                </span>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                                    style={{
                                        background: isDark ? colors.primary900 : colors.primary50,
                                        color: colors.primary600,
                                    }}
                                >
                                    {activeTab}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: colors.neutral400 }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                            {/* Left: Variable inputs */}
                            {detectedVars.length > 0 && (
                                <div
                                    className="lg:w-64 flex-shrink-0 p-4 overflow-y-auto border-b lg:border-b-0 lg:border-r"
                                    style={{ borderColor: isDark ? colors.neutral700 : colors.neutral200 }}
                                >
                                    <p
                                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                                        style={{ color: colors.neutral400 }}
                                    >
                                        Sample Values
                                    </p>
                                    <div className="grid gap-y-3">
                                        {detectedVars.map((v) => (
                                            <div key={v}>
                                                <label
                                                    className="block text-xs font-mono mb-1"
                                                    style={{ color: colors.primary600 }}
                                                >
                                                    {`{{${v}}}`}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={varValues[v] ?? ""}
                                                    onChange={(e) =>
                                                        setVarValues((prev) => ({ ...prev, [v]: e.target.value }))
                                                    }
                                                    placeholder={`Sample ${v}`}
                                                    className="w-full text-sm px-3 py-1.5 rounded-lg outline-none"
                                                    style={{
                                                        background: isDark ? colors.neutral800 : colors.neutral50,
                                                        border: `1px solid ${isDark ? colors.neutral600 : colors.neutral200}`,
                                                        color: colors.neutral900,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Right: Preview */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {activeTab === "email" && previewSubject && (
                                    <div
                                        className="flex items-start justify-between gap-4 px-5 py-3 border-b flex-shrink-0"
                                        style={{ borderColor: isDark ? colors.neutral700 : colors.neutral200 }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium mb-0.5" style={{ color: colors.neutral400 }}>
                                                Subject
                                            </p>
                                            <p className="text-sm font-semibold truncate" style={{ color: colors.neutral900 }}>
                                                {previewSubject || <em style={{ color: colors.neutral400 }}>No subject</em>}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(previewSubject, "subject")}
                                            className="flex-shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                                            style={{
                                                color: copiedField === "subject" ? colors.success600 : colors.neutral400,
                                                background: isDark ? colors.neutral800 : colors.neutral50,
                                            }}
                                        >
                                            {copiedField === "subject" ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                            {copiedField === "subject" ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                )}

                                {/* Body preview */}
                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.neutral400 }}>
                                            Body
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(stripHtml(previewBody), "body")}
                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                                            style={{
                                                color: copiedField === "body" ? colors.success600 : colors.neutral400,
                                                background: isDark ? colors.neutral800 : colors.neutral50,
                                            }}
                                        >
                                            {copiedField === "body" ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                            {copiedField === "body" ? "Copied!" : "Copy plain text"}
                                        </button>
                                    </div>
                                    <div
                                        className="rounded-xl p-4 prose prose-sm max-w-none"
                                        style={{
                                            background: isDark ? colors.neutral800 : colors.neutral50,
                                            border: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}`,
                                            color: colors.neutral900,
                                            minHeight: 120,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: previewBody || "<em style='color: gray'>No body content</em>" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ── Main Form ──────────────────────────────────────────────────────────────────
const TemplateFormTemplate: React.FC<TemplateFormProps> = ({ formik, mode }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showSnackbar } = useSnackbar();
    const templateService = useTemplateService();
    const colors = useColors();
    const { isDark } = useTheme();

    const [variables, setVariables] = useState<ITemplateVariable[]>([]);
    const [loadingVars, setLoadingVars] = useState(false);
    const [varSearch, setVarSearch] = useState("");
    const [activeTab, setActiveTab] = useState("email");
    const [previewOpen, setPreviewOpen] = useState(false);
    const editorRef = useRef<Jodit | null>(null);

    const setEditorRef = (editor: Jodit | null) => {
        if (editor) editorRef.current = editor;
    };

    const insertVariable = (varName: string) => {
        if (!editorRef.current) return;
        try {
            const editor = editorRef.current;
            const selection = editor.selection;
            if (!selection?.range) return;
            const isInside = editor.editor?.contains(selection.range.commonAncestorContainer);
            if (!isInside) return;
            selection.insertHTML(`{{${varName}}}`);
            editor.events.fire("change");
        } catch (err) {
            console.error("Failed to insert variable:", err);
        }
    };

    const loadVariables = async () => {
        setLoadingVars(true);
        try {
            const res = await templateService.getTemplateVariables({ page: 0, size: 200, sort: SORT_ENUM.CREATED_AT_DESC, search: "" });
            if (res?.status === HTTP_STATUS.OK) setVariables(res.data.data.content);
        } catch {
            setVariables([]);
        } finally {
            setLoadingVars(false);
        }
    };

    const onClose = () => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES, {
            query: {
                page: searchParams.get("page") || "",
                size: searchParams.get("size") || "",
                search: searchParams.get("search") || "",
            },
        }));
    };

    useEffect(() => { loadVariables(); }, []);

    const filteredVars = useMemo(() => {
        if (!varSearch.trim()) return variables;
        const q = varSearch.toLowerCase();
        return variables.filter((v) => v.variableName.toLowerCase().includes(q));
    }, [variables, varSearch]);

    // Channel dot icon for tabs
    const ChannelIcon = ({ Icon, isOn, colorOn }: { Icon: React.ElementType; isOn: boolean; colorOn: string }) => (
        <span className="relative flex items-center">
            <Icon size={15} />
            {isOn && (
                <span
                    className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: colors.success500 }}
                />
            )}
        </span>
    );

    const tabs: ITabsSchema[] = [
        {
            label: "Email",
            value: "email",
            icon: <ChannelIcon Icon={FiMail} isOn={formik.values.isEmail === 1} colorOn={colors.success500} />,
            component: <EmailNotificationForm formik={formik} setEditorRef={setEditorRef} insertVariable={insertVariable} />,
        },
        {
            label: "SMS",
            value: "sms",
            icon: <ChannelIcon Icon={FiMessageSquare} isOn={formik.values.isSms === 1} colorOn={colors.success500} />,
            component: <SmsNotificationForm formik={formik} setEditorRef={setEditorRef} insertVariable={insertVariable} />,
        },
        {
            label: "WhatsApp",
            value: "whatsapp",
            icon: <ChannelIcon Icon={FiMessageCircle} isOn={formik.values.isWhatsapp === 1} colorOn={colors.success500} />,
            component: <WhatsappNotificationForm formik={formik} setEditorRef={setEditorRef} insertVariable={insertVariable} />,
        },
    ];

    return (
        <>
            <PreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                activeTab={activeTab}
                formik={formik}
                variables={variables}
            />

            <div className="grid gap-y-6">
                {/* Template name + additional data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        label="Template Name *"
                        placeholder="Enter template name"
                        {...formik.getFieldProps("template")}
                        disabled={mode === MODE.EDIT}
                        error={formik.touched.template && Boolean(formik.errors.template)}
                        helperText={formik.touched.template && formik.errors.template ? String(formik.errors.template) : ""}
                    />
                    <TextField
                        fullWidth
                        label="Additional Data"
                        placeholder="Enter additional data (optional)"
                        {...formik.getFieldProps("additionalData")}
                    />
                </div>

                {/* Channel tabs */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold" style={{ color: colors.neutral600 }}>
                            Notification Channels
                        </p>
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(true)}
                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
                            style={{
                                color: colors.primary600,
                                background: isDark ? colors.primary900 : colors.primary50,
                                border: `1px solid ${isDark ? colors.primary700 : colors.primary200}`,
                            }}
                        >
                            <FiEye size={14} />
                            Preview
                        </button>
                    </div>
                    <Tabs schema={tabs} value={activeTab} setValue={setActiveTab} />
                </div>

                {/* Variable insertion panel */}
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        borderColor: isDark ? colors.neutral700 : colors.neutral200,
                        background: isDark ? colors.neutral800 : colors.neutral50,
                    }}
                >
                    {/* Panel header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 border-b"
                        style={{ borderColor: isDark ? colors.neutral700 : colors.neutral200 }}
                    >
                        <div className="flex items-center gap-2">
                            <FiZap size={14} style={{ color: colors.primary500 }} />
                            <span className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                                Template Variables
                            </span>
                            {variables.length > 0 && (
                                <span
                                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                    style={{
                                        background: isDark ? colors.neutral700 : colors.neutral200,
                                        color: colors.neutral500,
                                    }}
                                >
                                    {variables.length}
                                </span>
                            )}
                        </div>
                        <span className="text-xs hidden sm:block" style={{ color: colors.neutral400 }}>
                            Click chip → inserts into focused body editor
                        </span>
                    </div>

                    {/* Search + chips */}
                    <div className="p-4">
                        {variables.length > 0 && (
                            <div className="relative mb-3">
                                <FiSearch
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: colors.neutral400 }}
                                />
                                <input
                                    type="text"
                                    value={varSearch}
                                    onChange={(e) => setVarSearch(e.target.value)}
                                    placeholder="Filter variables…"
                                    className="w-full text-sm pl-8 pr-3 py-2 rounded-lg outline-none"
                                    style={{
                                        background: isDark ? colors.neutral900 : colors.neutral0,
                                        border: `1px solid ${isDark ? colors.neutral600 : colors.neutral300}`,
                                        color: colors.neutral900,
                                    }}
                                />
                            </div>
                        )}

                        {loadingVars ? (
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-6 rounded-full animate-pulse"
                                        style={{
                                            width: `${60 + (i % 3) * 20}px`,
                                            background: isDark ? colors.neutral700 : colors.neutral200,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : filteredVars.length === 0 ? (
                            <p className="text-sm italic" style={{ color: colors.neutral400 }}>
                                {variables.length === 0
                                    ? "No variables defined yet. Create them in the Variables section."
                                    : "No variables match your search."}
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {filteredVars.map((v) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => insertVariable(v.variableName)}
                                        title={`Insert {{${v.variableName}}} at cursor`}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer select-none active:scale-95"
                                        style={{
                                            background: isDark ? colors.neutral900 : colors.neutral0,
                                            border: `1px solid ${isDark ? colors.neutral600 : colors.neutral300}`,
                                            color: isDark ? colors.primary300 : colors.primary700,
                                            boxShadow: `0 1px 2px ${colors.neutral900}08`,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.primary400;
                                            (e.currentTarget as HTMLButtonElement).style.background = isDark ? colors.primary900 : colors.primary50;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? colors.neutral600 : colors.neutral300;
                                            (e.currentTarget as HTMLButtonElement).style.background = isDark ? colors.neutral900 : colors.neutral0;
                                        }}
                                    >
                                        {`{{${v.variableName}}}`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button variant="tertiaryContained" label="Cancel" onClick={onClose} />
                    <Button
                        variant="primaryContained"
                        label={mode === MODE.EDIT ? "Save Changes" : "Create Template"}
                        disabled={formik.isSubmitting}
                        onClick={() => formik.handleSubmit()}
                    />
                </div>
            </div>
        </>
    );
};

export default TemplateFormTemplate;
