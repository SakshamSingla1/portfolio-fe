import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import TextFieldV2 from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import { useAuthService } from '../../../services/useAuthService';
import { HTTP_STATUS } from '../../../utils/constant';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { createUseStyles } from 'react-jss';

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(3, 'fullName must be at least 3 characters')
        .required('fullName is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
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

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const authService = useAuthService();
    const { user } = useAuthenticatedUser();
    const classes = useStyles();
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
                    navigate(ADMIN_ROUTES.EDUCATION);
                } else {
                    alert(response?.message);
                }
            } catch (error) {
                alert(error);
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
                    <p className="text-gray-600">Join us today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="relative">
                            <TextFieldV2
                                label="fullName"
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Enter your fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <TextFieldV2
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <TextFieldV2
                                label="Password"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <TextFieldV2
                                label="Confirm Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            label={loading ? 'Creating account...' : 'Sign up'}
                            type="submit"
                            variant="primaryContained"
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
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
                    Already have an account?{' '}
                    <Link to="/login" className={classes.links}>
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;