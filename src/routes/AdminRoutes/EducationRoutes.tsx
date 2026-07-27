import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingEducationPage = lazy(() => import("../../components/pages/Education/ListingEducation.page"));
const AddEducationPage = lazy(() => import("../../components/pages/Education/AddEducation.page"));
const EditEducationPage = lazy(() => import("../../components/pages/Education/EditEducation.page"));
const ViewEducationPage = lazy(() => import("../../components/pages/Education/ViewEducation.page"));

const EducationRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingEducationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddEducationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditEducationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewEducationPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default EducationRoutes;