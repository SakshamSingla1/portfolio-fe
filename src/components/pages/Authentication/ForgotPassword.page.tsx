import { Link } from 'react-router-dom';
import { useAuthService } from '../../../services/useAuthService';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Mail } from 'lucide-react';
import { InputAdornment } from '@mui/material';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
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
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    margin: '20px',
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
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: theme.palette.background.neutral.neutral600,
    marginTop: '8px',
  },
}));

const ForgotPassword: React.FC = () => {
  const authService = useAuthService();
  const { showSnackbar } = useSnackbar();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.forgotPassword(values);
        if (response.status === HTTP_STATUS.OK) {
          showSnackbar('success', 'Reset password link sent successfully to your email');
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
        <h2 className={classes.title}>Forgot Password</h2>
        <p className={classes.subtitle}>Enter your email to receive a password reset link</p>

        <TextFieldV2
          name="email"
          label="Email Address"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={18} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="primaryContained"
          disabled={formik.isSubmitting || !formik.isValid}
          onClick={() => formik.handleSubmit()}
          label={'Send Reset Link'}
          isLoading={formik.isSubmitting}
        />

        <div className={classes.footerText}>
          Back to
          <Link to={ADMIN_ROUTES.LOGIN} className={classes.link}> Login</Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
