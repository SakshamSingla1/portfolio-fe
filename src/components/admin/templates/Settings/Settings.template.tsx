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
    Typography,
    Alert,
    Paper,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    ListItemButton,
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
                <div className="p-6">
                    <Typography variant="h6" sx={{ mb: 2, color: '#0E6655' }}>
                        Change Password
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: '#D1F2EB' }} />
                    <div className="space-y-3 flex flex-col justify-center">
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
                        <div className="flex justify-center">
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
            ),
        },
        {
            id: 'email',
            label: 'Email Settings',
            icon: <Email />,
            description: 'Update your email address',
            content: (
                <div className="p-6">
                    <Typography variant="h6" sx={{ mb: 2, color: '#0E6655' }}>
                        Change Email Address
                    </Typography>
                    <div className="mb-3 border-b border-[#D1F2EB]" />
                    <div className="flex flex-col gap-3">
                        <TextField
                            fullWidth
                            label="New Email"
                            type="email"
                            name="email"
                            value={emailForm.values.email}
                            onChange={emailForm.handleChange}
                            onBlur={emailForm.handleBlur}
                            error={emailForm.touched.email && Boolean(emailForm.errors.email)}
                            helperText={emailForm.touched.email && emailForm.errors.email}
                        />
                        <div className="flex justify-center">
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
            ),
        },
        {
            id: 'danger',
            label: 'Danger Zone',
            icon: <ErrorOutline color="error" />,
            description: 'Manage your account security',
            content: (
                <div className="p-6">
                    <Typography variant="h6" sx={{ mb: 2, color: '#D32F2F' }}>
                        Danger Zone
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: '#FFCDD2' }} />
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Warning: These actions are irreversible. Please be certain before proceeding.
                    </Alert>
                    <Button
                        label={propIsLoading.delete ? 'Deleting...' : 'Delete Account'}
                        variant="primaryContained"
                        color="error"
                        onClick={handleDeleteClick}
                        disabled={propIsLoading.delete}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FDFC] rounded-xl">
            {/* Sidebar */}
            <Paper
                elevation={0}
                sx={{
                    width: 280,
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    p: 3,
                    bgcolor: 'background.paper'
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 3,
                        color: '#0E6655',
                        fontWeight: 600
                    }}
                >
                    Account Settings
                </Typography>
                <List>
                    {tabs.map((tab, index) => (
                        <ListItemButton
                            key={tab.id}
                            selected={activeTab === index}
                            onClick={() => handleTabChange(index)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                '&.Mui-selected': {
                                    backgroundColor: '#E8F8F5',
                                    color: '#0E6655',
                                    '&:hover': {
                                        backgroundColor: '#D1F2EB',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: '#F5FDFB',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: activeTab === index ? '#0E6655' : '#666',
                                }}
                            >
                                {tab.icon}
                            </ListItemIcon>
                            <Box>
                                <ListItemText
                                    primary={tab.label}
                                    primaryTypographyProps={{
                                        fontWeight: 500,
                                        color: activeTab === index ? '#0E6655' : 'text.primary',
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {tab.description}
                                </Typography>
                            </Box>
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            <div className="flex-1 p-4 bg-[#F8FDFC]">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        minHeight: 'calc(100vh - 64px)',
                        bgcolor: 'background.paper',
                        border: '1px solid #D1F2EB',
                        boxShadow: '0 2px 15px rgba(0,0,0,0.03)'
                    }}
                >
                    {formStatus && (
                        <Alert
                            severity={formStatus.type}
                            sx={{
                                mb: 3,
                                '&.MuiAlert-standardSuccess': {
                                    bgcolor: '#E8F8F5',
                                    color: '#0E6655',
                                    '& .MuiAlert-icon': {
                                        color: '#1ABC9C'
                                    }
                                },
                                '&.MuiAlert-standardError': {
                                    bgcolor: '#FFEBEE',
                                    color: '#C62828',
                                    '& .MuiAlert-icon': {
                                        color: '#D32F2F'
                                    }
                                }
                            }}
                            onClose={() => setFormStatus(null)}
                        >
                            {formStatus.message}
                        </Alert>
                    )}
                    {tabs[activeTab].content}
                </Paper>
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