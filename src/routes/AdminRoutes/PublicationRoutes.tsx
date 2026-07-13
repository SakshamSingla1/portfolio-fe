import { Route, Routes } from "react-router-dom";
import ListingPublicationPage from "../../components/pages/Publication/ListingPublication.page";
import AddPublicationPage from "../../components/pages/Publication/AddPublication.page";
import UpdatePublicationPage from "../../components/pages/Publication/EditPublication.page";
import ViewPublicationPage from "../../components/pages/Publication/ViewPublication.page";
import PermissionGuard from "../PermissionGuard";

const PublicationRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingPublicationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddPublicationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdatePublicationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewPublicationPage /></PermissionGuard>} />
        </Routes>
    );
};

export default PublicationRoutes;
