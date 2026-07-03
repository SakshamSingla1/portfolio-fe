import { Route, Routes } from "react-router-dom";
import ListingNavLinkPage from "../../components/pages/Navlinks/NavlinkListing.page";
import AddNavLinkPage from "../../components/pages/Navlinks/NavlinkAdd.page";
import EditNavLinkPage from "../../components/pages/Navlinks/NavlinkEdit.page";
import ViewNavLinkPage from "../../components/pages/Navlinks/NavlinkView.page";
import PermissionGuard from "../PermissionGuard";

const NavLinkRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingNavLinkPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddNavLinkPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditNavLinkPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewNavLinkPage /></PermissionGuard>} />
        </Routes>
    );
};

export default NavLinkRoutes;