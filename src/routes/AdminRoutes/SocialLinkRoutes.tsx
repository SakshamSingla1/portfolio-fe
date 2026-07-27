import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingSocialLinksPage = lazy(() => import("../../components/pages/SocialLinks/ListingSocialLinks.page"));
const AddSocialLinkPage = lazy(() => import("../../components/pages/SocialLinks/AddSocialLink.page"));
const EditSocialLinkPage = lazy(() => import("../../components/pages/SocialLinks/EditSocialLink.page"));
const ViewSocialLinkPage = lazy(() => import("../../components/pages/SocialLinks/ViewSocialLink.page"));

const SocialLinkRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingSocialLinksPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddSocialLinkPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditSocialLinkPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewSocialLinkPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default SocialLinkRoutes;