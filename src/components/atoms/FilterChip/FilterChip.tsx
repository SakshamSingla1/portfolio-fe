import React, { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import {
  Select as MuiMultiSelect,
  MenuItem,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  type MenuProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "../../atoms/TextField/TextField";
import Button from "../../atoms/Button/Button";
import { FiSearch, FiChevronDown } from "react-icons/fi";
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
    gap: 8,
    minWidth: ({ minWidth }: StyleProps) => minWidth || 280,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: ({ colors }: StyleProps) => colors.neutral800,
    letterSpacing: "0.2px",
  },

  select: {
    borderRadius: 10,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: ({ colors }: StyleProps) => `1px solid ${colors.neutral200}`,
    background: ({ hasSelectedOptions, colors }: StyleProps) =>
      hasSelectedOptions ? colors.primary50 : colors.neutral0,
    padding: "6px 12px",

    "&:hover": {
      borderColor: ({ colors }: StyleProps) => colors.primary300,
      background: ({ colors, hasSelectedOptions }: StyleProps) => 
        hasSelectedOptions ? colors.primary100 : colors.neutral50,
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
      padding: "6px 24px 6px 4px !important",
      minHeight: 24,
      alignItems: "center"
    },

    "& .MuiSelect-icon": {
      color: ({ colors }: StyleProps) => colors.neutral500,
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "absolute",
      top: "50%",
      right: "12px",
      transform: "translateY(-50%)",
    },
    "& .MuiSelect-iconOpen": {
      transform: "translateY(-50%) rotate(180deg)",
    }
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: ({ colors }: StyleProps) => colors.neutral0,
    padding: "16px 16px 12px",
    borderBottom: ({ colors }: StyleProps) => `1px solid ${colors.neutral100}`,
  },

  chip: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 500,
    transition: "all 0.2s ease",
    background: ({ colors }: StyleProps) => colors.primary100,
    color: ({ colors }: StyleProps) => colors.primary800,
    border: ({ colors }: StyleProps) => `1px solid ${colors.primary200}`,
    "&:hover": {
      background: ({ colors }: StyleProps) => colors.primary200,
      transform: "translateY(-1px)",
    }
  },

  chipClose: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    padding: 2,
    marginRight: -4,
    transition: "all 0.2s ease",
    color: ({ colors }: StyleProps) => colors.primary600,
    "&:hover": {
      background: "rgba(0,0,0,0.06)",
      color: ({ colors }: StyleProps) => colors.error600,
    }
  },

  searchContainer: {
    padding: "10px 12px",
  },

  footer: {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    background: ({ colors }: StyleProps) => colors.neutral0,
    padding: "12px 16px",
    borderTop: ({ colors }: StyleProps) => `1px solid ${colors.neutral100}`,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },

  scrollContainer: {
    maxHeight: ({ maxHeight }: any) => maxHeight || 300,
    overflowY: "auto",
    background: ({ colors }: StyleProps) => colors.neutral0,
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: ({ colors }: StyleProps) => colors.neutral300,
      borderRadius: "10px",
    },
  },

  divider: {
    margin: "4px 0",
    opacity: 0.6,
  },
  
  menuItem: {
    margin: "4px 8px",
    borderRadius: "8px",
    border: "1px solid transparent",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: ({ colors }: StyleProps) => colors.neutral0,
    color: ({ colors }: StyleProps) => colors.neutral800,
    "&:hover": {
      backgroundColor: ({ colors }: StyleProps) => colors.neutral50,
      borderColor: ({ colors }: StyleProps) => colors.neutral200,
      color: ({ colors }: StyleProps) => colors.primary600,
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)",
    }
  }
});

const FilterChip: React.FC<MultiSelectInputProps> = ({
  options,
  label,
  value,
  onchange,
  placeholder = "Select...",
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
      setSearchTerm("");
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
        IconComponent={FiChevronDown}
        MenuProps={{
          ...MenuProps,
          PaperProps: {
            ...MenuProps?.PaperProps,
            sx: { 
              maxHeight: "none", 
              borderRadius: "12px",
              marginTop: "6px",
              border: `1px solid ${colors.neutral200}`,
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
              backgroundColor: colors.neutral0,
              ...MenuProps?.PaperProps?.sx 
            },
          },
        }}
        renderValue={() =>
          value.length === 0 ? (
            <span style={{ color: colors.neutral400, fontWeight: 400 }}>{placeholder}</span>
          ) : (
            value.map((option) => (
              <div key={option.value} className={classes.chip}>
                {option.label}
                <span
                  className={classes.chipClose}
                  onMouseDown={(e) => handleDeleteChip(e, option)}
                >
                  <CloseIcon style={{ fontSize: 14 }} />
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
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              onKeyDown={(e: any) => e.stopPropagation()}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch style={{ color: colors.neutral400 }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        {showSelectAll && !isSingleSelect && filteredOptions.length > 0 && (
          <MenuItem onClick={toggleSelectAll} className={classes.menuItem}>
            <ListItemIcon style={{ minWidth: 32 }}>
              <Checkbox
                checked={tempSelected.length === options.length && options.length > 0}
                indeterminate={tempSelected.length > 0 && tempSelected.length < options.length}
                size="small"
                style={{ color: colors.primary500, padding: 0 }}
              />
            </ListItemIcon>
            <ListItemText 
              primary="Select All" 
              primaryTypographyProps={{ style: { fontWeight: 600, fontSize: 14 } }} 
            />
          </MenuItem>
        )}

        {showSelectAll && !isSingleSelect && <Divider className={classes.divider} />}

        <div className={classes.scrollContainer}>
          {filteredOptions.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: colors.neutral400, fontSize: 14 }}>
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleChange(option)}
                className={classes.menuItem}
              >
                {!isSingleSelect && (
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <Checkbox
                      checked={tempSelected.some((v) => v.value === option.value)}
                      size="small"
                      style={{ 
                        padding: 0,
                        color: tempSelected.some((v) => v.value === option.value) 
                          ? colors.primary500 
                          : colors.neutral400 
                      }}
                    />
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={option.label} 
                  primaryTypographyProps={{ 
                    style: { 
                      fontSize: 14,
                      fontWeight: tempSelected.some((v) => v.value === option.value) ? 600 : 400
                    } 
                  }} 
                />
              </MenuItem>
            ))
          )}
        </div>

        <Divider className={classes.divider} />

        <div className={classes.footer}>
          <Button
            variant="secondaryContained"
            label="Clear Selection"
            onClick={handleClear}
            className="w-full"
          />
          <Button
            variant="primaryContained"
            label={`Apply (${tempSelected.length})`}
            onClick={handleApply}
            className="w-full"
          />
        </div>
      </MuiMultiSelect>
    </div>
  );
};

export default React.memo(FilterChip);
