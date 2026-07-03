import { Route, Routes } from "react-router-dom";
import SettingPage from "../../components/pages/Settings/Settings.page";
import PermissionGuard from "../PermissionGuard";

const SettingRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><SettingPage /></PermissionGuard>} />
        </Routes>
    );
};

export default SettingRoutes;