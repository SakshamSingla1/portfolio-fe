import React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { useColors } from "../../../utils/types";

interface CheckboxProps extends Omit<MuiCheckboxProps, "onChange"> {
    label?: string;
    onChange?: (checked: boolean) => void;
    className?: string;
    labelClassName?: string;
}

const StyledCheckbox = styled(MuiCheckbox)<{ colors: any }>(({ colors }) => ({
    padding: 6,

    color: colors.neutral400,

    "&:hover": {
        backgroundColor: colors.primary50,
    },

    "&.Mui-checked": {
        color: colors.primary500,
    },

    "&.Mui-checked:hover": {
        backgroundColor: colors.primary100,
    },

    "&.Mui-disabled": {
        color: colors.neutral300,
    },

    "&.Mui-focusVisible": {
        outline: "none",
        boxShadow: `0 0 0 3px ${colors.primary100}`,
        borderRadius: 4,
    },

    "&.Mui-error": {
        color: colors.error500,
    },
}));

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    onChange,
    className = "",
    labelClassName = "",
    ...props
}) => {
    const colors = useColors();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.checked);
    };

    const checkbox = (
        <StyledCheckbox
            {...props}
            colors={colors}
            onChange={handleChange}
            className={className}
        />
    );

    if (label) {
        return (
            <FormControlLabel
                control={checkbox}
                label={label}
                className={labelClassName}
                sx={{
                    "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                        color: colors.neutral800,
                    },
                    "&.Mui-disabled .MuiFormControlLabel-label": {
                        color: colors.neutral500,
                    },
                }}
            />
        );
    }

    return checkbox;
};

export default Checkbox;
