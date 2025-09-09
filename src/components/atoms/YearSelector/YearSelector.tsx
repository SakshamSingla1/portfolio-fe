// src/components/atoms/YearSelector/YearSelector.tsx
import React, { forwardRef, useMemo } from 'react';
import {
    TextField,
    TextFieldProps,
    MenuItem,
    InputAdornment,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useFormikContext } from 'formik';

interface YearSelectorProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'select'> {
    name: string;
    minYear?: number;
    maxYear?: number;
    showButtons?: boolean;
    fullWidth?: boolean;
}

const YearSelector = forwardRef<HTMLDivElement, YearSelectorProps>(
    (
        {
            name,
            minYear = 1900,
            maxYear = new Date().getFullYear() + 5,
            showButtons = true,
            fullWidth = true,
            variant = 'outlined',
            size = 'small',
            ...props
        },
        ref
    ) => {
        const theme = useTheme();
        const { values, setFieldValue, touched, errors } = useFormikContext<any>();
        const currentValue = values[name] || '';
        const error = touched[name] && errors[name];

        const years = useMemo(() => {
            const yearsArray = [];
            for (let year = maxYear; year >= minYear; year--) {
                yearsArray.push(year);
            }
            return yearsArray;
        }, [minYear, maxYear]);

        const handleIncrement = () => {
            if (!currentValue) {
                setFieldValue(name, maxYear);
            } else {
                const newYear = Math.min(Number(currentValue) + 1, maxYear);
                setFieldValue(name, newYear.toString());
            }
        };

        const handleDecrement = () => {
            if (!currentValue) {
                setFieldValue(name, minYear);
            } else {
                const newYear = Math.max(Number(currentValue) - 1, minYear);
                setFieldValue(name, newYear.toString());
            }
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (value === '' || /^[0-9\b]+$/.test(value)) {
                setFieldValue(name, value);
            }
        };

        const handleBlur = () => {
            if (currentValue) {
                const year = parseInt(currentValue, 10);
                if (year < minYear) {
                    setFieldValue(name, minYear);
                } else if (year > maxYear) {
                    setFieldValue(name, maxYear);
                }
            }
        };

        return (
            <TextField
                select
                name={name}
                value={currentValue}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                error={!!error}
                helperText={error as string}
                InputProps={{
                    endAdornment: showButtons ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleIncrement}
                                disabled={Number(currentValue) >= maxYear}
                                edge="end"
                                sx={{ mr: -1 }}
                            >
                                <KeyboardArrowUpIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleDecrement}
                                disabled={Number(currentValue) <= minYear}
                                edge="end"
                            >
                                <KeyboardArrowDownIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                }}
                SelectProps={{
                    native: false,
                    renderValue: (value: unknown) => value ? String(value) : 'Select year',
                    MenuProps: {
                        PaperProps: {
                            style: {
                                maxHeight: 300,
                            },
                        },
                    },
                }}
                ref={ref}
                {...props}
            >
                <MenuItem value="">
                    <em>Select year</em>
                </MenuItem>
                {years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                        {year}
                    </MenuItem>
                ))}
            </TextField>
        );
    }
);

YearSelector.displayName = 'YearSelector';

export default YearSelector;