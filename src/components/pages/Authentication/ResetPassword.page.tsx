import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthService, type IResetPasswordRequest } from '../../../services/useAuthService';
import { ADMIN_ROUTES, REGEX } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { IconButton, InputAdornment } from '@mui/material';
import { PasswordStrengthMeter } from '../../atoms/PasswordStrengthMeter/PasswordStrengthMeter';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string().matches(REGEX.PASSWORD, 'Please enter a valid password').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required('Confirm password is required'),
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

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const authService = useAuthService();
  const { showSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      showSnackbar('error', 'Invalid or missing reset token');
      navigate(ADMIN_ROUTES.FORGOT_PASSWORD);
    }
  }, []);

  const resetFormik = useFormik<IResetPasswordRequest>({
    initialValues: { token: '', newPassword: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values, token };
        const response = await authService.resetPassword(payload);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar('success', 'Password reset successful. You can now login with your new password.');
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

  return (
    <motion.div className={classes.loginContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div
        className={classes.loginForm}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className={classes.title}>Reset Your Password</h2>
        <p className={classes.subtitle}>Enter your new password below</p>

        {/* Password */}
        <TextFieldV2
          name="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={resetFormik.values.newPassword}
          onChange={resetFormik.handleChange}
          onBlur={resetFormik.handleBlur}
          error={resetFormik.touched.newPassword && Boolean(resetFormik.errors.newPassword)}
          helperText={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
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
          value={resetFormik.values.confirmPassword}
          onChange={resetFormik.handleChange}
          onBlur={resetFormik.handleBlur}
          error={resetFormik.touched.confirmPassword && Boolean(resetFormik.errors.confirmPassword)}
          helperText={resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword}
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
          password={resetFormik.values.newPassword}
        />

        {/* Submit Button */}
        <Button
          variant="primaryContained"
          disabled={resetFormik.isSubmitting || !resetFormik.isValid || !resetFormik.dirty}
          onClick={() => resetFormik.handleSubmit()}
          label="Reset Password"
          isLoading={resetFormik.isSubmitting}
        />

        {/* Footer */}
        <div className={classes.footerText}>
          Remember your password?{' '}
          <Link to={ADMIN_ROUTES.LOGIN} className={classes.link}>
            Login here
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
