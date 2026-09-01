import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const AnalyticsPage = lazy(() => import("../../components/pages/Analytics/Analytics.page"));

const AnalyticsRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><AnalyticsPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default AnalyticsRoutes;
