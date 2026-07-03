import { Route, Routes } from "react-router-dom";
import AnalyticsPage from "../../components/pages/Analytics/Analytics.page";
import PermissionGuard from "../PermissionGuard";

const AnalyticsRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><AnalyticsPage /></PermissionGuard>} />
        </Routes>
    );
};

export default AnalyticsRoutes;
