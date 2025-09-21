import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../../../utils/constant';

interface ProtectedRouteProps {
    allowedRoles?: string[]; // Optional roles, default to ['admin']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = ['admin'] }) => {
    const { user } = useAuthenticatedUser(); // Assume hook provides loading state
    const location = useLocation();

    const isAllowed = user && allowedRoles.includes(user.role?.toLowerCase() || '');

    if (!isAllowed) {
        return <Navigate to={ADMIN_ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
