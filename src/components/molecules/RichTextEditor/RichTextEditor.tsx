import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import TextField from "../../atoms/TextField/TextField";
import { useColors } from "../../../utils/types";

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

const useStyles = createUseStyles({
  textarea: {
    "& textarea": {
      maxHeight: 140,   // ~6 lines
      overflowY: "auto",
      resize: "none",
    },
  },

  preview: (colors: any) => ({
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    border: `1px solid ${colors.neutral200}`,
    background: colors.neutral50,
    color: colors.neutral900,
    lineHeight: 1.6,
    boxShadow: `inset 0 2px 4px 0 ${colors.neutral900}05`,

    "& p": {
      marginBottom: 12,
    },

    "& strong": {
      fontWeight: 600,
    },
  }),

  toggle: (colors: any) => ({
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: colors.primary600,
    marginTop: 10,
    width: "fit-content",
    padding: "6px 14px",
    borderRadius: "20px",
    background: colors.primary50,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

    "&:hover": {
      background: colors.primary100,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px -4px ${colors.primary500}30`
    },
    "&:active": {
      transform: "scale(0.96)"
    }
  }),
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required,
  isEditMode,
}) => {
  const colors = useColors();
  const classes = useStyles(colors);

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.textarea}>
        <TextField
          label={label}
          required={required}
          multiline
          minRows={6}
          placeholder={placeholder || "Write HTML content here..."}
          value={value}
          error={error}
          helperText={helperText}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditMode}
        />
      </div>

      <div
        className={classes.toggle}
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? "Hide Preview" : "Show Preview"}
      </div>

      {showPreview && (
        <div
          className={classes.preview}
          dangerouslySetInnerHTML={{ __html: value || "" }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;