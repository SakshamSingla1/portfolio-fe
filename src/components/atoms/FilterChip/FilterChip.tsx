import React, { useEffect, useMemo, useState } from "react";
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
import { twMerge } from "tailwind-merge";

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
  className?: string;
}

const FilterChip: React.FC<MultiSelectInputProps> = ({
  options,
  label,
  value,
  onchange,
  placeholder = "Select...",
  isSingleSelect = false,
  minWidth = "280px",
  maxHeight = "300px",
  searchable = true,
  showSelectAll = true,
  MenuProps,
  className,
}) => {
  const colors = useColors();
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
    <div className="flex flex-col gap-1.5 w-full" style={{ minWidth }}>
      {label && (
        <div className="text-xs font-semibold text-gray-800 tracking-wide select-none">
          {label}
        </div>
      )}

      <MuiMultiSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        multiple
        value={value.map((v) => v.value)}
        displayEmpty
        disableUnderline
        className={twMerge(
          "text-sm border border-gray-200 !rounded-2xl transition-all duration-300 bg-white text-gray-900",
          value.length > 0 && "bg-blue-50/50 border-blue-200 hover:bg-blue-50/70",
          "hover:border-blue-400 hover:shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 focus-within:shadow-[0_4px_16px_rgba(59,130,246,0.08)]",
          className
        )}
        IconComponent={FiChevronDown}
        MenuProps={{
          ...MenuProps,
          PaperProps: {
            ...MenuProps?.PaperProps,
            sx: {
              maxHeight: "none",
              borderRadius: "14px",
              marginTop: "8px",
              border: "1px solid var(--color-neutral-200)",
              boxShadow: "0 16px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
              backgroundColor: "var(--color-neutral-0)",
              ...MenuProps?.PaperProps?.sx
            },
          },
        }}
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            padding: "6px 32px 6px 12px !important",
            minHeight: "24px",
            alignItems: "center",
          },
          "& .MuiSelect-icon": {
            color: "var(--color-neutral-500)",
            transition: "transform 0.3s ease-in-out",
            right: "12px",
          },
          "& .MuiSelect-iconOpen": {
            transform: "rotate(180deg)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        renderValue={() =>
          value.length === 0 ? (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          ) : (
            value.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700 hover:bg-blue-200 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-200 hover:scale-[1.03] select-none"
              >
                {option.label}
                <span
                  className="cursor-pointer flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 hover:text-red-600 transition-all"
                  onMouseDown={(e) => handleDeleteChip(e, option)}
                >
                  <CloseIcon style={{ fontSize: 13 }} />
                </span>
              </div>
            ))
          )
        }
      >
        {searchable && (
          <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100">
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
                    <FiSearch className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        {showSelectAll && !isSingleSelect && filteredOptions.length > 0 && (
          <MenuItem
            onClick={toggleSelectAll}
            className="mx-2 my-1 p-2 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 hover:text-blue-600 active:scale-[0.99] transition-all duration-200"
          >
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

        {showSelectAll && !isSingleSelect && <Divider className="my-1 opacity-60" />}

        <div
          className="overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200"
          style={{ maxHeight }}
        >
          {filteredOptions.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm select-none">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleChange(option)}
                className="mx-2 my-1 p-2 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 hover:text-blue-600 active:scale-[0.99] transition-all duration-200"
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

        <Divider className="my-1 opacity-60" />

        <div className="sticky bottom-0 z-10 bg-white px-4 py-3 border-t border-gray-100 flex justify-between gap-3">
          <Button
            variant="secondaryContained"
            label="Clear"
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
