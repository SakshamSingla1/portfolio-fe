import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthService, type ILoginRequest } from '../../../services/useAuthService';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { IconButton, InputAdornment } from '@mui/material';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
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
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
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
  },
}));

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authService = useAuthService();
  const { user, setAuthenticatedUser } = useAuthenticatedUser();
  const { showSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      navigate(ADMIN_ROUTES.PROFILE);
    }
    emailRef.current?.focus();
  }, [user, navigate]);

  const formik = useFormik<ILoginRequest>({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.login(values);
        if (response.status === HTTP_STATUS.OK) {
          setAuthenticatedUser(response.data.data);
          showSnackbar('success', 'Login successful');
          navigate(ADMIN_ROUTES.PROFILE);
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
      <motion.form
        className={classes.loginForm}
        onSubmit={formik.handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className={classes.title}>Welcome Back</h2>
        <p className={classes.subtitle}>Sign in to continue to your dashboard</p>

        <TextFieldV2
          inputRef={emailRef}
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

        <TextFieldV2
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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

        <div className={`flex justify-end ${classes.link}`}>
          <Link to={ADMIN_ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
        </div>

        <Button
          variant="primaryContained"
          disabled={formik.isSubmitting || !formik.isValid}
          onClick={() => formik.handleSubmit()}
          label={'Login'}
          isLoading={formik.isSubmitting}
        />

        <div className={classes.footerText}>
          Don’t have an account?
          <Link to={ADMIN_ROUTES.REGISTER} className={classes.link}> Sign Up</Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Login;
