import React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CheckboxProps extends Omit<MuiCheckboxProps, 'onChange'> {
    label?: string;
    onChange?: (checked: boolean) => void;
    className?: string;
    labelClassName?: string;
}

const StyledCheckbox = styled(MuiCheckbox)({
    '&.Mui-checked': {
        color: '#1ABC9C',
    },
    '&.Mui-disabled': {
        color: '#E8F8F5',
    },
});

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    onChange,
    className = '',
    labelClassName = '',
    ...props
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event.target.checked);
        }
    };

    const checkbox = (
        <StyledCheckbox
            {...props}
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
            />
        );
    }

    return checkbox;
};

export default Checkbox;