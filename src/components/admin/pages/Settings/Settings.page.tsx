import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, HTTP_STATUS } from '../../../../utils/constant';
import {
    useAuthService,
    ChangePasswordRequest,
    AuthDeleteAccountRequest
} from '../../../../services/useAuthService';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';
import SettingsTemplate from '../../templates/Settings/Settings.template';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();
    const [isLoading, setIsLoading] = useState({
        password: false,
        email: false,
        delete: false
    });

    const id = String(user?.id);

    const handleLogout = () => {
        setAuthenticatedUser(null);
        localStorage.removeItem('user');
        navigate(ADMIN_ROUTES.LOGIN);
    };

    /** Change Password */
    const handleChangePasswordSubmit = async (values: ChangePasswordRequest) => {
        try {
            const response = await authService.changePassword(id, values);
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Password changed successfully');
                return { success: true };
            }else{
                showSnackbar('error', response.data?.message || 'Failed to change password');
            }
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error changing password');
        }
    };

    /** Change Email */
    const handleEmailOtpSubmit = async (otp: string, newEmail: string) => {
        try {
            const response = await authService.verifyChangeEmailOtp(id, {
                otp,
                newEmail
            });
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Email changed successfully');
                handleLogout();
            }else{
                showSnackbar('error', response.data?.message || 'Failed to update email');
            }
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error updating email');
        }
    };

    /** Delete Account with Password + OTP */
    const handleDeleteAccountSubmit = async (values: AuthDeleteAccountRequest) => {
        try {
            const response = await authService.deleteAccount(id, values);
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Account deleted successfully');
                handleLogout();
            }else{
                showSnackbar('error', response.data?.message || 'Failed to delete account');
            }
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error deleting account');
        }
    };

    return (
        <SettingsTemplate
            user={user}
            handleChangePasswordSubmit={handleChangePasswordSubmit}
            handleEmailOtpSubmit={handleEmailOtpSubmit}
            handleDeleteAccountSubmit={handleDeleteAccountSubmit}
        />
    );
};

export default SettingsPage;
