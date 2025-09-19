import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { HTTP_STATUS } from '../../../utils/types';
import {
    useAuthService,
    type IChangePasswordRequest,
    type IPasswordRequest,
    type IVerifyOtpRequest
} from '../../../services/useAuthService';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import SettingsTemplate from '../../templates/Settings/Settings.template';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();
    const { user, setAuthenticatedUser } = useAuthenticatedUser();

    const handleLogout = () => {
        setAuthenticatedUser(null);
        sessionStorage.removeItem('user');
        navigate(ADMIN_ROUTES.LOGIN);
    };

    /** Change Password */
    const handleChangePasswordSubmit = async (values: IChangePasswordRequest) => {
        try {
            const response = await authService.changePassword(values);
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
    const handleEmailOtpSubmit = async (values : IVerifyOtpRequest) => {
        try {
            const response = await authService.verifyChangeEmailOtp(values);
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
    const handleDeleteAccountSubmit = async (values : IPasswordRequest) => {
        try {
            const response = await authService.deleteAccount(values);
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
