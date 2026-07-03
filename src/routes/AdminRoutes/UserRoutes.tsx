import { Route, Routes } from "react-router-dom";
import ListingUserPage from "../../components/pages/Users/ListingUsers.page";
import EditUserPage from "../../components/pages/Users/EditUser.page";
import ViewUserPage from "../../components/pages/Users/ViewUser.page";
import PermissionGuard from "../PermissionGuard";

const UserRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingUserPage /></PermissionGuard>} />
            <Route path="/:id/edit" element={<PermissionGuard required="EDIT"><EditUserPage /></PermissionGuard>} />
            <Route path="/:id" element={<PermissionGuard required="VIEW"><ViewUserPage /></PermissionGuard>} />
        </Routes>
    );
};

export default UserRoutes;