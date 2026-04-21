import * as React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { useColors } from '../../../utils/types';

interface BpIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
}

const BpIcon = styled('span')<BpIconProps>(
  ({ theme, width = 24, height = 24 }) => ({
    borderRadius: 4,
    width: width,
    height: height,
    backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#fff',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(170, 167, 167, 1)',
    '.Mui-focusVisible &': {
      outline: '1px auto rgba(170, 167, 167, 1)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(144, 145, 145,.5)',
    },
  })
);

const BpCheckedIcon = styled(BpIcon)(({ width = 24, height = 25 }) => ({
  width: width,
  height: height,
  backgroundImage: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(` 
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.33398 16.8151L11.8981 23.3337L26.6673 8.66699" stroke="#1D3679" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)}")`,
  backgroundRepeat: 'no-repeat',
  border: '1px solid rgba(170, 167, 167, 1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(144, 145, 145,.5)',
  },
}));

interface AdvancedCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  id?: string;
  required?: boolean;
  error?: boolean;
  name?: string;
  disableRipple?: boolean;
}

const AdvancedCheckbox: React.FC<AdvancedCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  label,
  size = 'medium',
  variant = 'primary',
  className = '',
  id,
  required = false,
  error = false,
  name,
  disableRipple = false,
}) => {
  const colors = useColors();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16 };
      case 'medium':
        return { width: 20, height: 20 };
      case 'large':
        return { width: 24, height: 24 };
      default:
        return { width: 20, height: 20 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          borderColor: error ? colors.error500 : colors.primary500,
          checkedColor: colors.primary500,
        };
      case 'secondary':
        return {
          borderColor: error ? colors.error500 : colors.neutral700,
          checkedColor: colors.neutral700,
        };
      case 'success':
        return {
          borderColor: error ? colors.error500 : colors.success500,
          checkedColor: colors.success500,
        };
      case 'warning':
        return {
          borderColor: error ? colors.error500 : colors.warning500,
          checkedColor: colors.warning500,
        };
      case 'error':
        return {
          borderColor: colors.error500,
          checkedColor: colors.error500,
        };
      default:
        return {
          borderColor: colors.primary500,
          checkedColor: colors.primary500,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Checkbox
        sx={{
          '&:hover': { bgcolor: 'transparent' },
          margin: '0px',
          padding: '0px',
          '& .MuiSvgIcon-root': {
            fontSize: sizeStyles.width,
          },
          '&.Mui-checked': {
            color: variantStyles.checkedColor,
          },
          '&.MuiCheckbox-indeterminate': {
            color: variantStyles.checkedColor,
          },
        }}
        name={name}
        id={id}
        disabled={disabled}
        disableRipple={disableRipple}
        color="default"
        checked={checked}
        indeterminate={indeterminate}
        onChange={handleChange}
        inputProps={{ 
          'aria-label': label || `Checkbox-${name}`,
          'aria-required': required,
          'aria-invalid': error,
        }}
        icon={<BpIcon width={sizeStyles.width} height={sizeStyles.height} />}
        checkedIcon={<BpCheckedIcon width={sizeStyles.width} height={sizeStyles.height} />}
        indeterminateIcon={
          <BpIcon
            width={sizeStyles.width}
            height={sizeStyles.height}
            sx={{
              '&:after': {
                content: '""',
                position: 'absolute',
                display: 'block',
                width: '60%',
                height: '2px',
                backgroundColor: variantStyles.checkedColor,
                left: '20%',
                top: '50%',
                transform: 'translateY(-50%)',
              },
            }}
          />
        }
      />
      
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium cursor-pointer select-none transition-colors ${
            disabled ? 'text-gray-400' : 'text-gray-700 hover:text-gray-900'
          } ${error ? 'text-red-600' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default React.memo(AdvancedCheckbox);
