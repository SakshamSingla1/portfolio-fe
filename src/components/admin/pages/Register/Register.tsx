import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import TextFieldV2 from '../../../atoms/TextField/TextField';
import Button from '../../../atoms/Button/Button';
import { useAuthService } from '../../../../services/useAuthService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

const useStyles = createUseStyles((theme: any) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(-45deg, #D1F2EB, #E8F8F5, #A2D9CE, #1ABC9C)',
        backgroundSize: '400% 400%',
        animation: '$gradientBG 15s ease infinite',
    },
    '@keyframes gradientBG': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
    card: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '28rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transform: 'translateZ(0)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
        }
    },
    logoContainer: {
        width: '5rem',
        height: '5rem',
        margin: '0 auto 1.5rem',
        background: 'linear-gradient(135deg, #1ABC9C, #16A085)',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(26, 188, 156, 0.3)',
    },
    logo: {
        color: 'white',
        fontSize: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#2C3E50',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '0.95rem',
    },
    inputField: {
        marginBottom: '1.25rem',
        '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1ABC9C',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1ABC9C',
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(26, 188, 156, 0.2)',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#7F8C8D',
            '&.Mui-focused': {
                color: '#1ABC9C',
            },
        },
    },
    link: {
        color: '#1ABC9C',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#16A085',
            textDecoration: 'underline',
        },
    },
    signInText: {
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#7F8C8D',
        fontSize: '0.9rem',
    },
    blob: {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(40px)',
        opacity: 0.4,
        zIndex: -1,
    },
    blob1: {
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, #1ABC9C, #3498db)',
        top: '-100px',
        right: '-100px',
        animation: '$float 15s ease-in-out infinite',
    },
    blob2: {
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #3498db, #9b59b6)',
        bottom: '-150px',
        left: '-150px',
        animation: '$float 20s ease-in-out infinite reverse',
    },
    '@keyframes float': {
        '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
        '25%': { transform: 'translate(20px, 20px) scale(1.05)' },
        '50%': { transform: 'translate(0, 20px) scale(1.1)' },
        '75%': { transform: 'translate(-20px, 0) scale(1.05)' },
    },
    errorMessage: {
        backgroundColor: '#FEF2F2',
        borderLeft: '4px solid #EF4444',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        '& p': {
            color: '#B91C1C',
            fontSize: '0.875rem',
            margin: 0,
        }
    }
}));

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authService = useAuthService();
    const { user } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(() => {
        // Redirect if already logged in
        if (user?.token) {
            navigate(ADMIN_ROUTES.PROFILE, { replace: true });
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError('');
                const response = await authService.signUp(values);
                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar('success', 'Account created successfully! Redirecting...');
                    setTimeout(() => {
                        navigate(ADMIN_ROUTES.LOGIN);
                    }, 1500);
                } else {
                    setError(response?.message || 'Registration failed. Please try again.');
                    showSnackbar('error', response?.message || 'Registration failed');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'An error occurred during registration.';
                setError(errorMessage);
                showSnackbar('error', errorMessage);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className={classes.container}>
            {/* Animated background blobs */}
            <div className={`${classes.blob} ${classes.blob1}`}></div>
            <div className={`${classes.blob} ${classes.blob2}`}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className={classes.card}
            >

                {/* Title */}
                <h1 className={classes.title}>Create Account</h1>
                <p className={classes.subtitle}>Join us today</p>

                {/* Error Message */}
                {error && (
                    <div className={classes.errorMessage}>
                        <p>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    {/* Full Name Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            variant="outlined"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                            autoComplete="name"
                        />
                    </div>

                    {/* Email Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primaryContained"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    {/* Sign In Link */}
                    <p className={classes.signInText}>
                        Already have an account?{' '}
                        <Link to={ADMIN_ROUTES.LOGIN} className={classes.link}>
                            Sign in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;