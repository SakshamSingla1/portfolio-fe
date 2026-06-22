import React, { useState } from "react";
import {
  Select as MuiSelect,
  MenuItem,
  type SelectProps as MuiSelectProps,
} from "@mui/material";
import { twMerge } from "tailwind-merge";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import downArrowIcon from "../../../assets/icons/downArrowFilled.svg";
import { capitalizeFirstLetter } from "../../../utils/helper";

interface Option {
  value: string | number;
  label: string | React.ReactNode;
}

interface SelectProps
  extends Omit<MuiSelectProps, "label" | "onChange"> {
  options: Option[];
  label?: string;
  helperText?: string;
  placeholder?: string;
  disableCapitalization?: boolean;
  disableArrow?: boolean;
  onChange?: (value: string | number) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  placeholder = "Select",
  disableCapitalization = false,
  disableArrow = false,
  value,
  onChange,
  error,
  disabled,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const renderValue = (selected: any) => {
    if (selected === "" || selected === undefined || selected === null) {
      return <span className="text-gray-400 font-normal">{placeholder}</span>;
    }

    if (typeof selected === "string") {
      return disableCapitalization
        ? selected.replace(/_/g, " ")
        : selected
            .split("_")
            .map((el) => capitalizeFirstLetter(el))
            .join(" ");
    }

    return selected;
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-gray-700 text-sm font-semibold ml-2 select-none tracking-tight">
          {label}
        </label>
      )}

      <MuiSelect
        {...props}
        value={value ?? ""}
        error={error}
        disabled={disabled}
        displayEmpty
        renderValue={renderValue}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(e) => onChange?.(e.target.value as string | number)}
        className={twMerge(
          "w-full text-base border border-gray-300 hover:border-blue-400 hover:shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 focus-within:shadow-[0_4px_16px_rgba(59,130,246,0.08)] !rounded-2xl transition-all duration-300 bg-white text-gray-900",
          error && "border-red-400 bg-red-50/30 focus-within:border-red-500 focus-within:ring-red-100/60 focus-within:shadow-[0_4px_16px_rgba(239,68,68,0.08)]",
          disabled && "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60 hover:shadow-none hover:border-gray-200",
          className
        )}
        sx={{
          "& .MuiSelect-select": {
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            color: "var(--color-neutral-900)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--color-neutral-0)",
              boxShadow: "0 16px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
              borderRadius: "14px",
              marginTop: "8px",
              border: "1.5px solid var(--color-neutral-300)",
              "& .MuiMenuItem-root": {
                margin: "4px 8px",
                padding: "10px 14px",
                borderRadius: "10px",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                color: "var(--color-neutral-800)",
                fontSize: 14,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "var(--color-neutral-50)",
                  color: "var(--color-primary-600)",
                  transform: "translateX(4px)",
                  boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-700)",
                  fontWeight: 600,
                  "&:hover": {
                      backgroundColor: "var(--color-primary-100)",
                  }
                }
              }
            }
          }
        }}
        IconComponent={
          disableArrow
            ? () => null
            : () => (
                <img
                  src={downArrowIcon}
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="mr-3 transition-all duration-300 ease-in-out pointer-events-none hover:scale-110"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              )
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && helperText && <ErrorMessage message={helperText} />}
    </div>
  );
};

export default React.memo(Select);
