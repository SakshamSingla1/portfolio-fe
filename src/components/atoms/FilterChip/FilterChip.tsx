import React, { useState, useMemo } from "react";
import {
  Select as MuiSelect,
  MenuItem,
  InputAdornment,
  Checkbox,
  ListItemText,
  styled,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import { useColors } from "../../../utils/types";

/* =======================
   Types
======================= */

export interface FilterChipOption {
  label: string;
  value: string | number;
}

interface FilterChipV2Props {
  options: FilterChipOption[];
  value: FilterChipOption[];
  onChange: (selected: FilterChipOption[], clearWithCrossIcon?: boolean) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  clearButtonLabel?: string;
  applyButtonLabel?: string;
  enableSearch?: boolean;
  width?: string | number;
  height?: string | number;
}

/* =======================
   Styled Select (FIXED)
======================= */

const StyledSelect = styled(MuiSelect)<{ colors: any }>(({ colors }) => ({
  width: "100%",

  "& .MuiInputBase-root": {
    minHeight: 40,
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",

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
}));

/* =======================
   Component
======================= */

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
}) => {
  const colors = useColors();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          maxHeight: 300,
          mt: 1,
          borderRadius: 2,
          border: `1px solid ${colors.neutral200}`,
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        },
      },
      MenuListProps: { sx: { p: 0 } },
    }),
    [colors]
  );

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
      return <span style={{ color: colors.neutral400 }}>{placeholder}</span>;
    }

    return (
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
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
                fontSize: 12,
                borderRadius: 12,
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
              fontSize: 12,
              borderRadius: 12,
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
        MenuProps={menuProps}
        colors={colors}
      >
        {enableSearch && (
          <Box
            sx={{
              p: "10px 16px",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: colors.neutral50,
              borderBottom: `1px solid ${colors.neutral200}`,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (["ArrowDown", "ArrowUp"].includes(e.key)) {
                  e.stopPropagation();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {filteredOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Checkbox
              size="small"
              checked={value.some((v) => String(v.value) === String(opt.value))}
            />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "10px 16px",
            position: "sticky",
            bottom: 0,
            backgroundColor: colors.neutral50,
            borderTop: `1px solid ${colors.neutral200}`,
          }}
        >
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
        </Box>
      </StyledSelect>
    </Box>
  );
};

export default FilterChipV2;
