import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TextFieldV2 from '../../../atoms/TextField/TextField';
import Button from '../../../atoms/Button/Button';
import { useAuthService } from '../../../../services/useAuthService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm Password is required'),
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
    backLink: {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        color: '#7F8C8D',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#1ABC9C',
        },
        '& svg': {
            marginRight: '0.5rem',
        }
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
    },
    successMessage: {
        backgroundColor: '#F0FDF4',
        borderLeft: '4px solid #10B981',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        '& p': {
            color: '#065F46',
            fontSize: '0.875rem',
            margin: 0,
        }
    }
}));

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const classes = useStyles();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const authService = useAuthService();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            showSnackbar('error', 'Invalid or expired reset link');
            navigate(ADMIN_ROUTES.FORGOT_PASSWORD, { replace: true });
        } else {
            setToken(resetToken);
        }
    }, [searchParams, navigate, showSnackbar]);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError('');
                
                const response = await authService.resetPassword({
                    token: token,
                    newPassword: values.newPassword
                });

                if (response?.status === HTTP_STATUS.OK) {
                    showSnackbar('success', 'Password reset successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate(ADMIN_ROUTES.LOGIN);
                    }, 2000);
                } else {
                    setError(response?.message || 'Failed to reset password. Please try again.');
                    showSnackbar('error', response?.message || 'Failed to reset password');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'An error occurred while resetting your password.';
                setError(errorMessage);
                showSnackbar('error', errorMessage);
            } finally {
                setLoading(false);
            }
        },
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

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
                {/* Back Link */}
                <Link to={ADMIN_ROUTES.FORGOT_PASSWORD} className={classes.backLink}>
                    <FaArrowLeft />
                    <span>Back</span>
                </Link>

                {/* Title */}
                <h1 className={classes.title}>Reset Password</h1>
                <p className={classes.subtitle}>Create a new password for your account</p>

                {/* Error Message */}
                {error && (
                    <div className={classes.errorMessage}>
                        <p>{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {formik.status?.success && (
                    <div className={classes.successMessage}>
                        <p>Password has been reset successfully! Redirecting to login...</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    {/* New Password Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                            helperText={formik.touched.newPassword && formik.errors.newPassword}
                            autoComplete="new-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FaLock className="text-gray-400" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className={classes.inputField}>
                        <TextFieldV2
                            fullWidth
                            name="confirmPassword"
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            autoComplete="new-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FaLock className="text-gray-400" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primaryContained"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>

                    {/* Back to Login Link */}
                    <p style={{ 
                        textAlign: 'center', 
                        marginTop: '1.5rem', 
                        color: '#7F8C8D', 
                        fontSize: '0.9rem' 
                    }}>
                        Remember your password?{' '}
                        <Link to={ADMIN_ROUTES.LOGIN} className={classes.link}>
                            Back to Login
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;