import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingProjectsPage = lazy(() => import("../../components/pages/Project/ListingProjects.page"));
const AddProjectPage = lazy(() => import("../../components/pages/Project/AddProject.page"));
const EditProjectPage = lazy(() => import("../../components/pages/Project/EditProject.page"));
const ViewProjectPage = lazy(() => import("../../components/pages/Project/ViewProject.page"));

const ProjectRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingProjectsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddProjectPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditProjectPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewProjectPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default ProjectRoutes;