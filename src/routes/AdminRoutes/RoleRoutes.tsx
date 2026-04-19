import { Route, Routes } from "react-router-dom";
import ListingRolesPage from "../../components/pages/RolePermissions/ListingRole.page";
import AddRolePage from "../../components/pages/RolePermissions/AddRole.page";
import EditRolePage from "../../components/pages/RolePermissions/EditRole.page";

const RoleRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingRolesPage />} />
            <Route path="/add" element={<AddRolePage />} />
            <Route path="/:id/edit" element={<EditRolePage />} />
        </Routes>
    );
};

export default RoleRoutes;