import React, { useState, useRef, useMemo } from "react";
import TextField from "../../atoms/TextField/TextField";
import Popover from "@mui/material/Popover";
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
  showInput?: boolean;
  showPreview?: boolean;
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
  showInput = true,
  disabled = false,
  ...textFieldProps
}) => {
  const colors = useColors();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const checkIconStyle = useMemo(
    () => ({
      color: isColorLight(value) ? colors.neutral900 : colors.neutral50,
      opacity: 0.8,
      fontSize: "16px",
    }),
    [value, colors]
  );

  const getColorSwatchStyle = (size: number): React.CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: value,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  });

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChange = (color: string) => {
    onChange?.(color);
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <div
        ref={inputRef}
        onClick={!disabled ? handleOpen : undefined}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={!disabled ? 0 : -1}
        style={{
          display: "inline-flex",
          alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {showInput && (
          <TextField
            {...textFieldProps}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (!disabled) handleOpen(e as any);
            }}
            InputProps={{
              startAdornment: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      ...getColorSwatchStyle(32),
                      marginRight: "8px",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>
              ),
              endAdornment: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <ExpandMore
                    style={{
                      color: colors.neutral600,
                      transform: anchorEl ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </div>
              ),
              ...textFieldProps.InputProps,
            }}
            inputProps={{
              ...textFieldProps.inputProps,
              readOnly: true,
              "aria-readonly": "true",
            }}
            disabled={disabled}
          />
        )}
      </div>

      <Popover
        open={Boolean(anchorEl) && !disabled}
        anchorEl={anchorEl || undefined}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          },
        }}
      >
        <div
          style={{
            padding: "16px",
            backgroundColor: colors.neutral50,
            borderRadius: "12px",
            border: `1px solid ${colors.neutral200}`,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <HexColorPicker
            color={value}
            onChange={handleChange}
            style={{ width: "250px", height: "200px" }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingTop: "12px",
              borderTop: `1px solid ${colors.neutral200}`,
            }}
          >
            <div style={getColorSwatchStyle(32)}>
              <Check style={checkIconStyle} />
            </div>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value)
              }
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default React.memo(ColorPickerField);
