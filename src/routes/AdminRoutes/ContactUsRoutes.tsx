import { Route, Routes } from "react-router-dom";
import ListingContactUsPage from "../../components/pages/ContactUs/ListingContactUs.page";

import PermissionGuard from "../PermissionGuard";

const ContactUsRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingContactUsPage /></PermissionGuard>} />
        </Routes>
    );
};

export default ContactUsRoutes;