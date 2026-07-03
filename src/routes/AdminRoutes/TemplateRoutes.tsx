import { Route, Routes } from "react-router-dom";
import TemplatesListingPage from "../../components/pages/Templates/TemplatesListing.page";
import TemplateCreatePage from "../../components/pages/Templates/TemplateCreate.page";
import TemplateEditPage from "../../components/pages/Templates/TemplateEdit.page";
import TemplateViewPage from "../../components/pages/Templates/TemplateView.page";
import PermissionGuard from "../PermissionGuard";

const TemplateRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><TemplatesListingPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><TemplateCreatePage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><TemplateEditPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><TemplateViewPage /></PermissionGuard>} />
        </Routes>
    );
};

export default TemplateRoutes;
