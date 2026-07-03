import { Route, Routes } from "react-router-dom";
import ListingSocialLinksPage from "../../components/pages/SocialLinks/ListingSocialLinks.page";
import AddSocialLinkPage from "../../components/pages/SocialLinks/AddSocialLink.page";
import EditSocialLinkPage from "../../components/pages/SocialLinks/EditSocialLink.page";
import ViewSocialLinkPage from "../../components/pages/SocialLinks/ViewSocialLink.page";
import PermissionGuard from "../PermissionGuard";

const SocialLinkRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingSocialLinksPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddSocialLinkPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditSocialLinkPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewSocialLinkPage /></PermissionGuard>} />
        </Routes>
    );
};

export default SocialLinkRoutes;