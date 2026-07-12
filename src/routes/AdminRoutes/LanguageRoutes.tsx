import { Route, Routes } from "react-router-dom";
import ListingLanguagesPage from "../../components/pages/Languages/ListingLanguages.page";
import AddLanguagePage from "../../components/pages/Languages/AddLanguage.page";
import EditLanguagePage from "../../components/pages/Languages/EditLanguage.page";
import ViewLanguagePage from "../../components/pages/Languages/ViewLanguage.page";
import PermissionGuard from "../PermissionGuard";

const LanguageRoutes = () => (
    <Routes>
        <Route index element={<PermissionGuard required="VIEW"><ListingLanguagesPage /></PermissionGuard>} />
        <Route path="add" element={<PermissionGuard required="ADD"><AddLanguagePage /></PermissionGuard>} />
        <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditLanguagePage /></PermissionGuard>} />
        <Route path=":id" element={<PermissionGuard required="VIEW"><ViewLanguagePage /></PermissionGuard>} />
    </Routes>
);

export default LanguageRoutes;
