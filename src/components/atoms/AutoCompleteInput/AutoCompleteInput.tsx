import React, { useMemo, useCallback, useState } from "react";
import Autocomplete, {
    type AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { ClearIcon } from "@mui/x-date-pickers";
import { createUseStyles } from "react-jss";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

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
            backgroundColor: colors.neutral50,
            borderRadius: "4px",
            paddingRight: "8px",
            height: "52px",

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.neutral200,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary300,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary500,
                boxShadow: `0 0 0 3px ${colors.primary100}`,
            },

            "&.Mui-disabled": {
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral200,
                color: colors.neutral500,
                cursor: "not-allowed",
            },

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.error500,
                boxShadow: `0 0 0 2px ${colors.error100}`,
            },
        },
    }),

    option: (colors: any) => ({
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: "14px",
        cursor: "pointer",

        "&[aria-selected='true']": {
            backgroundColor: colors.primary50,
        },

        "&.Mui-focused, &:hover": {
            backgroundColor: colors.primary100,
        },
    }),

    helperText: (colors: any) => ({
        marginTop: 4,
        fontSize: 12,
        color: colors.neutral500,
    }),

    errorText: (colors: any) => ({
        color: colors.error600,
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
    placeHolder = "",
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

    const handleClear = () => {
        onChange(null);
        onSearch("");
    };

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
            className={`${classes.container} ${
                isDisabled ? "disabled" : ""
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
                popupIcon={open ? <FiChevronUp /> : <FiChevronDown />}
                clearIcon={
                    value ? (
                        <ClearIcon
                            onClick={handleClear}
                            style={{
                                fontSize: 16,
                                color: colors.neutral600,
                                cursor: "pointer",
                            }}
                        />
                    ) : null
                }
                className={classes.autoComplete}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onBlur={onBlur}
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
                                            sx={{ mr: 1 }}
                                        />
                                    )}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} className={classes.option}>
                        {option.icon && <span>{option.icon}</span>}
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
