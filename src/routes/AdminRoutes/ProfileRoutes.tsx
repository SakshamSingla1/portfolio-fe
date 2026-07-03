import { Route, Routes } from "react-router-dom";
import ProfilePage from "../../components/pages/Profile/Profile.page";
import PermissionGuard from "../PermissionGuard";

const ProfileRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ProfilePage /></PermissionGuard>} />
        </Routes>
    );
};

export default ProfileRoutes;