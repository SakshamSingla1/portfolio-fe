import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';
import Button from '../../atoms/Button/Button';
import Modal from '../../atoms/Modal/Modal';
import { useColors } from '../../../utils/types';

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
  const colors = useColors();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [canResend, setCanResend] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>(
    Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
  );

  useEffect(() => {
    if (!open) {
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

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].current?.focus();
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
      inputRefs.current[lastFilledIndex].current?.focus();
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
      inputRefs.current[0].current?.focus();
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
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
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
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="flex items-center justify-center rounded-2xl mb-4"
          style={{
            width: 48,
            height: 48,
            background: `${colors.primary600}12`,
            color: colors.primary600,
          }}
        >
          <FiShield size={22} />
        </div>

        <h3 className="text-lg font-bold mb-4" style={{ color: colors.neutral900 }}>
          Verify Your {contactType}
        </h3>

        <p className="text-sm mb-6" style={{ color: colors.neutral500 }}>
          We've sent a 6-digit verification code to {contactInfo}
        </p>

        <div className="flex justify-center gap-3 my-6">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={inputRefs.current[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="text-center font-bold outline-none"
              style={{
                width: 48,
                height: 56,
                fontSize: 24,
                borderRadius: 12,
                border: `1.5px solid ${colors.neutral200}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              autoFocus={index === 0}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        <p className="text-sm min-h-[24px] mt-2" style={{ color: colors.secondary500 }}>
          {error}
        </p>

        <p
          className={`text-sm mt-4 ${canResend ? 'font-medium cursor-pointer hover:underline' : ''}`}
          style={{ color: canResend ? colors.primary600 : colors.neutral500 }}
          onClick={canResend ? handleResend : undefined}
        >
          {canResend
            ? "Didn't receive the code? Resend"
            : `Resend code in ${countdown}s`
          }
        </p>
      </div>
    </Modal>
  );
};

export default OtpPopup;
