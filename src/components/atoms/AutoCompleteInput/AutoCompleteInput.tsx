import React, { useMemo } from 'react';
import Autocomplete, { type AutocompleteChangeReason } from '@mui/material/Autocomplete';
import { ClearIcon } from '@mui/x-date-pickers';
import { createUseStyles } from 'react-jss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import { useDebounce } from '../../../utils/helper';
import { DEBOUNCE_TIME } from '../../../utils/constant';
import TextField from '../TextField/TextField';
import { useColors } from '../../../utils/types';

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
}

const useStyles = (colors: any) => createUseStyles({
  container: {
    width: '100%',
    '&.disabled': {
      opacity: 0.7,
    }
  },
  label: {
    color: colors.neutral700,
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    marginLeft: "8px",
  },
  autoComplete: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: colors.white,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary300,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary500,
        boxShadow: `0 0 0 3px ${colors.primary100}`,
      },
      '&.Mui-disabled': {
        backgroundColor: colors.neutral100,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.neutral200,
      borderWidth: '1px',
    },
    '& .MuiInputBase-input': {
      padding: '12px 16px',
      fontSize: '14px',
      lineHeight: '20px',
      color: colors.neutral900,
      '&::placeholder': {
        color: colors.neutral400,
        opacity: 1,
      },
    },
  },
  option: {
    padding: '8px 16px',
    fontSize: '14px',
    lineHeight: '20px',
    color: colors.neutral900,
    '&:hover': {
      backgroundColor: colors.primary50,
    },
    '&.Mui-focused': {
      backgroundColor: colors.primary50,
    }
  },
  error: {
    borderColor: colors.error500,
    '&:hover': {
      borderColor: colors.error500,
    }
  },
  helperText: {
    marginTop: '4px',
    fontSize: '12px',
    lineHeight: '16px',
    color: colors.neutral500,
  },
  errorText: {
    color: colors.error500,
  }
});

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  label,
  options,
  onSearch,
  onChange,
  isDisabled = false,
  value = null,
  error = false,
  helperText = '',
  placeHolder = '',
  id,
  onBlur,
  className = '',
  loading = false,
}) => {
  const colors = useColors();
  const classes = useStyles(colors)();

  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: AutoCompleteOption | null, 
    reason: AutocompleteChangeReason, 
  ) => {
    if (reason === 'selectOption' || reason === 'removeOption' || reason === 'clear') {
      onChange(value);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSearch(e.target.value);
  };

  const handleClearValue = () => {
    onSearch("");
  };

  const debouncedSearch = useMemo(
    () => useDebounce((value: string) => {
      onSearch(value);
    }, DEBOUNCE_TIME.DEFAULT),
    [onSearch]
  );

  const defaultProps = useMemo(() => ({
    options,
    getOptionLabel: (option: AutoCompleteOption) => {
      return typeof option.title === 'string' && option.title.trim() !== '' 
        ? option.title 
        : String(option.label ?? '');
    },
    isOptionEqualToValue: (option: AutoCompleteOption, value: AutoCompleteOption) =>
      option.value === value.value,
  }), [options]);

  return (
    <div className={`${classes.container} ${isDisabled ? 'disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}
      <Autocomplete
        id={id ?? label}
        {...defaultProps}
        fullWidth
        disabled={isDisabled}
        loading={loading}
        loadingText="Loading..."
        clearOnBlur={false}
        clearOnEscape
        disableClearable={!value}
        className={`${classes.autoComplete} ${error ? classes.error : ''}`}
        popupIcon={
          <ExpandMoreIcon 
            style={{ 
              color: isDisabled ? colors.neutral400 : colors.neutral600 
            }} 
          />
        }
        clearIcon={
          value ? (
            <ClearIcon 
              onClick={handleClearValue} 
              style={{ 
                color: isDisabled ? colors.neutral400 : colors.neutral600,
                fontSize: '18px',
              }} 
            />
          ) : null
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeHolder}
            label=""
            onChange={handleSearch}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <div style={{ padding: '0 8px' }}>Loading...</div>
                  ) : (
                    params.InputProps.endAdornment
                  )}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li 
            {...props} 
            className={classes.option}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {option.icon && (
              <span style={{ display: 'flex', marginRight: '8px' }}>
                {option.icon}
              </span>
            )}
            {option.label}
          </li>
        )}
        onChange={handleInputChange}
        onInputChange={(_event, value, reason) => {
          if (reason === 'input') {
            debouncedSearch(value);
          }
        }}
        value={value}
        onBlur={onBlur}
      />
      {helperText && !error && (
        <div className={classes.helperText}>{helperText}</div>
      )}
      {error && helperText && <ErrorMessage message={helperText} />}
    </div>
  );
};

export default React.memo(AutoCompleteInput);