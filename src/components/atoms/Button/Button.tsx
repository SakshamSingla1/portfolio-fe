import React, { useMemo } from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import { useColors } from "../../../utils/types";

type CustomVariant =
  | "primaryContained"
  | "secondaryContained"
  | "tertiaryContained"
  | "primaryText"
  | "secondaryText"
  | "underlined"
  | "tertiaryText";

type CustomSize = "extraSmall" | "small" | "medium" | "large";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: CustomVariant;
  label?: React.ReactNode;
  isLoading?: boolean;
  iconButton?: React.ReactNode;
  size?: CustomSize;
  buttonWithImg?: boolean;
}

const StyledButton = styled(MuiButton)<{
  $variant: CustomVariant;
  $size: CustomSize;
  colors: any;
}>(({ colors, $variant, $size }) => ({
  textTransform: "capitalize",
  fontWeight: 500,
  lineHeight: 1,
  minWidth: "auto",

  ...( {
    extraSmall: { minHeight: 32, padding: "4px 12px", fontSize: 14, borderRadius: 4 },
    small: { minHeight: 36, padding: "6px 16px", fontSize: 14, borderRadius: 4 },
    medium: { minHeight: 40, padding: "8px 20px", fontSize: 16, borderRadius: 6 },
    large: { minHeight: 48, padding: "12px 24px", fontSize: 16, borderRadius: 8 },
  }[$size]),

  ...( {
    primaryContained: {
      backgroundColor: colors.primary300,
      color: colors.neutral50,
      "&:hover": { backgroundColor: colors.primary300 },
    },

    secondaryContained: {
      backgroundColor: colors.neutral50,
      color: colors.primary300,
      border: `1px solid ${colors.primary300}`,
    },

    tertiaryContained: {
      backgroundColor: colors.neutral50,
      color: colors.primary300,
      border: `1px solid ${colors.neutral200}`,
    },

    primaryText: {
      color: colors.primary300,
      "&:hover": { textDecoration: "underline" },
    },

    secondaryText: {
      color: colors.neutral700,
      "&:hover": { color: colors.primary300 },
    },

    tertiaryText: {
      color: colors.neutral700,
      "&:hover": { backgroundColor: colors.neutral50 },
    },

    underlined: {
      color: colors.neutral700,
      textDecoration: "underline",
    },
  }[$variant]),

  "&.Mui-disabled": {
    opacity: 0.6,
  },
}));

const Button: React.FC<ButtonProps> = ({
  variant = "primaryContained",
  size = "medium",
  label,
  iconButton,
  isLoading,
  buttonWithImg,
  disabled,
  ...props
}) => {
  const colors = useColors();

  const content = useMemo(() => {
    if (isLoading) return <CircularProgress size={18} color="inherit" />;
    if (buttonWithImg)
      return (
        <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          {iconButton}
          {label}
        </span>
      );
    return iconButton || label;
  }, [isLoading, buttonWithImg, iconButton, label]);

  return (
    <StyledButton
      colors={colors}
      $variant={variant}
      $size={size}
      variant="text"
      disableRipple
      disableElevation
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </StyledButton>
  );
};

export default Button;
