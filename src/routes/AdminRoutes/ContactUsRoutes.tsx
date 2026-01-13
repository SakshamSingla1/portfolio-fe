import { Route, Routes } from "react-router-dom";
import ListingContactUsPage from "../../components/pages/ContactUs/ListingContactUs.page";

const ContactUsRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingContactUsPage />} />
        </Routes>
    );
};

export default ContactUsRoutes;