import React from "react";
import type { TextFieldProps } from "@mui/material/TextField";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createUseStyles } from "react-jss";
import TextField from "../TextField/TextField";
import { useColors } from "../../../utils/types";

const useStyles = createUseStyles({
    label: (colors: any) => ({
        color: colors.neutral700,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "16px",
        marginLeft: "8px",
    }),
});

interface DatePickerProps
    extends Omit<MuiDatePickerProps<any>, "renderInput"> {
    label?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    textFieldProps?: TextFieldProps;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    error,
    helperText,
    fullWidth = true,
    textFieldProps,
    ...props
}) => {
    const colors = useColors();
    const classes = useStyles(colors);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
                className={`flex flex-col gap-1 w-auto relative ${props.disabled ? "pointer-events-none select-none" : ""
                    }`}
            >
                {label && <div className={classes.label}>{label}</div>}

                <MuiDatePicker
                    {...props}
                    disableHighlightToday
                    enableAccessibleFieldDOMStructure={false}
                    format="DD/MM/YYYY"
                    slots={{
                        textField: TextField as any,
                    }}
                    slotProps={{
                        textField: {
                            placeholder: "DD/MM/YYYY",
                            fullWidth,
                            error,
                            helperText,
                            ...textFieldProps,
                            inputProps: {
                                ...textFieldProps?.inputProps,
                                disabled: true,
                            }
                        },
                        field: {
                            clearable: true,
                        },
                    }}
                />
            </div>
        </LocalizationProvider>
    );
};

export default DatePicker;
