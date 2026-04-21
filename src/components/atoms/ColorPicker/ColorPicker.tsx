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
import { FiCheck } from "react-icons/fi";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  swatchOuter: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  swatchWrapper: (colors: any) => ({
    width: 20,
    height: 20,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: `2px solid transparent`,
    position: "relative",
    
    "&:hover": {
      transform: "scale(1.15)",
      zIndex: 2,
    },
    
    "&.active": {
      transform: "scale(1.1)",
      border: `2px solid ${colors.neutral0}`,
      outline: `2px solid ${colors.primary500}`,
    }
  }),
  previewBlock: {
    padding: "6px 8px",
    borderRadius: 8,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    boxShadow: `inset 0 2px 10px rgba(0,0,0,0.1), 0 8px 16px -4px rgba(0,0,0,0.1)`,
    transition: "background 0.2s ease",
  }
});

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

  const classes = useStyles(colors);

  return (
    <>
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
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: value,
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.15), 0 0 0 2px ${colors.neutral0}, 0 0 0 3px ${colors.neutral200}`
                }} />
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
            backgroundColor: colors.neutral0,
            borderRadius: "16px",
            padding: "12px",
            width: 220,
            boxShadow: `0 32px 64px -12px ${colors.neutral900}35`,
            border: `1px solid ${colors.neutral200}`,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            className={classes.previewBlock}
            style={{
              background: `linear-gradient(135deg, ${tempColor} 0%, ${tempColor}DD 100%)`,
              color: previewTextColor,
              textShadow: isColorLight(tempColor) ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
            }}
          >
            {tempColor.toUpperCase()}
          </div>

          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <HexColorPicker
                color={tempColor}
                onChange={setTempColor}
                style={{ width: "100%", height: 120 }}
              />
          </div>
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

          {showPresets && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.neutral600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Presets
              </div>
              <div className={classes.swatchOuter}>
                {PRESET_COLORS.map((color) => {
                    const isActive = color.toLowerCase() === tempColor.toLowerCase();
                    return (
                        <div
                            key={color}
                            className={`${classes.swatchWrapper} ${isActive ? 'active' : ''}`}
                            onClick={() => setTempColor(color)}
                            style={{ 
                                backgroundColor: color,
                                boxShadow: isActive ? `0 4px 12px ${color}60` : `0 2px 8px ${color}40`
                            }}
                        >
                            {isActive && <FiCheck size={12} color={isColorLight(color) ? colors.neutral900 : colors.neutral0} />}
                        </div>
                    );
                })}
              </div>
            </>
          )}
          {recentColors.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.neutral600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Recent
              </div>
              <div className={classes.swatchOuter}>
                {recentColors.map((color) => {
                    const isActive = color.toLowerCase() === tempColor.toLowerCase();
                    return (
                        <div
                            key={color}
                            className={`${classes.swatchWrapper} ${isActive ? 'active' : ''}`}
                            onClick={() => setTempColor(color)}
                            style={{ 
                                backgroundColor: color,
                                boxShadow: isActive ? `0 4px 12px ${color}60` : `0 2px 8px ${color}40`
                            }}
                        >
                            {isActive && <FiCheck size={12} color={isColorLight(color) ? colors.neutral900 : colors.neutral0} />}
                        </div>
                    );
                })}
              </div>
            </>
          )}
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
