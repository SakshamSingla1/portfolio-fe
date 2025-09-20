import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../../../utils/constant';

const ProtectedRoute = () => {
    const { user } = useAuthenticatedUser();
    const location = useLocation();
    const isUserAdmin = user && user.role?.toLowerCase() === 'admin';
    
    if (!isUserAdmin) {
        return (
            <Navigate to={ADMIN_ROUTES.LOGIN} state={{ from: location }} replace />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
