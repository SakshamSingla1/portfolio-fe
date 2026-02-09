import { Route, Routes } from "react-router-dom";
import ListingNavLinkPage from "../../components/pages/Navlinks/NavlinkListing.page";
import AddNavLinkPage from "../../components/pages/Navlinks/NavlinkAdd.page";
import EditNavLinkPage from "../../components/pages/Navlinks/NavlinkEdit.page";
import ViewNavLinkPage from "../../components/pages/Navlinks/NavlinkView.page";

const NavLinkRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingNavLinkPage />} />
            <Route path="add" element={<AddNavLinkPage />} />
            <Route path=":id/edit" element={<EditNavLinkPage />} />
            <Route path=":id" element={<ViewNavLinkPage />} />
        </Routes>
    );
};

export default NavLinkRoutes;