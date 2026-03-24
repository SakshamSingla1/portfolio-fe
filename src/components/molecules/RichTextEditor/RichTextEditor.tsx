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
    borderRadius: 6,
    border: `1px solid ${colors.neutral200}`,
    background: colors.neutral50,
    color: colors.neutral900,
    lineHeight: 1.6,

    "& p": {
      marginBottom: 12,
    },

    "& strong": {
      fontWeight: 600,
    },
  }),

  toggle: (colors: any) => ({
    fontSize: 13,
    cursor: "pointer",
    color: colors.primary600,
    marginTop: 6,
    width: "fit-content",

    "&:hover": {
      textDecoration: "underline",
    },
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