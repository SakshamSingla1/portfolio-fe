import React, { useState } from "react";
import {
  Select as MuiSelect,
  MenuItem,
  type SelectProps as MuiSelectProps,
} from "@mui/material";
import { styled } from "@mui/system";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import downArrowIcon from "../../../assets/icons/downArrowFilled.svg";
import { capitalizeFirstLetter } from "../../../utils/helper";
import { useColors } from "../../../utils/types";

/* =======================
   Styled Select
======================= */

const StyledSelect = styled(MuiSelect)<{ colors: any }>(({ colors }) => ({
  width: "100%",

  "& .MuiInputBase-root": {
    minHeight: 52,
    padding: "0 12px",
    display: "flex",
    alignItems: "center",

    backgroundColor: colors.neutral50,
    border: `1px solid ${colors.neutral200}`,
    borderRadius: 12,
    fontSize: 16,
    color: colors.neutral900,

    transition: "all 0.2s ease-in-out",

    "&:hover": {
      borderColor: colors.primary300,
    },

    "&.Mui-focused": {
      borderColor: colors.primary500,
      boxShadow: `0 0 0 3px ${colors.primary100}`,
    },
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&.Mui-disabled .MuiInputBase-root": {
    backgroundColor: colors.neutral100,
    borderColor: colors.neutral200,
    color: colors.neutral500,
  },

  "&.Mui-error .MuiInputBase-root": {
    borderColor: colors.error500,
    backgroundColor: colors.error50,
  },

  "& .MuiSelect-select": {
    padding: "13px 12px",
    display: "flex",
    alignItems: "center",
  },
}));

/* =======================
   Types
======================= */

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

/* =======================
   Component
======================= */

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
  ...props
}) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const renderValue = (selected: any) => {
    if (selected === "" || selected === undefined || selected === null) {
      return <span style={{ color: colors.neutral400 }}>{placeholder}</span>;
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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

      <StyledSelect
        {...props}
        value={value ?? ""}
        error={error}
        disabled={disabled}
        displayEmpty
        renderValue={renderValue}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(e) => onChange?.(e.target.value as string | number)}
        colors={colors}
        IconComponent={
          disableArrow
            ? () => null
            : () => (
                <img
                  src={downArrowIcon}
                  alt="Arrow"
                  width={20}
                  height={20}
                  style={{
                    marginRight: 8,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
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
      </StyledSelect>

      {error && helperText && <ErrorMessage message={helperText} />}
    </div>
  );
};

export default Select;
