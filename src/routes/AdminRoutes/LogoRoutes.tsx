import { Route, Routes } from "react-router-dom";
import ListingLogoPage from "../../components/pages/Logos/ListingLogos.page";
import AddLogoPage from "../../components/pages/Logos/AddLogo.page";
import EditLogoPage from "../../components/pages/Logos/EditLogo.page";
import ViewLogoPage from "../../components/pages/Logos/ViewLogo.page";

const LogoRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingLogoPage />} />
            <Route path="add" element={<AddLogoPage />} />
            <Route path=":id/edit" element={<EditLogoPage />} />
            <Route path=":id" element={<ViewLogoPage />} />
        </Routes>
    );
};

export default LogoRoutes;