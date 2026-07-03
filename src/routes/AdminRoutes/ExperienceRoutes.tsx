import { Route, Routes } from "react-router-dom";
import ListingExperiencePage from "../../components/pages/Experience/ListingExperiences.page";
import AddExperiencePage from "../../components/pages/Experience/AddExperience.page";
import EditExperiencePage from "../../components/pages/Experience/EditExperience.page";
import ViewExperiencePage from "../../components/pages/Experience/ViewExperience.page";
import PermissionGuard from "../PermissionGuard";

const ExperienceRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingExperiencePage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddExperiencePage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditExperiencePage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewExperiencePage /></PermissionGuard>} />
        </Routes>
    );
};

export default ExperienceRoutes;