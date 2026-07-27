import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingNavLinkPage = lazy(() => import("../../components/pages/Navlinks/NavlinkListing.page"));
const AddNavLinkPage = lazy(() => import("../../components/pages/Navlinks/NavlinkAdd.page"));
const EditNavLinkPage = lazy(() => import("../../components/pages/Navlinks/NavlinkEdit.page"));
const ViewNavLinkPage = lazy(() => import("../../components/pages/Navlinks/NavlinkView.page"));

const NavLinkRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingNavLinkPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddNavLinkPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditNavLinkPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewNavLinkPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default NavLinkRoutes;