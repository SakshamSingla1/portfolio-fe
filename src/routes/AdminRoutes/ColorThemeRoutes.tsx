import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ColorThemeListingPage = lazy(() => import("../../components/pages/ColorTheme/ListingColorTheme.page"));
const ColorThemeAddPage = lazy(() => import("../../components/pages/ColorTheme/AddColorTheme.page"));
const ColorThemeEditPage = lazy(() => import("../../components/pages/ColorTheme/EditColorTheme.page"));
const ColorThemeViewPage = lazy(() => import("../../components/pages/ColorTheme/ViewColorTheme.page"));

const ColorThemeRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ColorThemeListingPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><ColorThemeAddPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><ColorThemeEditPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ColorThemeViewPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default ColorThemeRoutes;