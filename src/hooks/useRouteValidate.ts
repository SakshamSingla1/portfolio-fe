import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { ROLES } from "../utils/types";

const useRouteValidate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    navlinks,
    setAuthenticatedUser,
    setNavlinks,
    setDefaultTheme
  } = useAuthenticatedUser();
  const currentPath = location.pathname;
  const allowedRoutes = useMemo(() => {
    const routes = new Set<string>();
    routes.add("/admin");

    if (navlinks?.length) {
      navlinks.forEach(link => {
        const path = link.path.startsWith("/")
          ? link.path
          : `/${link.path}`;
        routes.add(path);
      });
    }
    
    return Array.from(routes);
  }, [navlinks]);

  useEffect(() => {
    if (!user) return;
    if (currentPath === "/" || currentPath === "/sign-in") return;
    if (user.role === ROLES.SUPER_ADMIN) return;
    if (!allowedRoutes.length) return;
    const isValid = allowedRoutes.some(route =>
      currentPath === route || currentPath.startsWith(`${route}/`)
    );

    if (!isValid) {
      alert("401 Unauthorized: You do not have permission to view this page.");

      localStorage.clear();
      sessionStorage.clear();

      setAuthenticatedUser(null);
      setNavlinks(null);
      setDefaultTheme(null);

      navigate("/", { replace: true });
    }
  }, [
    currentPath,
    user,
    allowedRoutes,
    navigate,
    setAuthenticatedUser,
    setNavlinks,
    setDefaultTheme
  ]);
};

export default useRouteValidate;