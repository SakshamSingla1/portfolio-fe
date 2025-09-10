import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import TextFieldV2 from '../../../atoms/TextField/TextField';
import Button from '../../../atoms/Button/Button';
import { InputAdornment } from '@mui/material';
import { useAuthService } from '../../../../services/useAuthService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await authService.forgotPassword(values);
                if (response.status === HTTP_STATUS.OK) {
                    setIsSubmitted(true);
                    showSnackbar('success', response?.data?.message || 'Password reset link sent successfully!');
                    setTimeout(() => {
                        navigate(ADMIN_ROUTES.LOGIN);
                    }, 3000);
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'An error occurred while sending the reset link.';
                showSnackbar('error', errorMessage);
            } finally {
                setSubmitting(false);
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
                {/* Back Link */}
                <Link to={ADMIN_ROUTES.LOGIN} className={classes.backLink}>
                    <FaArrowLeft />
                    <span>Back to Login</span>
                </Link>

                {/* Title */}
                <h1 className={classes.title}>Reset Password</h1>
                <p className={classes.subtitle}>Enter your email to receive a password reset link</p>

                {/* Success Message */}
                {isSubmitted ? (
                    <div className={classes.successMessage}>
                        <p>Password reset link has been sent to your email. Redirecting to login...</p>
                    </div>
                ) : (
                    <>
                        {/* Error Message */}
                        {formik.touched.email && formik.errors.email && (
                            <div className={classes.errorMessage}>
                                <p>{formik.errors.email}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit}>
                            {/* Email Field */}
                            <div className={classes.inputField}>
                                <TextFieldV2
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    autoComplete="email"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FaEnvelope className="text-gray-400" />
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
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </form>
                    </>
                )}

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
            </motion.div>
        </div>
    );
};

export default ForgotPassword;