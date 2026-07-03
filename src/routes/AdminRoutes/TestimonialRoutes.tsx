import { Route, Routes } from "react-router-dom";
import ListingTestimonialPage from "../../components/pages/Testimonial/ListingTestimonial.page";
import AddTestimonialPage from "../../components/pages/Testimonial/AddTestimonial.page";
import UpdateTestimonialPage from "../../components/pages/Testimonial/UpdateTestimonial.page";
import ViewTestimonialPage from "../../components/pages/Testimonial/ViewTestimonial.page";
import PermissionGuard from "../PermissionGuard";

const TestimonialRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingTestimonialPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddTestimonialPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdateTestimonialPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewTestimonialPage /></PermissionGuard>} />
        </Routes>
    );
};

export default TestimonialRoutes;