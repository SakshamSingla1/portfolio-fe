import { Route, Routes } from "react-router-dom";
import ListingContactUsPage from "../../components/pages/ContactUs/ListingContactUs.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const ContactUsRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.CONTACT_US} element={<ListingContactUsPage />} />
        </Routes>
    );
};

export default ContactUsRoutes;