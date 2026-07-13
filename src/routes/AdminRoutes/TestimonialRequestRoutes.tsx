import { Route, Routes } from "react-router-dom";
import ListingTestimonialLinksPage from "../../components/pages/TestimonialRequests/ListingTestimonialLinks.page";
import PermissionGuard from "../PermissionGuard";

const TestimonialRequestRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingTestimonialLinksPage /></PermissionGuard>} />
        </Routes>
    );
};

export default TestimonialRequestRoutes;
