import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import {
    Select as MuiMultiSelect,
    MenuItem,
    InputAdornment,
    type MenuProps,
    ListSubheader,
} from "@mui/material";
import TextField from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { FiSearch } from 'react-icons/fi';
import { useColors } from "../../../utils/types";

interface StyleProps {
    hasSelectedOptions: boolean;
    minWidth?: string;
    colors: any;
}

const useStyles = createUseStyles({
    select: {
        "& .MuiInputBase-input": {
            fontWeight: 400,
            fontSize: 14,
            padding: "9px 12px !important",
            lineHeight: "18px",
            color: ({ colors }: StyleProps) => colors.neutral900,
        },
        border: ({ colors }: StyleProps) => `1px solid ${colors.neutral200}`,
        borderRadius: 4,
        backgroundColor: ({ hasSelectedOptions, colors }: StyleProps) =>
            hasSelectedOptions ? colors.primary50 : 'transparent',

        '&:hover': {
            borderColor: ({ colors }: StyleProps) => colors.primary300,
        },

        '&.Mui-focused': {
            borderColor: ({ colors }: StyleProps) => colors.primary500,
            boxShadow: ({ colors }: StyleProps) =>
                `0 0 0 3px ${colors.primary100}`,
        },

        '&.Mui-disabled': {
            backgroundColor: ({ colors }: StyleProps) => colors.neutral100,
            borderColor: ({ colors }: StyleProps) => colors.neutral200,
            cursor: 'not-allowed',
        },
    },

    label: {
        color: ({ colors }: StyleProps) => colors.neutral700,
        fontSize: 14,
        fontWeight: 500,
    },

    placeholder: {
        color: ({ colors }: StyleProps) => `${colors.neutral400} !important`,
    },

    checkedInputColor: {
        color: ({ colors }: StyleProps) => colors.neutral300,
        '&.Mui-checked': {
            color: ({ colors }: StyleProps) => colors.primary500,
        },
    },

    primaryHighlighter: {
        color: ({ colors }: StyleProps) => colors.neutral900,
    },

    searchContainer: {
        padding: '8px 16px',
    },

    clearButton: {
        margin: '8px 0px',
    },

    divider: {
        color: ({ colors }: StyleProps) => colors.neutral300,
    },

    container: {
        minWidth: ({ minWidth }: StyleProps) => minWidth || "280px",
    },
});

export interface IMultiSelectOption {
    label: string;
    value: string | number;
}

interface MultiSelectInputProps {
    options: IMultiSelectOption[];
    label?: string;
    helperText?: string;
    value: IMultiSelectOption[];
    onchange: (selected: IMultiSelectOption[], clearWithCrossIcon?: boolean) => void;
    placeholder?: string;
    searchTerm?: string;
    setSearchTerm?: (value: string) => void;
    isSingleSelect?: boolean;
    maxHeight?: string;
    minWidth?: string;
    disableCross?: boolean;
    rangeTypeShow?: boolean;
    MenuProps?: Partial<MenuProps>;
}

const FilterChipV2: React.FC<MultiSelectInputProps> = ({
    options,
    label,
    value,
    onchange,
    placeholder,
    searchTerm,
    setSearchTerm,
    isSingleSelect = false,
    maxHeight = '60%',
    minWidth = '278px',
    disableCross = false,
    rangeTypeShow = false,
    ...props
}) => {
    const colors = useColors();
    const hasSelectedOptions = value.length > 0;
    const classes = useStyles({ hasSelectedOptions, minWidth, colors });
    const [open, setOpen] = useState(false);

    const handleChange = (event: any) => {
        const selectedValues = event.target.value as (string | number)[];
        const selectedOptions = isSingleSelect
            ? options.filter(o => o.value === selectedValues[selectedValues.length - 1])
            : options.filter(o => selectedValues.includes(o.value));

        onchange(selectedOptions, false);
    };

    const handleDelete = (event: any, option: IMultiSelectOption) => {
        event.stopPropagation();
        const updated = value.filter(v => v.value !== option.value);
        onchange(updated, true);
    };

    const menuProps: Partial<MenuProps> = {
        ...props.MenuProps,
        PaperProps: {
            ...props.MenuProps?.PaperProps,
            sx: {
                width: minWidth,
                maxHeight,
            },
        },
    };

    return (
        <div className={`${classes.container} flex flex-col gap-2`}>
            {label && <div className={classes.label}>{label}</div>}

            <MuiMultiSelect
                disableUnderline
                displayEmpty
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                MenuProps={menuProps}
                value={value.map(v => v.value)}
                multiple
                size="small"
                className={classes.select}
                renderValue={(selected) =>
                    selected.length === 0
                        ? <span className={classes.placeholder}>{placeholder}</span>
                        : value.map(option => (
                            <div key={option.value} className="flex gap-2 items-center">
                                {!disableCross && (
                                    <CloseIcon
                                        fontSize="small"
                                        onMouseDown={(e) => handleDelete(e, option)}
                                    />
                                )}
                                <span>{option.label}</span>
                            </div>
                        ))
                }
                onChange={handleChange}
            >
                {searchTerm !== undefined && setSearchTerm && (
                    <div className={classes.searchContainer}>
                        <TextField
                            size="small"
                            placeholder="Search"
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

                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                            className={classes.checkedInputColor}
                            checked={value.some(v => v.value === option.value)}
                        />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}

                <ListSubheader disableSticky className="bg-white flex justify-end">
                    <Button
                        size="small"
                        variant="secondaryText"
                        label="Clear"
                        onClick={() => onchange([], true)}
                    />
                </ListSubheader>
            </MuiMultiSelect>
        </div>
    );
};

export default FilterChipV2;
