import { Route, Routes } from "react-router-dom";
import ListingProjectsPage from "../../components/pages/Project/ListingProjects.page";
import AddProjectPage from "../../components/pages/Project/AddProject.page";
import EditProjectPage from "../../components/pages/Project/EditProject.page";
import ViewProjectPage from "../../components/pages/Project/ViewProject.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const ProjectRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.PROJECTS} element={<ListingProjectsPage />} />
            <Route path={ADMIN_ROUTES.PROJECTS_ADD} element={<AddProjectPage />} />
            <Route path={ADMIN_ROUTES.PROJECTS_EDIT} element={<EditProjectPage />} />
            <Route path={ADMIN_ROUTES.PROJECTS_VIEW} element={<ViewProjectPage />} />
        </Routes>
    );
};

export default ProjectRoutes;