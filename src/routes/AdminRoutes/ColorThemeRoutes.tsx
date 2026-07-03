import { Route, Routes } from "react-router-dom";
import ColorThemeListingPage from "../../components/pages/ColorTheme/ListingColorTheme.page";
import ColorThemeAddPage from "../../components/pages/ColorTheme/AddColorTheme.page";
import ColorThemeEditPage from "../../components/pages/ColorTheme/EditColorTheme.page";
import ColorThemeViewPage from "../../components/pages/ColorTheme/ViewColorTheme.page";
import PermissionGuard from "../PermissionGuard";

const ColorThemeRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ColorThemeListingPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><ColorThemeAddPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><ColorThemeEditPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ColorThemeViewPage /></PermissionGuard>} />
        </Routes>
    );
};

export default ColorThemeRoutes;