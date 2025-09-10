import React, { useState } from "react";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
} from "@mui/material";
import { Lock, Email, ErrorOutline } from "@mui/icons-material";
import Button from "../../../../components/atoms/Button/Button";
import TextField from "../../../../components/atoms/TextField/TextField";
import { AuthDeleteAccountRequest } from "../../../../services/useAuthService";

interface SettingsTemplateProps {
    user: {
        email: string;
        fullName: string;
    } | null;
    onChangePassword: (values: {
        oldPassword: string;
        newPassword: string
    }) => Promise<{ success: boolean; error?: string }>;
    onChangeEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
    onDeleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
    isLoading: {
        password: boolean;
        email: boolean;
        delete: boolean;
    };
}

interface TabType {
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
    content: React.ReactNode;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
    user,
    onChangePassword,
    onChangeEmail,
    onDeleteAccount,
    isLoading: propIsLoading,
}) => {
    const { showSnackbar } = useSnackbar();
    const { setAuthenticatedUser } = useAuthenticatedUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formStatus, setFormStatus] = useState<{
        type: 'success' | 'error';
        message: string
    } | null>(null);

    // Form handlers
    const passwordForm = useFormik({
        initialValues: { oldPassword: "", newPassword: "" },
        validationSchema: Yup.object().shape({
            oldPassword: Yup.string().required("Old password is required"),
            newPassword: Yup.string().required("New password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await onChangePassword(values);
                if (response.success) {
                    setFormStatus({ type: 'success', message: 'Password updated successfully' });
                    passwordForm.resetForm();
                } else {
                    throw new Error(response.error);
                }
            } catch (error: any) {
                setFormStatus({ type: 'error', message: error.message || "Error changing password" });
            }
        },
    });

    const emailForm = useFormik({
        initialValues: { email: user?.email || "" },
        validationSchema: Yup.object().shape({
            email: Yup.string().required("Email is required").email("Invalid email format"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await onChangeEmail(values.email);
                if (response.success) {
                    setFormStatus({ type: 'success', message: 'Email updated successfully' });
                    emailForm.resetForm();
                } else {
                    throw new Error(response.error);
                }
            } catch (error: any) {
                setFormStatus({ type: 'error', message: error.message || "Error changing email" });
            }
        },
    });

    const deleteForm = useFormik({
        initialValues: { password: "" },
        validationSchema: Yup.object().shape({
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: async (values: AuthDeleteAccountRequest) => {
            try {
                const response = await onDeleteAccount(values.password);
                if (response.success) {
                    handleLogout();
                } else {
                    throw new Error(response.error);
                }
            } catch (error: any) {
                setFormStatus({ type: 'error', message: error.message || "Error deleting account" });
            }
        },
    });

    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
        setFormStatus(null);
    };

    const handleDeleteClick = () => setDeleteDialogOpen(true);
    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        deleteForm.resetForm();
    };

    const handleLogout = () => {
        setAuthenticatedUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    const tabs: TabType[] = [
        {
            id: 'password',
            label: 'Change Password',
            icon: <Lock />,
            description: 'Update your account password',
            content: (
                <div className="p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                            <Lock className="mr-3 text-blue-600" />
                            Change Password
                        </h3>
                        <p className="text-gray-600">Update your account password for enhanced security</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="space-y-6">
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                name="oldPassword"
                                value={passwordForm.values.oldPassword}
                                onChange={passwordForm.handleChange}
                                onBlur={passwordForm.handleBlur}
                                error={passwordForm.touched.oldPassword && Boolean(passwordForm.errors.oldPassword)}
                                helperText={passwordForm.touched.oldPassword && passwordForm.errors.oldPassword}
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={passwordForm.values.newPassword}
                                onChange={passwordForm.handleChange}
                                onBlur={passwordForm.handleBlur}
                                error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
                                helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                            />
                            <div className="flex justify-end pt-4">
                                <Button
                                    label={propIsLoading.password ? 'Updating...' : 'Update Password'}
                                    type="submit"
                                    variant="primaryContained"
                                    disabled={propIsLoading.password}
                                    onClick={() => passwordForm.handleSubmit()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'email',
            label: 'Email Settings',
            icon: <Email />,
            description: 'Update your email address',
            content: (
                <div className="p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                            <Email className="mr-3 text-green-600" />
                            Change Email Address
                        </h3>
                        <p className="text-gray-600">Update your primary email address</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <div className="space-y-6">
                            <TextField
                                fullWidth
                                label="New Email Address"
                                type="email"
                                name="email"
                                value={emailForm.values.email}
                                onChange={emailForm.handleChange}
                                onBlur={emailForm.handleBlur}
                                error={emailForm.touched.email && Boolean(emailForm.errors.email)}
                                helperText={emailForm.touched.email && emailForm.errors.email}
                            />
                            <div className="flex justify-end pt-4">
                                <Button
                                    label={propIsLoading.email ? 'Updating...' : 'Update Email'}
                                    type="submit"
                                    variant="primaryContained"
                                    disabled={propIsLoading.email}
                                    onClick={() => emailForm.handleSubmit()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'danger',
            label: 'Danger Zone',
            icon: <ErrorOutline color="error" />,
            description: 'Manage your account security',
            content: (
                <div className="p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-red-900 mb-2 flex items-center">
                            <ErrorOutline className="mr-3 text-red-600" />
                            Danger Zone
                        </h3>
                        <p className="text-gray-600">Irreversible actions that affect your account</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                        <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
                            <div className="flex items-center">
                                <ErrorOutline className="text-red-600 mr-3" />
                                <div>
                                    <h4 className="font-semibold text-red-900">Warning</h4>
                                    <p className="text-red-800 text-sm">These actions are irreversible. Please be certain before proceeding.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                label={propIsLoading.delete ? 'Deleting...' : 'Delete Account'}
                                variant="primaryContained"
                                color="error"
                                onClick={handleDeleteClick}
                                disabled={propIsLoading.delete}
                            />
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-slate-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
                
                <div className="relative px-8 py-12">
                    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-3">Account Settings</h1>
                            <p className="text-xl text-white/80 mb-6">Manage your account preferences and security</p>
                            <div className="flex justify-center gap-3">
                                <span className="px-4 py-2 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-400/30">
                                    🔒 Secure Account
                                </span>
                                <span className="px-4 py-2 bg-green-500/20 text-green-100 rounded-full text-sm font-medium backdrop-blur-sm border border-green-400/30">
                                    ✅ Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Enhanced Sidebar */}
                <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                        Navigation
                    </h2>
                    <div className="space-y-2">
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                onClick={() => handleTabChange(index)}
                                className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
                                    activeTab === index
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
                                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${
                                        activeTab === index
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                    }`}>
                                        {tab.icon}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold transition-colors ${
                                            activeTab === index ? 'text-blue-900' : 'text-gray-900'
                                        }`}>
                                            {tab.label}
                                        </h3>
                                        <p className="text-sm text-gray-600">{tab.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {formStatus && (
                        <div className={`mb-6 p-4 rounded-xl border-l-4 ${
                            formStatus.type === 'success'
                                ? 'bg-green-50 border-green-400 text-green-800'
                                : 'bg-red-50 border-red-400 text-red-800'
                        }`}>
                            <div className="flex justify-between items-center">
                                <span>{formStatus.message}</span>
                                <button
                                    onClick={() => setFormStatus(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {tabs[activeTab].content}
                    </div>
                </div>
            </div>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteClose}
                aria-labelledby="delete-account-dialog"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            '& .MuiAlert-icon': {
                                color: '#D32F2F'
                            }
                        }}
                    >
                        This action cannot be undone. All your data will be permanently deleted.
                    </Alert>
                    <Box component="form" onSubmit={deleteForm.handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Enter your password to confirm"
                            type="password"
                            name="password"
                            value={deleteForm.values.password}
                            onChange={deleteForm.handleChange}
                            onBlur={deleteForm.handleBlur}
                            error={deleteForm.touched.password && Boolean(deleteForm.errors.password)}
                            helperText={deleteForm.touched.password && deleteForm.errors.password}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        label="Cancel"
                        variant="secondaryContained"
                        onClick={handleDeleteClose}
                        disabled={propIsLoading.delete}
                    />
                    <Button
                        label="Delete Account"
                        onClick={() => deleteForm.handleSubmit()}
                        disabled={propIsLoading.delete}
                        variant="primaryContained"
                        color="error"
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SettingsTemplate;