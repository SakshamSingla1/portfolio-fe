import React, { useState, useRef, useMemo } from "react";
import TextField from "../../atoms/TextField/TextField";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import { HexColorPicker } from "react-colorful";
import { Check, ExpandMore } from "@mui/icons-material";
import { useColors } from "../../../utils/types";

interface ColorPickerFieldProps
  extends Omit<
    React.ComponentProps<typeof TextField>,
    "onChange" | "value"
  > {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
}

const isColorLight = (color: string): boolean => {
  const hex = color.replace("#", "");
  const [r, g, b] =
    hex.match(/.{2}/g)?.map((x) => parseInt(x, 16)) || [0, 0, 0];
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  value = "#ffffff",
  onChange,
  disabled = false,
  ...textFieldProps
}) => {
  const colors = useColors();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const checkIconStyle = useMemo(
    () => ({
      color: isColorLight(value) ? colors.neutral900 : colors.neutral50,
      fontSize: 16,
    }),
    [value, colors]
  );

  const swatchStyle = (size: number): React.CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: value,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: 4,
  });

  const handleOpen = () => {
    if (!disabled) setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* CLICK TARGET */}
      <div
        ref={anchorRef}
        onClick={handleOpen}
        style={{
          display: "inline-block",
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <TextField
          {...textFieldProps}
          value={value}
          disabled={disabled}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <div style={swatchStyle(18)} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ExpandMore
                  style={{
                    color: colors.neutral600,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </InputAdornment>
            ),
          }}
          inputProps={{
            "aria-readonly": true,
          }}
        />
      </div>

      {/* POPOVER */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          },
        }}
      >
        <div
          style={{
            padding: 16,
            backgroundColor: colors.neutral50,
            borderRadius: 12,
            border: `1px solid ${colors.neutral200}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <HexColorPicker
            color={value}
            onChange={(c) => onChange?.(c)}
            style={{ width: 250, height: 200 }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: 12,
              borderTop: `1px solid ${colors.neutral200}`,
            }}
          >
            <div
              style={{
                ...swatchStyle(24),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check style={checkIconStyle} />
            </div>

            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange?.(e.target.value)
              }
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
          </div>
        </div>
      </Popover>
    </>
  );
};

export default React.memo(ColorPickerField);
