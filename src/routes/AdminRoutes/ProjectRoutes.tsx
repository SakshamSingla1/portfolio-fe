import { Route, Routes } from "react-router-dom";
import ListingProjectsPage from "../../components/pages/Project/ListingProjects.page";
import AddProjectPage from "../../components/pages/Project/AddProject.page";
import EditProjectPage from "../../components/pages/Project/EditProject.page";
import ViewProjectPage from "../../components/pages/Project/ViewProject.page";
import PermissionGuard from "../PermissionGuard";

const ProjectRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingProjectsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddProjectPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditProjectPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewProjectPage /></PermissionGuard>} />
        </Routes>
    );
};

export default ProjectRoutes;