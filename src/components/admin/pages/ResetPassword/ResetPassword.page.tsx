import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams ,Link} from 'react-router-dom';
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
import { HTTP_STATUS,ADMIN_ROUTES  } from '../../../../utils/constant';

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm Password is required'),
});

const useStyles = createUseStyles((theme: any) => ({
    links: {
        color: theme.palette.background.primary.primary500,
        '&:hover': {
            color: theme.palette.background.primary.primary600,
        },
    },
}));

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const authService = useAuthService();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            navigate('/forgot-password', { replace: true });
        } else {
            setToken(resetToken);
        }
    }, [searchParams, navigate]);

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
                    setSuccess('Password reset successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate(ADMIN_ROUTES.LOGIN);
                    }, 2000);
                } else {
                    setError(response?.message || 'Failed to reset password');
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D1F2EB] via-[#E8F8F5] to-[#1ABC9C] p-4">
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
                        to="/forgot-password" 
                        className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Back to forgot password"
                    >
                        <FaArrowLeft size={20} />
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">Enter your new password</p>
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
                                    label="New Password"
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
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
                            <div>
                                <TextFieldV2
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                        </div>

                        <div className='flex justify-center'>
                            <Button
                                label={loading ? 'Resetting...' : 'Reset Password'}
                                type="submit"
                                variant='primaryContained'
                                disabled={loading}
                                fullWidth
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

export default ResetPassword;