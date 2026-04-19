import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import type { ModulePermissionDTO } from "../services/useRoleService";

const useRouteValidate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    rolePermissions,
    setAuthenticatedUser,
    setRolePermissions,
    setDefaultTheme
  } = useAuthenticatedUser();
  const currentPath = location.pathname;
  const allowedRoutes = useMemo(() => {
    const routes = new Set<string>();
    routes.add("/admin");

    if (rolePermissions?.navLinks?.length) {
      rolePermissions.navLinks.forEach((link: ModulePermissionDTO) => {
        const path = link.path.startsWith("/")
          ? link.path
          : `/${link.path}`;
        routes.add(path);
      });
    }
    
    return Array.from(routes);
  }, [rolePermissions]);

  useEffect(() => {
    if (!user) return;
    if (currentPath === "/" || currentPath === "/sign-in") return;
    if (!allowedRoutes.length) return;
    const isValid = allowedRoutes.some(route =>
      currentPath === route || currentPath.startsWith(`${route}/`)
    );

    if (!isValid) {
      alert("401 Unauthorized: You do not have permission to view this page.");

      localStorage.clear();
      sessionStorage.clear();

      setAuthenticatedUser(null);
      setRolePermissions(null);
      setDefaultTheme(null);

      navigate("/", { replace: true });
    }
  }, [
    currentPath,
    user,
    allowedRoutes,
    navigate,
    setAuthenticatedUser,
    setRolePermissions,
    setDefaultTheme
  ]);
};

export default useRouteValidate;