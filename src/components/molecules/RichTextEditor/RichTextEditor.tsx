import React, { useMemo, useRef, lazy, Suspense } from "react";
import DOMPurify from 'dompurify';
import type { IJodit } from "jodit/esm/types/jodit";

// jodit-react is a ~1.1MB chunk — load it only when a form page actually
// renders an editable RichTextEditor, instead of blocking first paint of
// every page that imports this component (including read-only views).
const JoditEditor = lazy(() => import("jodit-react"));
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";

interface RichTextEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    isEditMode?: boolean;
}

const TOOLBAR_BUTTONS = [
    "bold", "italic", "underline", "strikethrough", "|",
    "eraser", "|",
    "ul", "ol", "|",
    "paragraph", "fontsize", "|",
    "indent", "outdent", "|",
    "align", "lineHeight", "|",
    "link", "hr", "|",
    "undo", "redo", "|",
    "fullsize",
].join(",");

const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(({
    label,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required,
    isEditMode = true,
}) => {
    const colors = useColors();
    const { isDark } = useTheme();
    const editorRef = useRef<IJodit | null>(null);

    const config = useMemo(() => ({
        readonly: false,
        theme: isDark ? "dark" : "default",
        height: 320,
        minHeight: 180,
        placeholder: placeholder || "Write content here…",
        toolbar: true,
        statusbar: false,
        allowResizeX: false,
        allowResizeY: true,
        language: "en",
        buttons: TOOLBAR_BUTTONS,
        removeButtons: [
            "video", "table", "source", "symbol", "print", "about",
            "image", "file", "speechRecognize", "classSpan", "draw.io",
            "dots", "cut", "copy", "paste", "copyformat", "selectall",
        ],
        style: {
            fontFamily: "inherit",
            fontSize: "14px",
            lineHeight: "1.7",
            color: isDark ? "#e5e7eb" : "#1f2937",
            background: isDark ? "#1f2937" : "#ffffff",
        },
        toolbarAdaptive: false,
        toolbarSticky: false,
        showXPathInStatusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        spellcheck: true,
    }), [isDark, placeholder]);

    const labelEl = label && (
        <label
            style={{
                display: "block",
                marginBottom: 6,
                fontSize: 12,
                fontWeight: 600,
                color: colors.neutral600,
                letterSpacing: "0.02em",
            }}
        >
            {label}
            {required && <span style={{ color: colors.error500, marginLeft: 2 }}>*</span>}
        </label>
    );

    if (!isEditMode) {
        return (
            <div style={{ width: "100%" }}>
                {labelEl}
                <div
                    style={{
                        padding: "10px 14px",
                        borderRadius: 16,
                        border: `1.5px solid ${colors.neutral200}`,
                        background: colors.neutral50,
                        color: colors.neutral800,
                        lineHeight: 1.7,
                        minHeight: 60,
                        fontSize: 14,
                    }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value ?? '') || `<span style="color:${colors.neutral400}">—</span>` }}
                />
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            {labelEl}
            <div
                style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: `1.5px solid ${error ? colors.error500 : colors.neutral300}`,
                    transition: "border-color 0.15s",
                    boxShadow: error ? `0 0 0 3px ${colors.error500}18` : undefined,
                }}
            >
                <Suspense fallback={<div style={{ minHeight: config.height, background: config.style.background }} />}>
                    <JoditEditor
                        ref={editorRef}
                        value={value}
                        config={config}
                        onChange={onChange}
                    />
                </Suspense>
            </div>
            {helperText && (
                <p
                    style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: error ? colors.error500 : colors.neutral400,
                    }}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
});

export default RichTextEditor;
