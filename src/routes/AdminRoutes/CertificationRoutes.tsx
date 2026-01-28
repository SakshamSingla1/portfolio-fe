import { Route, Routes } from "react-router-dom";
import ListingCertificationPage from "../../components/pages/Certification/ListingCertification.page";
import AddCertificationPage from "../../components/pages/Certification/AddCertification.page";
import UpdateCertificationPage from "../../components/pages/Certification/UpdateCertification.page";
import ViewCertificationPage from "../../components/pages/Certification/ViewCertification.page";

const CertificationRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingCertificationPage />} />
            <Route path="add" element={<AddCertificationPage />} />
            <Route path=":id/edit" element={<UpdateCertificationPage />} />
            <Route path=":id" element={<ViewCertificationPage />} />
        </Routes>
    );
};

export default CertificationRoutes;