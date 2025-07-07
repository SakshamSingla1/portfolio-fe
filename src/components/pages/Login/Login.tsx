import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthService } from '../../../services/useAuthService';
import { HTTP_STATUS } from '../../../utils/constant';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaEnvelope, FaGoogle, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const useStyles = createUseStyles((theme:any)=>{
    return {
        links: {
            color: theme.palette.background.primary.primary500,
            '&:hover': {
                color: theme.palette.background.primary.primary600,
            }
        }
    }
})

interface Login {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authService = useAuthService();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const [error, setError] = useState('');

    // If user is already logged in, redirect to admin dashboard or the intended URL
    const from = location.state?.from?.pathname || '/admin';
    
    if (user?.token) {
        return <Navigate to={from} replace />;
    }

    const formik = useFormik<Login>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError('');
                
                const response = await authService.login(values);
                
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
                    
                    // Navigate to the intended URL or default admin dashboard
                    navigate(from, { replace: true });
                } else {
                    setError(response?.data?.message || 'Login failed. Please check your credentials.');
                }
            } catch (err: any) {
                console.error('Login error:', err);
                setError(err.response?.data?.message || 'An error occurred during login. Please try again.');
            } finally {
                setLoading(false);
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your admin account</p>
                </div>
                
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <TextFieldV2
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        
                        <div>
                            <div className="relative">
                                <TextFieldV2
                                    label="Password"
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </div>
                            <div className="flex items-center justify-end mb-1">
                                <Link to="/forgot-password" className={classes.links}>
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <Button
                            label={loading ? 'Signing in...' : 'Sign in'}
                            type="submit"
                            variant='primaryContained'
                            disabled={loading}
                            onClick={()=>formik.handleSubmit()}
                        />
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        label="Google"
                        variant='tertiaryContained'
                        startIcon={<FaGoogle />}
                        onClick={()=>formik.handleSubmit()}
                    />
                    <Button
                        label="GitHub"
                        variant='tertiaryContained'
                        startIcon={<FaGithub />}
                        onClick={()=>formik.handleSubmit()}
                    />
                </div>

                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to={ADMIN_ROUTES.REGISTER} className={classes.links}>
                        Sign up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
