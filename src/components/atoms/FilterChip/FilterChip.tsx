import React, { useState, useMemo } from "react";
import {
  Select as MuiSelect,
  MenuItem,
  type SelectProps as MuiSelectProps,
  InputAdornment,
  Checkbox,
  ListItemText,
  styled,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button"; 
import { useColors } from "../../../utils/types";

export interface FilterChipOption {
  label: string;
  value: string | number;
}

interface FilterChipV2Props
  extends Omit<MuiSelectProps, "onChange" | "value"> {
  options: FilterChipOption[];
  value: FilterChipOption[];
  onChange: (selected: FilterChipOption[], clearWithCrossIcon?: boolean) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  clearButtonLabel?: string;
  applyButtonLabel?: string;
  enableSearch?: boolean;
  enableRangeFilter?: boolean;
  rangeLabel?: string;
  rangeMinPlaceholder?: string;
  rangeMaxPlaceholder?: string;
  rangeApplyLabel?: string;
  width?: string | number;
  height?: string | number;
}

const StyledSelect = styled(MuiSelect)<{ colors: any }>(({ colors }) => ({
  width: "100%",

  "& .MuiSelect-select": {
    padding: "8px 12px",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",

    border: `1px solid ${colors.neutral200}`,
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 400,
    color: colors.neutral800,
    backgroundColor: colors.neutral0,

    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: colors.primary300,
      backgroundColor: colors.neutral50,
    },

    "&.Mui-focused": {
      borderColor: colors.primary500,
      boxShadow: `0 0 0 2px ${colors.primary100}`,
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 3px ${colors.primary200}`,
    },
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&.Mui-disabled .MuiSelect-select": {
    backgroundColor: colors.neutral100,
    color: colors.neutral400,
    cursor: "not-allowed",
  },

  "&.Mui-error .MuiSelect-select": {
    borderColor: "#EF4444",
    boxShadow: "0 0 0 1px rgba(239,68,68,0.2)",
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      marginTop: 8,
      borderRadius: 12,
      border: "1px solid #E5E7EB",
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    },
  },
  MenuListProps: {
    style: { padding: 0 },
  },
};

const SearchContainer = styled("div")<{ colors: any }>(({ colors }) => ({
  padding: "10px 16px",
  backgroundColor: colors.neutral0,
  position: "sticky",
  top: 0,
  zIndex: 1,
  borderBottom: `1px solid ${colors.neutral200}`,
}));

const ActionsContainer = styled("div")<{ colors: any }>(({ colors }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 16px",
  borderTop: `1px solid ${colors.neutral200}`,
  backgroundColor: colors.neutral0,
  position: "sticky",
  bottom: 0,
  zIndex: 1,
}));

const FilterChipV2: React.FC<FilterChipV2Props> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search…",
  clearButtonLabel = "Clear",
  applyButtonLabel = "Apply",
  enableSearch = true,
  width = "100%",
  height = "auto",
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const colors = useColors();

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleChange = (event: any) => {
    const selectedValues = event.target.value as (string | number)[];
    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value)
    );
    onChange(selectedOptions);
  };

  const handleDelete = (opt: FilterChipOption) => {
    onChange(
      value.filter((v) => String(v.value) !== String(opt.value)),
      true
    );
  };

  const renderValue = (selected: any) => {
    if (!selected.length) {
      return (
        <span style={{ color: colors.neutral400 }}>
          {placeholder}
        </span>
      );
    }

    return (
      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {selected.slice(0, 3).map((val: any) => {
          const opt = options.find((o) => o.value === val);
          if (!opt) return null;

          return (
            <Box
              key={opt.value}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                fontSize: "12px",
                borderRadius: "12px",
                backgroundColor: colors.primary50,
                color: colors.primary700,
                border: `1px solid ${colors.primary300}`,
              }}
            >
              {opt.label}
              <CloseIcon
                sx={{ ml: 0.5, fontSize: 14, cursor: "pointer" }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(opt);
                }}
              />
            </Box>
          );
        })}
        {selected.length > 3 && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              fontSize: "12px",
              borderRadius: "12px",
              backgroundColor: colors.neutral100,
              color: colors.neutral700,
              border: `1px solid ${colors.neutral200}`,
            }}
          >
            +{selected.length - 3} more
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width, height }}>
      <StyledSelect
        multiple
        value={value.map((v) => v.value)}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        MenuProps={MenuProps}
        colors={colors}
        {...props}
      >
        {enableSearch && (
          <SearchContainer colors={colors}>
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </SearchContainer>
        )}

        {filteredOptions.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            <Checkbox
              checked={value.some((v) => String(v.value) === String(opt.value))}
              size="small"
            />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}

        <ActionsContainer colors={colors}>
          <Button
            variant="tertiaryText"
            size="small"
            onClick={() => onChange([])}
            disabled={!value.length}
          >
            {clearButtonLabel}
          </Button>
          <Button variant="primaryText" size="small">
            {applyButtonLabel}
          </Button>
        </ActionsContainer>
      </StyledSelect>
    </Box>
  );
};

export default FilterChipV2;
