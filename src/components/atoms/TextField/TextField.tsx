import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends Omit<TextFieldProps, "label" | "helperText" | "error"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
}

const TextField: React.FC<Props> = ({
  label,
  helperText,
  error,
  required,
  InputProps,
  className,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[var(--color-neutral-700)] text-sm font-semibold ml-2 select-none tracking-tight">
          {label} {required && <span className="text-[var(--color-error-500)] font-bold">*</span>}
        </label>
      )}

      <MuiTextField
        {...props}
        id={inputId}
        label=""
        error={error}
        helperText={null}
        variant="outlined"
        InputProps={{
          ...InputProps,
          readOnly: InputProps?.readOnly,
          className: twMerge(
            "w-full text-base border border-[var(--color-neutral-300)] bg-[var(--color-neutral-0)] text-[var(--color-neutral-900)] hover:border-[var(--color-primary-400)] hover:shadow-sm focus-within:border-[var(--color-primary-500)] focus-within:ring-4 focus-within:ring-[var(--color-primary-100)]/60 focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)] !rounded-2xl transition-all duration-300 ease-in-out",
            error && "border-[var(--color-error-400)] bg-[var(--color-error-50)]/30 focus-within:border-[var(--color-error-500)] focus-within:ring-[var(--color-error-100)]/60",
            props.disabled && "bg-[var(--color-neutral-50)] border-[var(--color-neutral-200)] cursor-not-allowed opacity-60 hover:shadow-none hover:border-[var(--color-neutral-200)]",
            className
          ),
        }}
        sx={{
          "& .MuiInputBase-root": {
            color: "var(--color-neutral-900)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& input, & textarea": {
            padding: "16px 16px",
            color: "inherit",
            fontFamily: "inherit",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "var(--color-neutral-400)",
          },
          "& svg": {
            color: "var(--color-neutral-400)",
            transition: "color 0.25s ease",
            "&:hover": {
              color: "var(--color-neutral-600)",
            }
          },
        }}
      />

      {error && helperText && (
        <span className="text-xs ml-2 text-[var(--color-error-500)] font-semibold select-none tracking-tight animate-fade-in">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default React.memo(TextField);
