import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    readonly?: boolean;
    placeholder?: string;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    buttons?: string[];
    onFocus?: () => void;
    onBlur?: () => void;
    customColors?: {
        text?: string;
        background?: string;
        border?: string;
        toolbar?: string;
    };
    error?: boolean;
    helperText?: string;
    extraButtons?: string[];
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    readonly = false,
    placeholder = "Start typing...",
    height = 300,
    minHeight = 200,
    maxHeight = 600,
    buttons,
    onBlur,
    customColors,
    error,
    helperText,
    extraButtons = [],
}) => {
    const editorRef = useRef<IJodit | null>(null);
    const config = useMemo(() => {
        return {
            readonly,
            placeholder,
            height,
            minHeight,
            maxHeight,
            toolbarAdaptive: true,
            toolbarButtonSize: "middle" as const,
            showCharsCounter: false,
            showWordsCounter: false,
            showXPathInStatusbar: false,
            theme: "default",
            style: {
                font: "14px Inter, sans-serif",
                color: customColors?.text || "#1F2937",
                background: customColors?.background || "#FFFFFF",
            },
            buttons: buttons || [
                "bold", "italic", "underline", "strikethrough",
                "|", "ul", "ol",
                "|", "outdent", "indent",
                "|", "font", "fontsize", "paragraph",
                "|", "image", "link", "align",
                "|", "undo", "redo",
                "|", "source",
            ].concat(extraButtons),
            spellcheck: true,
            textIcons: false,
            showPlaceholder: true,
            controls: {
                font: {
                    list: {
                        "Inter, sans-serif": "Inter",
                        "Arial, sans-serif": "Arial",
                        "Georgia, serif": "Georgia",
                        "Impact, Charcoal, sans-serif": "Impact",
                        "Tahoma, Geneva, sans-serif": "Tahoma",
                        "Times New Roman, serif": "Times New Roman",
                        "Verdana, Geneva, sans-serif": "Verdana",
                    },
                },
                fontSize: {
                    list: ["8", "10", "12", "14", "16", "18", "24", "30", "36", "48"],
                },
            },
            colors: {
                greyscale: [
                    "#000000",
                    "#434343",
                    "#666666",
                    "#999999",
                    "#B7B7B7",
                    "#D7D7D7",
                    "#F4F5F7",
                    "#FFFFFF",
                ],
                palette: [
                    "#3AA8F5",
                    "#6C757D",
                    "#6F42C1",
                    "#E83E8C",
                    "#FD7E14",
                    "#20C997",
                    "#28A745",
                    "#FFC107",
                    "#DC3545",
                ],
            },
        };
    }, [readonly, placeholder, height, minHeight, maxHeight, buttons, extraButtons, customColors]);

    return (
        <>
            <div className="relative">
                <JoditEditor
                    ref={editorRef}
                    value={value}
                    onChange={onChange}
                    config={config}
                    onBlur={onBlur}
                />
            </div>
            {error && helperText && <p className="text-red-500">{helperText}</p>}
        </>
    );
};

export default RichTextEditor;
