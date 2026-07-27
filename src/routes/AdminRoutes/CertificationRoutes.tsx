import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingCertificationPage = lazy(() => import("../../components/pages/Certification/ListingCertification.page"));
const AddCertificationPage = lazy(() => import("../../components/pages/Certification/AddCertification.page"));
const UpdateCertificationPage = lazy(() => import("../../components/pages/Certification/EditCertification.page"));
const ViewCertificationPage = lazy(() => import("../../components/pages/Certification/ViewCertification.page"));

const CertificationRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingCertificationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddCertificationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdateCertificationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewCertificationPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default CertificationRoutes;