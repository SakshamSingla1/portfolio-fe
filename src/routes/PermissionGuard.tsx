import type { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissionHelper, type GuardAction } from "../hooks/usePermissionHelper";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";

interface PermissionGuardProps {
    children: React.ReactNode;
    required: GuardAction;
}

const PermissionGuard: FC<PermissionGuardProps> = ({ children, required }) => {
    const { user } = useAuthenticatedUser();
    const { canView, canAdd, canEdit, canDelete } = usePermissionHelper();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const permitted: Record<GuardAction, boolean> = {
        VIEW:   canView,
        ADD:    canAdd,
        EDIT:   canEdit,
        DELETE: canDelete,
    };

    if (!permitted[required]) {
        const fallback = location.pathname
            .replace(/\/add$/, "")
            .replace(/\/[^/]+\/edit$/, "");
        return <Navigate to={fallback || "/admin"} replace />;
    }

    return <>{children}</>;
};

export default PermissionGuard;
