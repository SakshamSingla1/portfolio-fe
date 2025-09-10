import React, { useState, useEffect } from "react";
import { useAuthService } from "../../../services/useAuthService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/constant";

interface OtpFloatingPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => Promise<void>;
  title?: string;
  description?: string;
  loading?: boolean;
}

const OtpFloatingPopup: React.FC<OtpFloatingPopupProps> = ({
  open,
  onClose,
  onSubmit,
  title = "Enter OTP",
  description = "Please enter the OTP sent to your registered email or phone.",
  loading = false,
}) => {
  const authService = useAuthService();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());
  const { showSnackbar } = useSnackbar();

  // Color constants
  const colors = {
    primary100: '#D1F2EB',
    primary300: '#76D7C4',
    primary500: '#1ABC9C',
    primary600: '#17A589',
    primary700: '#148F77',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray900: '#111827',
  };

  // Reset timer and OTP when popup is opened
  useEffect(() => {
    if (open) {
      setOtp(Array(6).fill(''));
      setTimeLeft(300); // Reset to 5 minutes
    }
  }, [open]);

  // Countdown timer effect
  useEffect(() => {
    if (!open || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (!otpString.trim()) return;
    await onSubmit(otpString);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character if multiple digits are pasted
    setOtp(newOtp);

    // Move to next input or submit if last input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    } else if (index === 5 && value) {
      const otpString = newOtp.join('');
      if (otpString.length === 6) {
        onSubmit(otpString);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move left with arrow key
      inputRefs[index - 1].current?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move right with arrow key
      inputRefs[index + 1].current?.focus();
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      // Prevent spacebar
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '');
    if (paste) {
      const newOtp = [...otp];
      let i = 0;
      for (; i < 6 && i < paste.length; i++) {
        newOtp[i] = paste[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one if all filled
      const nextIndex = Math.min(i, 5);
      inputRefs[nextIndex]?.current?.focus();
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return; // Prevent resend before timer expires
    
    try {
      // Reset timer to 5 minutes
      setTimeLeft(300);
      await authService.resendOtp();
      showSnackbar('success', 'OTP sent to your email.');
    } catch (error) {
      showSnackbar('error', 'Failed to resend OTP. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '24rem',
        padding: '1.5rem',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: colors.gray500,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            lineHeight: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = colors.gray700)}
          onMouseOut={(e) => (e.currentTarget.style.color = colors.gray500)}
          aria-label="Close"
        >
          &times;
        </button>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            backgroundColor: colors.primary100,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
          }}>
            <svg 
              style={{
                width: '1.5rem',
                height: '1.5rem',
                color: colors.primary600
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
              />
            </svg>
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            lineHeight: '2rem',
            fontWeight: 700,
            color: colors.gray900,
            marginBottom: '0.25rem'
          }}>{title}</h2>
          <p style={{
            color: colors.gray600,
            fontSize: '0.875rem',
            lineHeight: '1.25rem'
          }}>{description}</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%'
            }}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                value={otp[index] || ''}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                style={{
                  width: '3rem',
                  height: '3.5rem',
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  ...(loading && {
                    backgroundColor: colors.gray100,
                    cursor: 'not-allowed'
                  })
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary500;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary500}40`;
                  // Select the text when focused
                  e.target.select();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray300;
                  e.target.style.boxShadow = 'none';
                }}
                maxLength={1}
                inputMode="numeric"
                pattern="\d*"
                disabled={loading}
              />
            ))}
            </div>
            
            <div style={{ 
              color: timeLeft < 60 ? '#EF4444' : colors.gray600,
              fontSize: '0.875rem',
              fontWeight: 500,
              textAlign: 'center',
              marginTop: '0.5rem'
            }}>
              {timeLeft > 0 ? (
                `Time remaining: ${formatTime(timeLeft)}`
              ) : (
                <button
                  onClick={handleResendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.primary600,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            {loading && (
              <div style={{
                position: 'absolute',
                bottom: '-1.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                border: `2px solid ${colors.primary600}`,
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
          </div>
          
          
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                color: colors.gray700,
                backgroundColor: colors.gray100,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(loading && {
                  opacity: 0.7,
                  cursor: 'not-allowed'
                })
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.gray200)}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.gray100)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'white',
                backgroundColor: loading ? colors.primary300 : colors.primary600,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                ...(!loading && {
                  ':hover': {
                    backgroundColor: colors.primary700
                  },
                  ':focus': {
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${colors.primary500}80`,
                    backgroundColor: colors.primary600
                  }
                })
              }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    </div>
  );
};

export default OtpFloatingPopup;