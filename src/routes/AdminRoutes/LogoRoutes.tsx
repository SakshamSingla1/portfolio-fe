import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingLogoPage = lazy(() => import("../../components/pages/Logos/ListingLogos.page"));
const AddLogoPage = lazy(() => import("../../components/pages/Logos/AddLogo.page"));
const EditLogoPage = lazy(() => import("../../components/pages/Logos/EditLogo.page"));
const ViewLogoPage = lazy(() => import("../../components/pages/Logos/ViewLogo.page"));

const LogoRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingLogoPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddLogoPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditLogoPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewLogoPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default LogoRoutes;