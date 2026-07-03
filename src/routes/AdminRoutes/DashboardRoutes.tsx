import { Route, Routes } from "react-router-dom";
import DashboardPage from "../../components/pages/Dashboard/Dashboard.page";
import PermissionGuard from "../PermissionGuard";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><DashboardPage /></PermissionGuard>} />
        </Routes>
    );
};

export default DashboardRoutes;