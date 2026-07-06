import { Route, Routes } from "react-router-dom";
import ListingRolesPage from "../../components/pages/RolePermissions/ListingRole.page";
import AddRolePage from "../../components/pages/RolePermissions/AddRole.page";
import EditRolePage from "../../components/pages/RolePermissions/EditRole.page";
import ViewRolePage from "../../components/pages/RolePermissions/ViewRole.page";
import PermissionGuard from "../PermissionGuard";

const RoleRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingRolesPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddRolePage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditRolePage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewRolePage /></PermissionGuard>} />
        </Routes>
    );
};

export default RoleRoutes;