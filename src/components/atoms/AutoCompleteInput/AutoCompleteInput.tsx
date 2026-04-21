import React, { useMemo, useCallback, useState } from "react";
import Autocomplete, {
    type AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseStyles } from "react-jss";
import { FiChevronDown, FiX } from "react-icons/fi";

import { useDebounce } from "../../../utils/helper";
import { DEBOUNCE_TIME } from "../../../utils/constant";
import TextField from "../TextField/TextField";
import { useColors } from "../../../utils/types";

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

const useStyles = createUseStyles({
    container: {
        width: "100%",
        "&.disabled": {
            opacity: 0.6,
            pointerEvents: "none",
        },
    },

    autoComplete: (colors: any) => ({
        "& .MuiOutlinedInput-root": {
            backgroundColor: colors.neutral0,
            borderRadius: "10px",
            paddingRight: "8px",
            minHeight: "48px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.neutral200,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                borderWidth: "1px",
            },

            "&:hover": {
                backgroundColor: colors.neutral50,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary300,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary500,
                borderWidth: "1px",
                boxShadow: `0 0 0 3px ${colors.primary100}`,
            },

            "&.Mui-disabled": {
                backgroundColor: colors.neutral50,
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.neutral200,
                },
                "& input": {
                    "-webkit-text-fill-color": `${colors.neutral400} !important`,
                    color: `${colors.neutral400} !important`,
                },
                cursor: "not-allowed",
            },

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.error500,
                boxShadow: `0 0 0 3px ${colors.error50}`,
            },

            "& .MuiAutocomplete-input": {
                padding: "4px 8px !important",
            }
        },

        "& .MuiAutocomplete-endAdornment": {
            top: "50%",
            transform: "translateY(-50%)",
            right: "8px",
            display: "flex",
            alignItems: "center",
        },

        "& .MuiAutocomplete-popupIndicator": {
            color: colors.neutral500,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: 4,
            "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)"
            }
        },

        "& .MuiAutocomplete-clearIndicator": {
            color: colors.neutral400,
            padding: 4,
            transition: "all 0.2s ease",
            "&:hover": {
                color: colors.error600,
                backgroundColor: "rgba(0,0,0,0.04)"
            }
        }
    }),

    option: (colors: any) => ({
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: "14px",
        cursor: "pointer",
        color: colors.neutral800,
        borderRadius: "8px",
        margin: "4px 8px",
        border: "1px solid transparent",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

        "&[aria-selected='true']": {
            backgroundColor: `${colors.primary50} !important`,
            color: colors.primary700,
            borderColor: colors.primary200,
            fontWeight: 600,
        },

        "&.Mui-focused, &:hover": {
            backgroundColor: `${colors.neutral50} !important`,
            borderColor: colors.neutral200,
            color: colors.primary600,
            transform: "translateY(-1px)",
            boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)",
        },
    }),

    helperText: (colors: any) => ({
        marginTop: 6,
        marginLeft: 8,
        fontSize: 12,
        color: colors.neutral500,
    }),
});

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
    const classes = useStyles(colors);
    const [open, setOpen] = useState(false);

    const debouncedSearch = useMemo(
        () =>
            useDebounce((val: string) => {
                onSearch(val);
            }, DEBOUNCE_TIME.DEFAULT),
        [onSearch]
    );

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
            getOptionLabel: (option: AutoCompleteOption) =>
                typeof option.title === "string" && option.title.trim()
                    ? option.title
                    : String(option.label ?? ""),
            isOptionEqualToValue: (
                o: AutoCompleteOption,
                v: AutoCompleteOption
            ) => o.value === v.value,
        }),
        [options]
    );

    return (
        <div
            className={`${classes.container} ${isDisabled ? "disabled" : ""
                } ${className}`}
        >
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
                className={classes.autoComplete}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onBlur={onBlur}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                            border: `1px solid ${colors.neutral200}`,
                            marginTop: '6px',
                            backgroundColor: colors.neutral0,
                            color: colors.neutral800,
                        }
                    },
                    listbox: {
                        sx: {
                            padding: '6px 0',
                            backgroundColor: colors.neutral0,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: colors.neutral300,
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
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.value} className={classes.option}>
                        {option.icon && (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 20 }}>
                                {option.icon}
                            </span>
                        )}
                        {option.label}
                    </li>
                )}
            />

            {helperText && !error && (
                <div className={classes.helperText}>{helperText}</div>
            )}
        </div>
    );
};

export default React.memo(AutoCompleteInput);
