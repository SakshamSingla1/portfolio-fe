import { Route, Routes } from "react-router-dom";
import AnalyticsPage from "../../components/pages/Analytics/Analytics.page";

const AnalyticsRoutes = () => {
    return (
        <Routes>
            <Route index element={<AnalyticsPage />} />
        </Routes>
    );
};

export default AnalyticsRoutes;
