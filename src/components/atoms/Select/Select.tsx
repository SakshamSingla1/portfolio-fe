import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import {
    Select as MuiSelect,
    MenuItem,
    type SelectProps as MuiSelectProps,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import downArrowIcon from "../../../assets/icons/downArrowFilled.svg";
import { capitalizeFirstLetter } from "../../../utils/helper";
import { useColors } from "../../../utils/types";

const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        gap: "6px",
    },

    label: (colors: any) => ({
        color: colors.neutral700,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "16px",
        marginLeft: "8px",
    }),

    input: (colors: any) => ({
        backgroundColor: colors.neutral50,
        border: `1px solid ${colors.neutral200}`,
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: 400,
        color: colors.neutral900,
        transition: "all 0.2s ease-in-out",

        "&:hover": {
            borderColor: colors.primary300,
        },

        "&:focus-within": {
            borderColor: colors.primary500,
            boxShadow: `0 0 0 3px ${colors.primary100}`,
        },

        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },

        "& .MuiSelect-select": {
            padding: "13px 12px",
            display: "flex",
            alignItems: "center",
        },

        "&.Mui-disabled": {
            backgroundColor: colors.neutral100,
            borderColor: colors.neutral200,
            color: colors.neutral500,
            cursor: "not-allowed",
        },

        /* Error state */
        "&.Mui-error": {
            borderColor: colors.error500,
            backgroundColor: colors.error50,
        },
    }),

    placeholder: (colors: any) => ({
        color: colors.neutral400,
        fontWeight: 400,
    }),

    icon: {
        right: 10,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        transition: "transform 0.2s ease",
    },

    iconOpen: {
        transform: "translateY(-50%) rotate(180deg)",
    },

    "@media (max-width: 767px)": {
        label: {
            fontSize: "13px",
            marginLeft: "6px",
        },

        input: {
            fontSize: "14px",
            borderRadius: "8px",

            "& .MuiSelect-select": {
                padding: "11px 10px",
            },
        },
    },
});

interface Option {
    value: string | number;
    label: string | React.ReactNode;
}

interface SelectProps
    extends Omit<
        MuiSelectProps,
        "label" | "onChange" | "onBlur" | "onFocus"
    > {
    options: Option[];
    label: string;
    helperText?: string;
    disableCapitalization?: boolean;
    disableArrow?: boolean;
    placeholder?: string;
    onChange?: (value: number) => void;
    onBlur?: (value: string | number | null) => void;
    onFocus?: (value: string | number | null) => void;
}

const Select: React.FC<SelectProps> = ({
    options,
    label,
    helperText,
    disableCapitalization = false,
    disableArrow = false,
    onChange,
    onBlur,
    onFocus,
    ...props
}) => {
    const colors = useColors();
    const classes = useStyles(colors);
    const [open, setOpen] = useState(false);

    const renderValue = () => {
        if (props.value && typeof props.value === "string") {
            const value = props.value;
            return disableCapitalization
                ? value.replace(/_/g, " ")
                : value
                      .split("_")
                      .map((el) => capitalizeFirstLetter(el))
                      .join(" ");
        }

        return (
            <span className={classes.placeholder}>
                {props.placeholder}
            </span>
        );
    };

    return (
        <div
            className={`${classes.wrapper} ${
                props.disabled ? "pointer-events-none select-none" : ""
            }`}
        >
            {label && <label className={classes.label}>{label}</label>}

            <MuiSelect
                {...props}
                displayEmpty
                renderValue={renderValue}
                className={classes.input}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={(e) => onChange?.(e.target.value as number)}
                onBlur={(e) => onBlur?.(e.target.value as any)}
                onFocus={(e) => onFocus?.(e.target.value as any)}
                IconComponent={
                    disableArrow
                        ? () => null
                        : (iconProps) => (
                              <img
                                  {...iconProps}
                                  src={downArrowIcon}
                                  alt="Arrow"
                                  className={`${classes.icon} ${
                                      open ? classes.iconOpen : ""
                                  }`}
                                  width={20}
                                  height={20}
                              />
                          )
                }
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>

            {props.error && <ErrorMessage message={helperText} />}
        </div>
    );
};

export default Select;
