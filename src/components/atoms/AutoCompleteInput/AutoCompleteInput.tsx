import React, { useMemo, useCallback, useState } from "react";
import Autocomplete, {
    type AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useDebounce } from "../../../utils/helper";
import { DEBOUNCE_TIME } from "../../../utils/constant";
import TextField from "../TextField/TextField";
import { useColors } from "../../../utils/types";
import { twMerge } from "tailwind-merge";

export interface AutoCompleteOption {
    label: string | React.ReactNode;
    value: number | string;
    title?: string;
    icon?: React.ReactNode;
}

interface AutoCompleteInputProps {
    label?: string;
    options: AutoCompleteOption[];
    onSearch: (value: string) => void;
    onChange: (option: AutoCompleteOption | null) => void;
    isDisabled?: boolean;
    value?: AutoCompleteOption | null;
    error?: boolean;
    helperText?: string;
    id?: string;
    placeHolder?: string;
    onBlur?: () => void;
    className?: string;
    loading?: boolean;
    required?: boolean;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
    label,
    options,
    onSearch,
    onChange,
    isDisabled = false,
    value = null,
    error = false,
    helperText = "",
    placeHolder = "Search...",
    id,
    onBlur,
    className = "",
    required = false,
    loading = false,
}) => {
    const colors = useColors();
    const [open, setOpen] = useState(false);

    const debouncedSearch = useDebounce((val: string) => {
        onSearch(val);
    }, DEBOUNCE_TIME.DEFAULT);

    const handleChange = useCallback(
        (
            _: React.SyntheticEvent,
            val: AutoCompleteOption | null,
            reason: AutocompleteChangeReason
        ) => {
            if (["selectOption", "clear", "removeOption"].includes(reason)) {
                onChange(val);
            }
        },
        [onChange]
    );

    const handleInputChange = useCallback(
        (_: React.SyntheticEvent, val: string, reason: string) => {
            if (reason === "input") {
                debouncedSearch(val);
            }
        },
        [debouncedSearch]
    );

    const autoCompleteProps = useMemo(
        () => ({
            options,
            getOptionLabel: (option: AutoCompleteOption) => {
                if (typeof option.title === "string" && option.title.trim()) {
                    return option.title;
                }
                if (typeof option.label === "string") {
                    return option.label;
                }
                return "";
            },
            isOptionEqualToValue: (
                o: AutoCompleteOption,
                v: AutoCompleteOption
            ) => o.value === v.value,
        }),
        [options]
    );

    return (
        <div className={twMerge("w-full transition-opacity duration-200", isDisabled && "opacity-60 pointer-events-none select-none", className)}>
            <Autocomplete
                {...autoCompleteProps}
                id={id ?? label ?? "autocomplete"}
                fullWidth
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                disabled={isDisabled}
                loading={loading}
                clearOnBlur={false}
                disableClearable={!value}
                popupIcon={<FiChevronDown />}
                clearIcon={<FiX />}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onBlur={onBlur}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '14px',
                            boxShadow: '0 16px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                            border: '1.5px solid var(--color-neutral-300)',
                            marginTop: '6px',
                            backgroundColor: 'var(--color-neutral-0)',
                            color: 'var(--color-neutral-800)',
                        }
                    },
                    listbox: {
                        sx: {
                            padding: '6px',
                            backgroundColor: 'var(--color-neutral-0)',
                            overflowX: 'hidden',
                            '& .MuiAutocomplete-option': {
                                padding: "10px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontSize: "14px",
                                cursor: "pointer",
                                color: "var(--color-neutral-800)",
                                borderRadius: "8px",
                                margin: "4px 8px",
                                border: "1px solid transparent",
                                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",

                                "&[aria-selected='true']": {
                                    backgroundColor: "var(--color-primary-50) !important",
                                    color: "var(--color-primary-700)",
                                    borderColor: "var(--color-primary-200)",
                                    fontWeight: 600,
                                },

                                "&.Mui-focused, &:hover": {
                                    backgroundColor: "var(--color-neutral-50) !important",
                                    borderColor: "var(--color-neutral-200)",
                                    color: "var(--color-primary-700)",
                                    boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08)",
                                },
                            },
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--color-neutral-300)',
                                borderRadius: '10px',
                            },
                        }
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        placeholder={placeHolder}
                        error={error}
                        helperText={helperText}
                        required={required}
                        disabled={isDisabled}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && (
                                        <CircularProgress
                                            size={16}
                                            sx={{ mr: 1, color: colors.primary500 }}
                                        />
                                    )}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                                paddingRight: "8px !important",
                            },
                            "& input": {
                                padding: "13px 14px !important",
                            }
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props as any;
                    return (
                        <li {...optionProps} key={key}>
                            {option.icon && (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 25 }}>
                                    {option.icon}
                                </span>
                            )}
                            {option.label}
                        </li>
                    );
                }}
            />

            {helperText && !error && (
                <div className="mt-1.5 ml-2 text-xs text-gray-500 select-none">{helperText}</div>
            )}
        </div>
    );
};

export default React.memo(AutoCompleteInput);
