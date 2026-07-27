import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingServicesPage = lazy(() => import("../../components/pages/Services/ListingServices.page"));
const AddServicePage = lazy(() => import("../../components/pages/Services/AddService.page"));
const EditServicePage = lazy(() => import("../../components/pages/Services/EditService.page"));
const ViewServicePage = lazy(() => import("../../components/pages/Services/ViewService.page"));

const ServiceRoutes = () => (
    <Suspense fallback={null}>
        <Routes>
        <Route index element={<PermissionGuard required="VIEW"><ListingServicesPage /></PermissionGuard>} />
        <Route path="add" element={<PermissionGuard required="ADD"><AddServicePage /></PermissionGuard>} />
        <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditServicePage /></PermissionGuard>} />
        <Route path=":id" element={<PermissionGuard required="VIEW"><ViewServicePage /></PermissionGuard>} />
    </Routes>
        </Suspense>
);

export default ServiceRoutes;
