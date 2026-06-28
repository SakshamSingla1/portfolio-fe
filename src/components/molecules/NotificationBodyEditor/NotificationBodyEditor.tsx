import React, { useMemo } from "react";
import JoditEditor from "jodit-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useColors } from "../../../utils/types";

type JoditInstance = React.ElementRef<typeof JoditEditor>;

interface Props {
    value: string;
    onBlur: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    onEditorReady?: (editor: JoditInstance) => void;
    minHeight?: number;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const NotificationBodyEditor: React.FC<Props> = ({
    value,
    onBlur,
    disabled = false,
    placeholder = "Compose your message… use {{variableName}} for dynamic content",
    onEditorReady,
    minHeight = 280,
}) => {
    const { isDark } = useTheme();
    const colors = useColors();

    const plain = stripHtml(value);
    const wordCount = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const charCount = plain.length;

    const config = useMemo(() => ({
        readonly: disabled,
        theme: isDark ? "dark" : "default",
        placeholder,
        minHeight,
        height: "auto",
        toolbar: true,
        toolbarAdaptive: false,
        toolbarSticky: false,
        showXPathInStatusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        disablePlugins: ["add-new-line", "speech-recognize"],
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "ul", "ol", "|",
            "fontsize", "font", "|",
            "paragraph", "align", "|",
            "link", "image", "|",
            "hr", "|",
            "undo", "redo", "|",
            "source",
        ],
        editorCssClass: isDark ? "jodit-content-dark" : "jodit-content-light",
        style: {
            fontSize: "14px",
            lineHeight: "1.7",
            padding: "12px 16px",
        },
    }), [isDark, disabled, colors, placeholder, minHeight]);

    const handleRef = (editor: JoditInstance | null) => {
        if (editor && onEditorReady) onEditorReady(editor);
    };

    return (
        <div className="grid gap-y-1">
            <div
                className={`rounded-xl overflow-hidden transition-shadow${isDark ? " jodit-dark-wrapper" : ""}`}
                style={{
                    "--jodit-editor-bg":     isDark ? colors.neutral900 : colors.neutral0,
                    "--jodit-editor-color":  isDark ? colors.neutral100 : colors.neutral900,
                    "--jodit-editor-border": isDark ? colors.neutral700 : colors.neutral200,
                    border: `1.5px solid ${isDark ? colors.neutral700 : colors.neutral200}`,
                    boxShadow: isDark
                        ? `0 0 0 0 transparent`
                        : `0 1px 3px 0 ${colors.neutral900}08`,
                } as React.CSSProperties}
            >
                <JoditEditor
                    key={isDark ? "dark" : "light"}
                    ref={handleRef}
                    value={value}
                    config={config}
                    onBlur={onBlur}
                />
            </div>
            <div
                className="flex items-center gap-2 px-1 text-xs"
                style={{ color: colors.neutral400 }}
            >
                <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                <span>·</span>
                <span>{charCount} chars</span>
                {charCount > 160 && charCount <= 2000 && (
                    <>
                        <span>·</span>
                        <span>{Math.ceil(charCount / 160)} SMS {Math.ceil(charCount / 160) === 1 ? "segment" : "segments"}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationBodyEditor;
