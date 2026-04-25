import { Route, Routes } from "react-router-dom";
import ListingRolesPage from "../../components/pages/RolePermissions/ListingRole.page";
import AddRolePage from "../../components/pages/RolePermissions/AddRole.page";
import EditRolePage from "../../components/pages/RolePermissions/EditRole.page";
import ViewRolePage from "../../components/pages/RolePermissions/ViewRole.page";

const RoleRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingRolesPage />} />
            <Route path="/add" element={<AddRolePage />} />
            <Route path="/:id/edit" element={<EditRolePage />} />
            <Route path="/:id" element={<ViewRolePage />} />
        </Routes>
    );
};

export default RoleRoutes;