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
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-gray-700 text-sm font-semibold ml-2 select-none tracking-tight">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <MuiTextField
        {...props}
        label=""
        error={error}
        helperText={null}
        variant="outlined"
        InputProps={{
          ...InputProps,
          readOnly: InputProps?.readOnly,
          className: twMerge(
            "w-full text-base border border-gray-300 hover:border-blue-400 hover:shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 focus-within:shadow-[0_4px_16px_rgba(59,130,246,0.08)] !rounded-2xl transition-all duration-300 ease-in-out bg-white text-gray-900",
            error && "border-red-400 bg-red-50/30 focus-within:border-red-500 focus-within:ring-red-100/60 focus-within:shadow-[0_4px_16px_rgba(239,68,68,0.08)]",
            props.disabled && "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60 hover:shadow-none hover:border-gray-200",
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
        <span className="text-xs ml-2 text-red-500 font-semibold select-none tracking-tight animate-fade-in">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default React.memo(TextField);
