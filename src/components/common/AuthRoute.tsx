import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { ADMIN_ROUTES } from '../../utils/constant';

const AuthRoute = () => {
    const { user } = useAuthenticatedUser();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || ADMIN_ROUTES.EDUCATION;

    // If user is already authenticated, redirect to the intended page or dashboard
    if (user) {
        return <Navigate to={from} replace state={{ from: location }} />;
    }

    // If not authenticated, render the auth pages (login/register)
    return <Outlet />;
};

export default AuthRoute;
