import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingPublicationPage = lazy(() => import("../../components/pages/Publication/ListingPublication.page"));
const AddPublicationPage = lazy(() => import("../../components/pages/Publication/AddPublication.page"));
const UpdatePublicationPage = lazy(() => import("../../components/pages/Publication/EditPublication.page"));
const ViewPublicationPage = lazy(() => import("../../components/pages/Publication/ViewPublication.page"));

const PublicationRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingPublicationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddPublicationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdatePublicationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewPublicationPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default PublicationRoutes;
