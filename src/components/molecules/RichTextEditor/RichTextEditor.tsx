import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";
import type { IJodit } from "jodit/esm/types";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  isEditMode?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
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
  placeholder,
  onChange,
  isEditMode = true,
  error,
  helperText,
  required = false,
}) => {
  const editorRef = useRef<IJodit | null>(null);
  const colors = useColors();
  const classes = useStyles(colors);

  const setEditorRef = (editor: IJodit | null) => {
    if (editor) {
      editorRef.current = editor;
    }
  };

  const joditConfig = useMemo(() => ({ readonly: !isEditMode, placeholder: placeholder || 'Start typing...', }), [isEditMode]);

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
          {required && <span style={{ color: colors.error600 }}>*</span>}
        </label>
      )}

      <div className={`${classes.wrapper} ${error ? classes.error : ""}`}>
        <JoditEditor
          ref={setEditorRef}
          value={value || ""}
          config={joditConfig as any}
          onBlur={(newContent) => onChange(newContent)}
        />
      </div>
      {error && helperText && (
        <div className={classes.helperText}>{helperText}</div>
      )}
    </div>
  );
};

export default RichTextEditor;
