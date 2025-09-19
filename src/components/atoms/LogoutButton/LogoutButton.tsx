import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import Button from '../Button/Button';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
    className?: string;
    variant?: 'text' | 'contained' | 'outlined';
    collapsed?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    className = '',
    variant = 'outlined',
    collapsed = false,
}) => {
    const { setAuthenticatedUser } = useAuthenticatedUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data from context and session storage
        setAuthenticatedUser(null);
        sessionStorage.removeItem('user');

        // Redirect to login page
        navigate(ADMIN_ROUTES.LOGIN);
    };

    if (collapsed) {
        return (
            <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                title="Logout"
            >
                <FaSignOutAlt className="w-5 h-5" />
            </button>
        );
    }

    return (
        <Button
            label="Logout"
            variant="primaryContained"
            onClick={handleLogout}
            className={`text-sm font-medium ${className}`}
        />
    );
};

export default LogoutButton;
