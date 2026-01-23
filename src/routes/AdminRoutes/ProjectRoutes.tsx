import { Route, Routes } from "react-router-dom";
import ListingProjectsPage from "../../components/pages/Project/ListingProjects.page";
import AddProjectPage from "../../components/pages/Project/AddProject.page";
import EditProjectPage from "../../components/pages/Project/EditProject.page";
import ViewProjectPage from "../../components/pages/Project/ViewProject.page";

const ProjectRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingProjectsPage />} />
            <Route path="add" element={<AddProjectPage />} />
            <Route path=":id/edit" element={<EditProjectPage />} />
            <Route path=":id" element={<ViewProjectPage />} />
        </Routes>
    );
};

export default ProjectRoutes;