import React, { useState } from 'react';
import { createUseStyles } from "react-jss";
import { Select as MuiSelect, MenuItem, SelectProps as MuiSelectProps } from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import downArrowIcon from "../../../assets/icons/downArrowFilled.svg";
import { capitalizeFirstLetter } from '../../../utils/helper';

const useStyles = createUseStyles((theme: any) => ({
    input: {
        border: "1px solid",
        borderColor: theme.palette.border.neutral.neutral200,
        fontSize: "16px",
        fontWeight: 500,
        borderRadius: "12px",
        color: theme.palette.text.neutral.neutral800,
        marginTop: "4px",
        "&:hover": {
            borderColor: theme.palette.border.primary.primary300,
            background: "white",
            borderWidth: "1px",
            outline: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            outline: "none",
            borderWidth: 0,
            borderColor: theme.palette.border.primary.primary300,
        },
        "&:focus-within": {
            outline: "none",
            borderColor: `${theme.palette.border.primary.primary300} !important`,
            borderWidth: 2,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            outline: "none",
            borderWidth: 0,
            borderColor: `${theme.palette.border.primary.primary300} !important`,
        },
        "& .MuiInputBase-input": {
            padding: "13px 12px !important",
        },
    },
    label: {
        color: theme.palette.text.neutral.neutral700,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "16px"
    },
    placeholder: {
        color: `${theme.palette.text.neutral.neutral200} !important`,
        fontWeight: 400
    },
    icon: {
        right: 8,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        transition: "transform 0.3s ease",
    },
    iconOpen: {
        transform: "translateY(-50%) rotate(180deg)",
    },
    "@media (max-width: 767px)": {
        input: {
            border: "1px solid",
            borderColor: theme.palette.border.neutral.neutral200,
            fontSize: "14px",
            fontWeight: 400,
            borderRadius: "6px",
            color: theme.palette.text.neutral.neutral800,
            "&:hover": {
                borderColor: theme.palette.border.primary.primary300,
                borderWidth: 1,
                outline: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
                outline: "none",
                borderWidth: 0,
                borderColor: theme.palette.border.primary.primary300,
            },
            "&:focus-within": {
                outline: "none",
                borderColor: `${theme.palette.border.primary.primary300} !important`,
                borderWidth: "2px !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                outline: "none",
                borderWidth: 0,
                borderColor: `${theme.palette.border.primary.primary300} !important`,
            },
            "& .MuiInputBase-input": {
            },
        },
        label: {
            color: theme.palette.text.neutral.neutral700,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16.1px"
        },
    },
}));

interface Option {
    value: string | number;
    label: string | React.ReactNode;
}

interface SelectProps extends Omit<MuiSelectProps, 'label' | 'onChange' | 'onBlur' | 'onFocus'> {
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
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const renderValue = () => {
        if (props.value && typeof props.value === 'string') {
            const value = props.value as string;
            return disableCapitalization
                ? value.replace(/_/g, " ")
                : value.split("_").map((el) => capitalizeFirstLetter(el)).join(" ");
        }
        return <span className={`${classes.placeholder} !font-normal`}>{props.placeholder}</span>;
    };

    return (
        <div className={`flex flex-col w-full relative ${props.disabled ? 'pointer-events-none select-none' : ''}`}>
            {label && (<div className={classes.label}>{label}</div>)}
            <MuiSelect
                id={`select-${label}`}
                {...props}
                className={classes.input}
                displayEmpty
                renderValue={renderValue}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={(e) => onChange?.(e.target.value as number)}   // ✅ map event → value
                onBlur={(e) => onBlur?.(e.target.value as string | number)}
                onFocus={(e) => onFocus?.(e.target.value as string | number)}
                IconComponent={disableArrow ? () => null : (iconProps) => {
                    const { className, ...otherProps } = iconProps;
                    return (
                        <img
                            {...otherProps}
                            className={`${className} ${classes.icon} ${open ? classes.iconOpen : ''}`}
                            src={downArrowIcon}
                            alt="Down Arrow"
                            style={{
                                width: '20px',
                                height: '20px',
                                transition: 'transform 0.2s',
                                transform: open ? 'rotate(180deg)' : 'rotate(0)'
                            }}
                        />
                    );
                }}
            >
                {options.map(option => (
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
