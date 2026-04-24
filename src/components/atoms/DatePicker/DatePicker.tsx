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
    required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    error,
    helperText,
    fullWidth = true,
    textFieldProps,
    required = false,
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
                {label && <div className={classes.label}>{label} {required && <span style={{ color: colors.error600 }}>*</span>}</div>}

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
                            },
                            required,
                        },
                        field: {
                            clearable: true,
                        },
                        popper: {
                            sx: {
                                "& .MuiPaper-root": {
                                    backgroundColor: colors.neutral0,
                                    border: `1px solid ${colors.neutral200}`,
                                    boxShadow: `0 12px 32px -4px ${colors.neutral900}30`,
                                    borderRadius: "16px",
                                    color: colors.neutral900,
                                },
                                "& .MuiPickersCalendarHeader-root": {
                                    color: colors.neutral900,
                                },
                                "& .MuiPickersCalendarHeader-label": {
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                },
                                "& .MuiDayCalendar-weekDayLabel": {
                                    color: colors.neutral500,
                                    fontWeight: 600,
                                },
                                "& .MuiPickersArrowSwitcher-button": {
                                    color: colors.neutral600,
                                    "&:hover": {
                                        backgroundColor: colors.neutral100,
                                    }
                                },
                                "& .MuiPickersDay-root": {
                                    color: colors.neutral800,
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor: colors.primary50,
                                        color: colors.primary600,
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: colors.primary500,
                                        color: colors.neutral0,
                                        "&:focus": {
                                            backgroundColor: colors.primary600,
                                        }
                                    },
                                    "&.MuiPickersDay-today": {
                                        borderColor: colors.primary400,
                                        color: colors.primary600,
                                    }
                                },
                                "& .MuiPickersYear-yearButton": {
                                    color: colors.neutral800,
                                    "&.Mui-selected": {
                                        backgroundColor: colors.primary500,
                                        color: colors.neutral0,
                                    },
                                    "&:hover": {
                                        backgroundColor: colors.primary50,
                                        color: colors.primary600,
                                    }
                                }
                            }
                        }
                    }}
                />
            </div>
        </LocalizationProvider>
    );
};

export default React.memo(DatePicker);
