import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from './useAuthenticatedUser';
import { type NavlinkResponse } from '../services/useNavlinkService';

const useRouteValidate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setAuthenticatedUser, navlinks, setNavlinks, setDefaultTheme } = useAuthenticatedUser();

    const currentPath = location.pathname;
    const allowedRoutes: string[] = navlinks?.map((navlink: NavlinkResponse) => navlink.path) || [];
    useEffect(() => {
        if (!user || currentPath === '/' || currentPath === '/sign-in') return;

        const isValid = allowedRoutes.some(route =>
            currentPath.startsWith(route)
        );

        if (!isValid) {
            alert('401 Unauthorized: You do not have permission to view this page.');
            localStorage.clear();
            sessionStorage.clear();
            setAuthenticatedUser(null);
            setNavlinks(null);
            setDefaultTheme(null);
            navigate('/', { replace: true });
        }
    }, [currentPath, user, allowedRoutes, navigate, setAuthenticatedUser, setNavlinks, setDefaultTheme]);
};

export default useRouteValidate;