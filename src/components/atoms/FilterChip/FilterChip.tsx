import React, { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  Select as MuiMultiSelect,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  InputAdornment,
  type MenuProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import { FiSearch } from "react-icons/fi";
import { useColors } from "../../../utils/types";

export interface IMultiSelectOption {
  label: string;
  value: string | number;
}

interface MultiSelectInputProps {
  options: IMultiSelectOption[];
  label?: string;
  value: IMultiSelectOption[];
  onchange: (selected: IMultiSelectOption[]) => void;
  placeholder?: string;
  isSingleSelect?: boolean;
  minWidth?: string;
  maxHeight?: string;
  searchable?: boolean;
  showSelectAll?: boolean;
  MenuProps?: Partial<MenuProps>;
}

interface StyleProps {
  hasSelectedOptions: boolean;
  colors: any;
  minWidth?: string;
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: ({ minWidth }: StyleProps) => minWidth || 280,
  },

  label: {
    fontSize: 14,
    fontWeight: 500,
    color: ({ colors }: StyleProps) => colors.neutral700,
  },

  select: {
    borderRadius: 8,
    border: ({ colors }: StyleProps) => `1px solid ${colors.neutral200}`,
    background: ({ hasSelectedOptions, colors }: StyleProps) =>
      hasSelectedOptions ? colors.primary50 : "#fff",
    padding: "4px 8px",

    "&:hover": {
      borderColor: ({ colors }: StyleProps) => colors.primary300,
    },

    "&.Mui-focused": {
      borderColor: ({ colors }: StyleProps) => colors.primary500,
      boxShadow: ({ colors }: StyleProps) =>
        `0 0 0 3px ${colors.primary100}`,
    },

    "& .MuiSelect-select": {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      padding: "6px !important",
    },
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: "#fff",
    padding: 12,
    borderBottom: "1px solid #eee",
  },

  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    borderRadius: 16,
    fontSize: 12,
    background: ({ colors }: StyleProps) => colors.primary100,
    color: ({ colors }: StyleProps) => colors.primary700,
  },

  chipClose: {
    cursor: "pointer",
    display: "flex",
  },

  searchContainer: {
    padding: "10px 12px",
  },

  footer: {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    background: "#fff",
    padding: 12,
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },

  scrollContainer: {
    maxHeight: ({ maxHeight }: any) => maxHeight || 300,
    overflowY: "auto",
  },

  divider: {
    margin: "8px 0",
  },
});

const FilterChip: React.FC<MultiSelectInputProps> = ({
  options,
  label,
  value,
  onchange,
  placeholder = "Select",
  isSingleSelect = false,
  minWidth = "280px",
  maxHeight = "320px",
  searchable = true,
  showSelectAll = true,
  MenuProps,
}) => {
  const colors = useColors();
  const classes = useStyles({
    hasSelectedOptions: value.length > 0,
    colors,
    minWidth,
  });

  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<IMultiSelectOption[]>(value);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setTempSelected(value);
    }
  }, [open, value]);

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const handleChange = (option: IMultiSelectOption) => {
    if (isSingleSelect) {
      setTempSelected([option]);
      return;
    }

    const exists = tempSelected.some((v) => v.value === option.value);
    if (exists) {
      setTempSelected(tempSelected.filter((v) => v.value !== option.value));
    } else {
      setTempSelected([...tempSelected, option]);
    }
  };

  const handleApply = () => {
    onchange(tempSelected);
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
    onchange([]);
    setOpen(false);
  };

  const handleDeleteChip = (
    e: React.MouseEvent,
    option: IMultiSelectOption
  ) => {
    e.stopPropagation();
    const updated = value.filter((v) => v.value !== option.value);
    onchange(updated);
  };

  const toggleSelectAll = () => {
    if (tempSelected.length === options.length) {
      setTempSelected([]);
    } else {
      setTempSelected(options);
    }
  };

  return (
    <div className={classes.container}>
      {label && <div className={classes.label}>{label}</div>}

      <MuiMultiSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        multiple
        value={value.map((v) => v.value)}
        displayEmpty
        disableUnderline
        className={classes.select}
        MenuProps={{
          ...MenuProps,
          PaperProps: {
            ...MenuProps?.PaperProps,
            sx: { maxHeight },
          },
        }}
        renderValue={() =>
          value.length === 0 ? (
            <span style={{ color: colors.neutral400 }}>{placeholder}</span>
          ) : (
            value.map((option) => (
              <div key={option.value} className={classes.chip}>
                {option.label}
                <span
                  className={classes.chipClose}
                  onMouseDown={(e) => handleDeleteChip(e, option)}
                >
                  <CloseIcon fontSize="small" />
                </span>
              </div>
            ))
          )
        }
      >
        {searchable && (
          <div className={classes.header}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              onKeyDown={(e: any) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        {showSelectAll && !isSingleSelect && (
          <MenuItem onClick={toggleSelectAll}>
            <Checkbox
              checked={tempSelected.length === options.length}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
        )}

        <Divider className={classes.divider} />

        <div className={classes.scrollContainer}>
        {filteredOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleChange(option)}
          >
            {!isSingleSelect && (
              <Checkbox
                checked={tempSelected.some(
                  (v) => v.value === option.value
                )}
              />
            )}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
        </div>

        <Divider />

        <div className={classes.footer}>
          <Button
            variant="secondaryContained"
            label="Clear"
            onClick={handleClear}
          />
          <Button
            variant="primaryContained"
            label="Apply"
            onClick={handleApply}
          />
        </div>
      </MuiMultiSelect>
    </div>
  );
};

export default FilterChip;
