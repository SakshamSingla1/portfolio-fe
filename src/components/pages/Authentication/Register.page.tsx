import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthService, type AuthRegisterDTO, type AuthVerifyOtpDTO } from '../../../services/useAuthService';
import { ADMIN_ROUTES, REGEX } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { IconButton, InputAdornment } from '@mui/material';
import OtpPopup from '../../molecules/OtpPopup/OtpPopup';
import { PasswordStrengthMeter } from '../../atoms/PasswordStrengthMeter/PasswordStrengthMeter';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().matches(REGEX.EMAIL, 'Please enter a valid email').required('Email is required'),
  password: Yup.string().matches(REGEX.PASSWORD, 'Please enter a valid password').required('Password is required'),
  phone: Yup.string().matches(REGEX.PHONE_NUMBER, 'Please enter a valid phone number').required('Phone number is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const useStyles = createUseStyles((theme: any) => ({
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.palette.background.primary.primary100}, ${theme.palette.background.primary.primary300})`,
    padding: '20px',
    boxSizing: 'border-box',
  },
  loginForm: {
    backdropFilter: 'blur(12px)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px) scale(1.01)',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
    },
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.background.neutral.neutral900,
    textAlign: 'center',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '1rem',
    color: theme.palette.background.neutral.neutral500,
    textAlign: 'center',
    marginBottom: '20px',
  },
  link: {
    color: theme.palette.background.primary.primary600,
    textDecoration: 'none',
    fontWeight: 'bold',
    '&:hover': { textDecoration: 'underline' },
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: theme.palette.background.neutral.neutral600,
  },
}));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const authService = useAuthService();
  const { user } = useAuthenticatedUser();
  const { showSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate(ADMIN_ROUTES.PROFILE);
    }
  }, [user, navigate]);

  const registerFormik = useFormik<AuthRegisterDTO>({
    initialValues: { userName: '', fullName: '', email: '', password: '', phone: '', confirmPassword: '', role: 'ADMIN' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.register(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar('success', 'Registration successful. Please check your phone for OTP');
          setShowOtpInput(true);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred.';
        showSnackbar('error', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const otpFormik = useFormik<AuthVerifyOtpDTO>({
    initialValues: { otp: '' ,
        phone: registerFormik.values.phone,
    },
    validationSchema: Yup.object().shape({
      otp: Yup.string().required('OTP is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.verifyOtp(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar('success', 'OTP verified successfully');
          setShowOtpInput(false);
          navigate(ADMIN_ROUTES.LOGIN);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred.';
        showSnackbar('error', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const resendOtp = async () => {
    try {
      const response = await authService.sendOtp({phone: registerFormik.values.phone});
      if (response.status === HTTP_STATUS.OK) {
        showSnackbar('success', 'OTP resent successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred.';
      showSnackbar('error', errorMessage);
    }
  };

  return (
    <motion.div className={classes.loginContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        className={classes.loginForm}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className={classes.title}>Create Your Account</h2>
        <p className={classes.subtitle}>Join CareHive and get started in minutes 🚀</p>

        {/* Full Name */}
        <TextFieldV2
          name="fullName"
          label="Full Name"
          value={registerFormik.values.fullName}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={registerFormik.touched.fullName && Boolean(registerFormik.errors.fullName)}
          helperText={registerFormik.touched.fullName && registerFormik.errors.fullName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User size={18} />
              </InputAdornment>
            ),
          }}
        />

        {/* Email */}
        <TextFieldV2
          name="email"
          label="Email Address"
          type="email"
          value={registerFormik.values.email}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={registerFormik.touched.email && Boolean(registerFormik.errors.email)}
          helperText={registerFormik.touched.email && registerFormik.errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={18} />
              </InputAdornment>
            ),
          }}
        />

        {/* Phone */}
        <TextFieldV2
          name="phone"
          label="Phone Number"
          value={registerFormik.values.phone}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={registerFormik.touched.phone && Boolean(registerFormik.errors.phone)}
          helperText={registerFormik.touched.phone && registerFormik.errors.phone}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone size={18} />
              </InputAdornment>
            ),
          }}
        />

        {/* Password */}
        <TextFieldV2
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={registerFormik.values.password}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={registerFormik.touched.password && Boolean(registerFormik.errors.password)}
          helperText={registerFormik.touched.password && registerFormik.errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={18} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextFieldV2
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={registerFormik.values.confirmPassword}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={registerFormik.touched.confirmPassword && Boolean(registerFormik.errors.confirmPassword)}
          helperText={registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={18} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <PasswordStrengthMeter
          password={registerFormik.values.password}
        />

        {/* Submit Button */}
        <Button
          variant="primaryContained"
          disabled={registerFormik.isSubmitting || !registerFormik.isValid || !registerFormik.dirty}
          onClick={() => registerFormik.handleSubmit()}
          label="Sign Up"
          isLoading={registerFormik.isSubmitting}
        />

        {/* Footer */}
        <div className={classes.footerText}>
          Already have an account?{' '}
          <Link to={ADMIN_ROUTES.LOGIN} className={classes.link}>
            Sign In
          </Link>
        </div>
      </motion.div>

      {showOtpInput && (
        <OtpPopup
          open={showOtpInput}
          onClose={() => setShowOtpInput(false)}
          onVerify={
            (otp) => {
            otpFormik.setFieldValue('phone', registerFormik.values.phone);
            otpFormik.setFieldValue('otp', otp);
            otpFormik.handleSubmit();
            }
          }
          resendOtp={resendOtp}
          phoneNumber={registerFormik.values.phone}
        />
      )}
    </motion.div>
  );
};

export default Register;
