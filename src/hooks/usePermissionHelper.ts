import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { useLocation } from "react-router-dom";
import type { ModulePermissionDTO } from "../services/useRoleService";

/** UI-level action concepts used by PermissionGuard and consumers */
export type GuardAction = "VIEW" | "ADD" | "EDIT" | "DELETE";

/** Exact permission name strings stored in the DB */
type DbPermission = "READ" | "WRITE" | "DELETE" | "FULL_ACCESS";

export const usePermissionHelper = () => {
    const { rolePermissions } = useAuthenticatedUser();
    const location = useLocation();
    const navLinks: ModulePermissionDTO[] = rolePermissions?.navLinks || [];

    const getModuleForCurrentRoute = (): ModulePermissionDTO | undefined => {
        const normalizedPath = location.pathname.startsWith("/")
            ? location.pathname
            : `/${location.pathname}`;

        // Longest path first — ensures most-specific module wins
        const sorted = navLinks
            .filter((m) => m.path)
            .sort((a, b) => b.path.length - a.path.length);

        return sorted.find((m) => {
            const modulePath = m.path.startsWith("/") ? m.path : `/${m.path}`;
            return normalizedPath.startsWith(modulePath);
        });
    };

    const hasAny = (...perms: DbPermission[]): boolean => {
        const module = getModuleForCurrentRoute();
        if (!module) return false;
        return module.permissions.some((p) =>
            perms.includes(p.name as DbPermission)
        );
    };

    return {
        // READ or FULL_ACCESS → can view / list
        canView: hasAny("READ", "FULL_ACCESS"),
        // WRITE or FULL_ACCESS → can create new records
        canAdd: hasAny("WRITE", "FULL_ACCESS"),
        // WRITE or FULL_ACCESS → can update existing records
        canEdit: hasAny("WRITE", "FULL_ACCESS"),
        // DELETE or FULL_ACCESS → can remove records
        canDelete: hasAny("DELETE", "FULL_ACCESS"),
        // any permission at all → module is accessible
        canAccessModule: hasAny("READ", "WRITE", "DELETE", "FULL_ACCESS"),
    };
};
