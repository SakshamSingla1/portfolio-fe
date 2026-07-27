import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingExperiencePage = lazy(() => import("../../components/pages/Experience/ListingExperiences.page"));
const AddExperiencePage = lazy(() => import("../../components/pages/Experience/AddExperience.page"));
const EditExperiencePage = lazy(() => import("../../components/pages/Experience/EditExperience.page"));
const ViewExperiencePage = lazy(() => import("../../components/pages/Experience/ViewExperience.page"));

const ExperienceRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingExperiencePage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddExperiencePage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditExperiencePage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewExperiencePage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default ExperienceRoutes;