import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import type { IJodit } from "jodit/esm/types";
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
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  extraButtons?: string[];
}

const useStyles = createUseStyles({
  wrapper: (colors: any) => ({
    backgroundColor: colors.neutral50,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
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
    marginTop: "6px",
    fontSize: "12px",
    lineHeight: "16px",
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
      colors: {
        greyscale: ["#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#D7D7D7", "#F4F5F7", "#FFFFFF"],
        palette: ["#3AA8F5", "#6C757D", "#6F42C1", "#E83E8C", "#FD7E14", "#20C997", "#28A745", "#FFC107", "#DC3545"],
      },

      style: {
        font: "14px Inter, sans-serif",
      },

      buttons:
        buttons ||
        [ "bold", "italic", "underline", "strikethrough", 
          "|", "ul", "ol",
          "|", "outdent", "indent",
          "|", "font", "fontsize", "paragraph",
          "|", "image", "link", "align",
          "|", "undo", "redo",
          "|", "source",
        ].concat(extraButtons),
    };
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
        <label style={{
          color: colors.neutral700,
          fontSize: 14,
          fontWeight: 500,
          marginLeft: 8,
        }}>
          {label}
        </label>
      )}
      <div className={`${classes.wrapper} ${error ? classes.error : ""}`}>
        <JoditEditor
          ref={editorRef}
          value={value}
          config={config}
          onBlur={(content) => onChange(content)}
        />
      </div>

      {error && helperText && (
        <div className={classes.helperText}>{helperText}</div>
      )}
    </div>
  );
};

export default RichTextEditor;
