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
            <Route path=":role/:index/edit" element={<EditNavLinkPage />} />
            <Route path=":role/:index" element={<ViewNavLinkPage />} />
        </Routes>
    );
};

export default NavLinkRoutes;