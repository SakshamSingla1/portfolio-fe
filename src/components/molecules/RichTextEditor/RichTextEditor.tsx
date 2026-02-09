import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
import type { Config } from "jodit/esm/config";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (content: string) => void;
  readonly?: boolean;
  placeholder?: string;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  buttons?: string[];
  error?: boolean;
  helperText?: string;
  extraButtons?: string[];
}

const useStyles = createUseStyles({
  wrapper: (colors: any) => ({
    backgroundColor: colors.neutral50,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: 4,
    transition: "all 0.2s ease",
    overflow: "hidden",

    "&:hover": {
      borderColor: colors.primary300,
    },

    "&:focus-within": {
      borderColor: colors.primary500,
      boxShadow: `0 0 0 3px ${colors.primary100}`,
    },
  }),

  error: (colors: any) => ({
    borderColor: colors.error500,
    backgroundColor: colors.error50,
  }),

  helperText: (colors: any) => ({
    marginTop: 6,
    fontSize: 12,
    color: colors.error600,
  }),
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  readonly = false,
  placeholder = "Start typing...",
  height = 300,
  minHeight = 200,
  maxHeight = 600,
  buttons,
  error,
  helperText,
  extraButtons = [],
}) => {
  const editorRef = useRef<IJodit | null>(null);
  const colors = useColors();
  const classes = useStyles(colors);

  // 🚨 DO NOT generic-type useMemo with Config
  const config = useMemo(() => {
    const cfg: Partial<Config> = {
      readonly,
      placeholder,
      height,
      minHeight,
      maxHeight,

      toolbarAdaptive: false,
      toolbarSticky: false,
      toolbarButtonSize: "middle",

      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,

      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      processPasteHTML: true,
      defaultActionOnPaste: "insert_as_html",

      style: {
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        lineHeight: "1.6",
      },

      buttons:
        buttons ??
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "ul",
          "ol",
          "|",
          "outdent",
          "indent",
          "|",
          "font",
          "fontsize",
          "paragraph",
          "|",
          "align",
          "|",
          "image",
          "link",
          "|",
          "paste",
          "pasteText",
          "pasteWord",
          "|",
          "undo",
          "redo",
          "|",
          "source",
        ].concat(extraButtons),
    };

    return cfg;
  }, [
    readonly,
    placeholder,
    height,
    minHeight,
    maxHeight,
    buttons,
    extraButtons,
  ]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          style={{
            color: colors.neutral700,
            fontSize: 14,
            fontWeight: 500,
            marginLeft: 8,
          }}
        >
          {label}
        </label>
      )}

      <div className={`${classes.wrapper} ${error ? classes.error : ""}`}>
        <JoditEditor
          ref={editorRef}
          value={value || ""}
          config={config as any}
          onChange={onChange}
        />
      </div>

      {error && helperText && (
        <div className={classes.helperText}>{helperText}</div>
      )}
    </div>
  );
};

export default RichTextEditor;
