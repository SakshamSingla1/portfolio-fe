import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingRolesPage = lazy(() => import("../../components/pages/RolePermissions/ListingRole.page"));
const AddRolePage = lazy(() => import("../../components/pages/RolePermissions/AddRole.page"));
const EditRolePage = lazy(() => import("../../components/pages/RolePermissions/EditRole.page"));
const ViewRolePage = lazy(() => import("../../components/pages/RolePermissions/ViewRole.page"));

const RoleRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingRolesPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddRolePage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditRolePage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewRolePage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default RoleRoutes;