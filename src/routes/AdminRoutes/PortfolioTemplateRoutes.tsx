import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const PortfolioTemplateListingPage = lazy(() => import("../../components/pages/PortfolioTemplate/ListingPortfolioTemplate.page"));

const PortfolioTemplateRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route index element={<PermissionGuard required="VIEW"><PortfolioTemplateListingPage /></PermissionGuard>} />
            </Routes>
        </Suspense>
    );
};

export default PortfolioTemplateRoutes;
