import { Route, Routes } from "react-router-dom";
import DashboardPage from "../../components/pages/Dashboard/Dashboard.page";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route index element={<DashboardPage />} />
        </Routes>
    );
};

export default DashboardRoutes;