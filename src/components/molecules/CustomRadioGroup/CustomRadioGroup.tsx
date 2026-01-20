import React from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { createUseStyles } from 'react-jss';
import { useColors } from '../../../utils/types';

interface CustomRadioGroupProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

const useStyles = createUseStyles({
  label: (colors: any) => ({
    color: colors.neutral700,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '16px',
    marginLeft: '8px',
    marginBottom: '8px',
    display: 'block',
  }),
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
  },
  radioLabel: (colors: any) => ({
    margin: 0,
    '& .MuiTypography-root': {
      fontSize: '14px',
      color: colors.neutral700,
    },
  }),
  error: (colors: any) => ({
    color: colors.secondary400,
    fontSize: '12px',
    marginLeft: '12px',
    marginTop: '4px',
  }),
});

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  label,
  required = false,
  options,
}) => {
  const colors = useColors();

  const classes = useStyles(colors);

  return (
    <div>
      {label && (
        <label className={classes.label}>
          {label}
          {required && <span style={{ color: '#f44336', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <RadioGroup
        row
        aria-label={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={classes.radioGroup}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                size="small"
                disabled={disabled}
                sx={{
                  color: colors.neutral400,
                  '&.Mui-checked': {
                    color: colors.primary300,
                  },
                  '&.Mui-disabled': {
                    color: colors.neutral200,
                  },
                }}
              />
            }
            label={option.label}
            className={classes.radioLabel}
          />
        ))}
      </RadioGroup>
      {error && helperText && <div className={classes.error}>{helperText}</div>}
    </div>
  );
};

export default CustomRadioGroup;