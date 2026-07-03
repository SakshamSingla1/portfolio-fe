import { Route, Routes } from "react-router-dom";
import ListingEducationPage from "../../components/pages/Education/ListingEducation.page";
import AddEducationPage from "../../components/pages/Education/AddEducation.page";
import EditEducationPage from "../../components/pages/Education/EditEducation.page";
import ViewEducationPage from "../../components/pages/Education/ViewEducation.page";
import PermissionGuard from "../PermissionGuard";

const EducationRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingEducationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddEducationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditEducationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewEducationPage /></PermissionGuard>} />
        </Routes>
    );
};

export default EducationRoutes;