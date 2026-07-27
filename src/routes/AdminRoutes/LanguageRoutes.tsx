import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingLanguagesPage = lazy(() => import("../../components/pages/Languages/ListingLanguages.page"));
const AddLanguagePage = lazy(() => import("../../components/pages/Languages/AddLanguage.page"));
const EditLanguagePage = lazy(() => import("../../components/pages/Languages/EditLanguage.page"));
const ViewLanguagePage = lazy(() => import("../../components/pages/Languages/ViewLanguage.page"));

const LanguageRoutes = () => (
    <Suspense fallback={null}>
        <Routes>
        <Route index element={<PermissionGuard required="VIEW"><ListingLanguagesPage /></PermissionGuard>} />
        <Route path="add" element={<PermissionGuard required="ADD"><AddLanguagePage /></PermissionGuard>} />
        <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditLanguagePage /></PermissionGuard>} />
        <Route path=":id" element={<PermissionGuard required="VIEW"><ViewLanguagePage /></PermissionGuard>} />
    </Routes>
        </Suspense>
);

export default LanguageRoutes;
