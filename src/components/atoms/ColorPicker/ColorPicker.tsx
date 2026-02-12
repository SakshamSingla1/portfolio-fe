import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import TextField from "../../atoms/TextField/TextField";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "../../atoms/Button/Button";
import { HexColorPicker } from "react-colorful";
import { ExpandMore } from "@mui/icons-material";
import { useColors } from "../../../utils/types";

interface ColorPickerFieldProps
  extends Omit<
    React.ComponentProps<typeof TextField>,
    "onChange" | "value"
  > {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  showPresets?: boolean;
}

const PRESET_COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#0EA5E9",
  "#8B5CF6",
  "#111827",
];

const isValidHex = (hex: string) =>
  /^#([0-9A-F]{3}){1,2}$/i.test(hex);

const isColorLight = (color: string): boolean => {
  const hex = color.replace("#", "");
  const [r, g, b] =
    hex.match(/.{2}/g)?.map((x) => parseInt(x, 16)) || [0, 0, 0];
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  value = "#6366F1",
  onChange,
  disabled = false,
  showPresets = true,
  ...textFieldProps
}) => {
  const colors = useColors();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) setTempColor(value);
  }, [open, value]);

  const handleApply = () => {
    if (isValidHex(tempColor)) {
      onChange?.(tempColor);
      setRecentColors((prev) =>
        [tempColor, ...prev.filter((c) => c !== tempColor)].slice(0, 6)
      );
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTempColor(value);
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value.startsWith("#")
      ? e.target.value
      : `#${e.target.value}`;
    setTempColor(val);
  };

  const previewTextColor = useMemo(
    () =>
      isColorLight(tempColor)
        ? colors.neutral900
        : colors.neutral50,
    [tempColor, colors]
  );

  const swatchStyle = (size: number, color: string) => ({
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: 6,
    border: `1px solid ${colors.neutral200}`,
    cursor: "pointer",
  });

  return (
    <>
      {/* Trigger */}
      <div
        ref={anchorRef}
        onClick={() => !disabled && setOpen(true)}
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
                <div style={swatchStyle(18, value)} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ExpandMore
                  style={{
                    transform: open
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                    color: colors.neutral600,
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            width: 280,
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Live Preview */}
          <div
            style={{
              background: tempColor,
              padding: 16,
              borderRadius: 10,
              textAlign: "center",
              color: previewTextColor,
              fontWeight: 500,
            }}
          >
            Preview
          </div>

          {/* Picker */}
          <HexColorPicker
            color={tempColor}
            onChange={setTempColor}
          />

          {/* HEX Input */}
          <TextField
            value={tempColor}
            onChange={handleInputChange}
            error={!isValidHex(tempColor)}
            helperText={
              !isValidHex(tempColor)
                ? "Invalid HEX"
                : ""
            }
            inputProps={{
              style: { fontFamily: "monospace" },
            }}
          />

          {/* Presets */}
          {showPresets && (
            <>
              <div style={{ fontSize: 13 }}>
                Presets
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {PRESET_COLORS.map((color) => (
                  <div
                    key={color}
                    style={swatchStyle(24, color)}
                    onClick={() => setTempColor(color)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Recent */}
          {recentColors.length > 0 && (
            <>
              <div style={{ fontSize: 13 }}>
                Recent
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                {recentColors.map((color) => (
                  <div
                    key={color}
                    style={swatchStyle(24, color)}
                    onClick={() => setTempColor(color)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Footer Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Button
              size="small"
              variant="secondaryContained"
              label="Cancel"
              onClick={handleCancel}
            />
            <Button
              size="small"
              variant="primaryContained"
              label="Apply"
              onClick={handleApply}
            />
          </div>
        </div>
      </Popover>
    </>
  );
};

export default React.memo(ColorPickerField);
