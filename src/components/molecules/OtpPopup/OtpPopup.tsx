import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { createUseStyles } from 'react-jss';
import { motion } from 'framer-motion';
import Button from '../../atoms/Button/Button';

const useStyles = createUseStyles((theme: any) => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '400px',
      width: '100%',
    },
  },
  title: {
    textAlign: 'center',
    color: theme.palette.background.neutral.neutral900,
    marginBottom: '16px',
    fontWeight: 600,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.palette.background.neutral.neutral500,
    marginBottom: '24px',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  otpInput: {
    width: '48px',
    height: '56px',
    textAlign: 'center',
    fontSize: '24px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.background.neutral.neutral200}`,
    '&:focus': {
      outline: 'none',
      borderColor: theme.palette.background.primary.primary600,
      boxShadow: `0 0 0 2px ${theme.palette.background.primary.primary600}`,
    },
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  resendText: {
    textAlign: 'center',
    marginTop: '16px',
    color: theme.palette.background.neutral.neutral500,
    '&.active': {
      color: theme.palette.background.primary.primary600,
      fontWeight: 500,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  errorText: {
    color: theme.palette.background.secondary.secondary500,
    textAlign: 'center',
    minHeight: '24px',
    marginTop: '8px',
  },
}));

interface OtpPopupProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  email?: string;
  phoneNumber?: string;
  resendOtp?: () => void;
}

const OtpPopup: React.FC<OtpPopupProps> = ({
  open,
  onClose,
  onVerify,
  email,
  phoneNumber,
  resendOtp,
}) => {
  const classes = useStyles();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [canResend, setCanResend] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    if (!open) {
      // Reset state when dialog is closed
      setOtp(['', '', '', '', '', '']);
      setError('');
      setCanResend(false);
      setCountdown(30);
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      // Move to next input
      if (value !== '' && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.split('').slice(0, 6);
      const newOtp = [...otp];
      
      digits.forEach((digit, i) => {
        if (i < 6) {
          newOtp[i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus on the last input with a value or the last input if all are filled
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs[lastFilledIndex].current?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCanResend(false);
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      if (resendOtp) {
        resendOtp();
      }
      inputRefs[0].current?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    } else {
      setError('Please enter a valid 6-digit OTP');
    }
  };

  const contactInfo = email || phoneNumber || 'your registered contact';
  const contactType = email ? 'email' : 'phone number';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      aria-labelledby="otp-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="otp-dialog-title" className={classes.title}>
        Verify Your {contactType}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" className={classes.subtitle}>
          We've sent a 6-digit verification code to {contactInfo}
        </Typography>
        
        <div className={classes.otpContainer}>
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={classes.otpInput}
              autoFocus={index === 0}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
        
        <Typography variant="body2" className={classes.errorText}>
          {error}
        </Typography>
        
        <Typography 
          variant="body2" 
          className={`${classes.resendText} ${canResend ? 'active' : ''}`}
          onClick={canResend ? handleResend : undefined}
        >
          {canResend 
            ? "Didn't receive the code? Resend" 
            : `Resend code in ${countdown}s`
          }
        </Typography>
      </DialogContent>
      
      <DialogActions className={classes.actionButtons}>
        <Button 
          variant="secondaryContained" 
          label="Cancel"
          color="primary" 
          onClick={onClose}
        />
        <Button 
          variant="primaryContained" 
          label="Verify"
          color="primary" 
          onClick={handleVerify}
          disabled={otp.join('').length !== 6}
        />
      </DialogActions>
    </Dialog>
  );
};

export default OtpPopup;
