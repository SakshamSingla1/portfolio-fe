import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createUseStyles } from 'react-jss';
import TextFieldV2 from '../../../atoms/TextField/TextField';
import Button from '../../../atoms/Button/Button';
import { InputAdornment } from '@mui/material';
import { useAuthService } from '../../../../services/useAuthService';
import { HTTP_STATUS , ADMIN_ROUTES } from '../../../../utils/constant';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const useStyles = createUseStyles((theme: any) => ({
    links: {
        color: theme.palette.background.primary.primary500,
        '&:hover': {
            color: theme.palette.background.primary.primary600,
        },
    },
}));

interface ForgotPasswordForm {
    email: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const authService = useAuthService();

    const formik = useFormik<ForgotPasswordForm>({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await authService.forgotPassword(values);
                if(response.status == HTTP_STATUS.OK){
                    navigate(ADMIN_ROUTES.LOGIN);
                }
            } catch (error:any) {
                setError(error?.statusMessage);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D1F2EB] via-[#E8F8F5] to-[#1ABC9C] p-4">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm bg-opacity-90 border border-gray-100"
            >
                <div className="text-center">
                    <Link 
                        to="/login" 
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Back to login"
                    >
                        <FaArrowLeft size={20} />
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">Enter your email to receive a reset link</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex">
                            <div className="text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {success ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <div className="flex">
                            <div className="text-green-700">
                                <p>{success}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <TextFieldV2
                                    label="Email Address"
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="your.email@example.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FaEnvelope className="text-gray-400" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            <Button
                                label={loading ? 'Sending...' : 'Send Reset Link'}
                                type="submit"
                                variant='primaryContained'
                                disabled={loading}
                                fullWidth
                                onClick={()=> formik.handleSubmit()}
                            />
                        </div>
                    </form>
                )}

                <div className="text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className={classes.links}>
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;