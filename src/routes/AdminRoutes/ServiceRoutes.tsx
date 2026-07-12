import { Route, Routes } from "react-router-dom";
import ListingServicesPage from "../../components/pages/Services/ListingServices.page";
import AddServicePage from "../../components/pages/Services/AddService.page";
import EditServicePage from "../../components/pages/Services/EditService.page";
import ViewServicePage from "../../components/pages/Services/ViewService.page";
import PermissionGuard from "../PermissionGuard";

const ServiceRoutes = () => (
    <Routes>
        <Route index element={<PermissionGuard required="VIEW"><ListingServicesPage /></PermissionGuard>} />
        <Route path="add" element={<PermissionGuard required="ADD"><AddServicePage /></PermissionGuard>} />
        <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditServicePage /></PermissionGuard>} />
        <Route path=":id" element={<PermissionGuard required="VIEW"><ViewServicePage /></PermissionGuard>} />
    </Routes>
);

export default ServiceRoutes;
