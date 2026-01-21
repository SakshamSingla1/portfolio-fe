import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/system";
import { useColors } from "../../../utils/types";

/* ---------- Styled TextField ---------- */

const StyledTextField = styled(MuiTextField)<{ colors: any }>(
  ({ colors }) => ({
    width: "100%",

    "& .MuiInputBase-root": {
      backgroundColor: colors.neutral50,
      border: `1px solid ${colors.neutral200}`,
      borderRadius: 4,
      fontSize: 16,
      transition: "all 0.2s ease-in-out",

      "&:hover": {
        borderColor: colors.primary300,
      },

      "&.Mui-focused": {
        borderColor: colors.primary500,
        boxShadow: `0 0 0 3px ${colors.primary100}`,
      },

      "&.Mui-disabled": {
        backgroundColor: colors.neutral100,
        borderColor: colors.neutral200,
        color: colors.neutral500,
        cursor: "not-allowed",
      },

      "& input": {
        padding: "13px 12px",
        color: colors.neutral900,

        "&::placeholder": {
          color: colors.neutral400,
        },

        "&:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px ${colors.neutral50} inset`,
          WebkitTextFillColor: colors.neutral900,
        },
      },
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    /* Error */
    "& .Mui-error .MuiInputBase-root": {
      backgroundColor: colors.error50,
      borderColor: colors.error500,
    },
  })
);

/* ---------- Wrapper ---------- */

interface Props extends Omit<TextFieldProps, "label" | "helperText" | "error"> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

const TextField: React.FC<Props> = ({
  label,
  helperText,
  error,
  InputProps,
  ...props
}) => {
  const colors = useColors();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
      }}
    >
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

      <StyledTextField
        {...props}
        colors={colors}
        label=""
        error={error}
        helperText={null}
        InputProps={{
          ...InputProps,
          readOnly: InputProps?.readOnly,
        }}
      />

      {error && helperText && (
        <span
          style={{
            fontSize: 12,
            marginLeft: 8,
            color: colors.error600,
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;
