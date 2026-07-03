import { Route, Routes } from "react-router-dom";
import ListingLogoPage from "../../components/pages/Logos/ListingLogos.page";
import AddLogoPage from "../../components/pages/Logos/AddLogo.page";
import EditLogoPage from "../../components/pages/Logos/EditLogo.page";
import ViewLogoPage from "../../components/pages/Logos/ViewLogo.page";
import PermissionGuard from "../PermissionGuard";

const LogoRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingLogoPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddLogoPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditLogoPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewLogoPage /></PermissionGuard>} />
        </Routes>
    );
};

export default LogoRoutes;