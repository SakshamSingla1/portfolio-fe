import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const TemplatesListingPage = lazy(() => import("../../components/pages/Templates/TemplatesListing.page"));
const TemplateCreatePage   = lazy(() => import("../../components/pages/Templates/TemplateCreate.page"));
const TemplateEditPage     = lazy(() => import("../../components/pages/Templates/TemplateEdit.page"));
const TemplateViewPage     = lazy(() => import("../../components/pages/Templates/TemplateView.page"));

const TemplateRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route index element={<PermissionGuard required="VIEW"><TemplatesListingPage /></PermissionGuard>} />
                <Route path="add" element={<PermissionGuard required="ADD"><TemplateCreatePage /></PermissionGuard>} />
                <Route path=":id/edit" element={<PermissionGuard required="EDIT"><TemplateEditPage /></PermissionGuard>} />
                <Route path=":id" element={<PermissionGuard required="VIEW"><TemplateViewPage /></PermissionGuard>} />
            </Routes>
        </Suspense>
    );
};

export default TemplateRoutes;
