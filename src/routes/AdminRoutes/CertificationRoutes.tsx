import { Route, Routes } from "react-router-dom";
import ListingCertificationPage from "../../components/pages/Certification/ListingCertification.page";
import AddCertificationPage from "../../components/pages/Certification/AddCertification.page";
import UpdateCertificationPage from "../../components/pages/Certification/EditCertification.page";
import ViewCertificationPage from "../../components/pages/Certification/ViewCertification.page";
import PermissionGuard from "../PermissionGuard";

const CertificationRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingCertificationPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddCertificationPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdateCertificationPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewCertificationPage /></PermissionGuard>} />
        </Routes>
    );
};

export default CertificationRoutes;