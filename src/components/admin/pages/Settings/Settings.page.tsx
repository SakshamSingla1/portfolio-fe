import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, HTTP_STATUS } from '../../../../utils/constant';
import { useAuthService , ChangePasswordRequest, AuthDeleteAccountRequest} from '../../../../services/useAuthService';
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

    const onChangePassword = async (values: ChangePasswordRequest) => {
        try {
            setIsLoading(prev => ({ ...prev, password: true }));
            const response = await authService.changePassword(id,{
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Password changed successfully');
                return { success: true };
            }
            throw new Error(response.data?.message || 'Failed to change password');
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error changing password');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(prev => ({ ...prev, password: false }));
        }
    };

    const onChangeEmail = async (email: string) => {
        try {
            setIsLoading(prev => ({ ...prev, email: true }));
            const response = await authService.changeEmail(id,{ email });
    
            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Email changed successfully. Please verify your new email.');
                handleLogout();
                navigate(ADMIN_ROUTES.LOGIN);
                return { success: true };
            }
            throw new Error(response.data?.message || 'Failed to update email');
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error updating email');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(prev => ({ ...prev, email: false }));
        }
    };

    const onDeleteAccount = async (password:string) => {
        try {
            setIsLoading(prev => ({ ...prev, delete: true }));
            const response = await authService.deleteAccount(id,{
                password
            });

            if (response.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Account deleted successfully');
                handleLogout();
                navigate(ADMIN_ROUTES.LOGIN);
                return { success: true };
            }
            throw new Error(response.data?.message || 'Failed to delete account');
        } catch (error: any) {
            showSnackbar('error', error.message || 'Error deleting account');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(prev => ({ ...prev, delete: false }));
        }
    };

    return (
        <SettingsTemplate
            user={user}
            onChangePassword={onChangePassword}
            onChangeEmail={onChangeEmail}
            onDeleteAccount={onDeleteAccount}
            isLoading={isLoading}
        />
    );
};

export default SettingsPage;