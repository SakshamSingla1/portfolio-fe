import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuthService } from '../../../../services/useAuthService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import TextFieldV2 from '../../../atoms/TextField/TextField';
import Button from '../../../atoms/Button/Button';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
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
    forgotPassword: {
        display: 'block',
        textAlign: 'right',
        marginTop: '-0.5rem',
        marginBottom: '1.5rem',
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
    signUpText: {
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
}));

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authService = useAuthService();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const { showSnackbar } = useSnackbar();

    // If user is already logged in, redirect to admin dashboard or the intended URL
    const from = location.state?.from?.pathname || '/admin';
    
    if (user?.token) {
        return <Navigate to={from} replace />;
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                
                const response = await authService.login({
                    email: values.email,
                    password: values.password,
                });
                
                if (response?.status === HTTP_STATUS.OK && response?.data?.data) {
                    const { token, ...userData } = response.data.data;
                    
                    // Save user data to context and local storage
                    setAuthenticatedUser({
                        id: userData.id.toString(),
                        email: userData.email,
                        fullName: userData.fullName,
                        token: token,
                        role: userData.role,
                        phone: userData.phone,
                        password: null,
                        title: userData.title,
                        aboutMe: userData.aboutMe,
                        location: userData.location,
                        githubUrl: userData.githubUrl,
                        linkedinUrl: userData.linkedinUrl,
                        websiteUrl: userData.websiteUrl
                    });
                    
                    // Save email to localStorage if "Remember me" is checked
                    if (values.rememberMe) {
                        localStorage.setItem('rememberedEmail', values.email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }
                    
                    // Navigate to the intended URL or default admin dashboard
                    navigate(ADMIN_ROUTES.PROFILE);
                    showSnackbar('success', 'Login successful! Redirecting to dashboard...');
                } else {
                    showSnackbar('error', response?.data?.message || 'Login failed. Please check your credentials.');
                }
            } catch (err: any) {
                console.error('Login error:', err);
                showSnackbar('error', err.response?.data?.message || 'An error occurred during login. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    // Load remembered email on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            formik.setFieldValue('email', rememberedEmail);
            formik.setFieldValue('rememberMe', true);
        }
    }, []);

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
                <h1 className={classes.title}>Welcome Back</h1>
                <p className={classes.subtitle}>Sign in to access your admin dashboard</p>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
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
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <Link to={ADMIN_ROUTES.FORGOT_PASSWORD} className={classes.link} style={{ fontSize: '0.9rem' }}>
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primaryContained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    {/* Sign Up Link */}
                    <p className={classes.signUpText}>
                        Don't have an account?{' '}
                        <Link to={ADMIN_ROUTES.REGISTER} className={classes.link}>
                            Sign up
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;