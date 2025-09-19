import React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
    label: {
        color: theme.palette.text.neutral.neutral700,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "16px"
    },
}));

interface DatePickerProps extends Omit<MuiDatePickerProps, 'renderInput'> {
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
    const classes = useStyles();
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={`flex flex-col gap-1 w-auto relative ${props.disabled ? 'pointer-events-none select-none' : ''}`}>
                {label && (
                    <div className={classes.label}>
                        {label}
                    </div>
                )}
                <MuiDatePicker
                    slotProps={{
                        textField: {
                            fullWidth,
                            error,
                            helperText,
                            ...textFieldProps,
                        },
                        field: {
                            clearable: true,
                        },
                    }}
                    disableHighlightToday
                    {...props}
                />
            </div>
        </LocalizationProvider>
    );
};

export default DatePicker;