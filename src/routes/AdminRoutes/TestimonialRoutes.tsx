import { Route, Routes } from "react-router-dom";
import ListingTestimonialPage from "../../components/pages/Testimonial/ListingTestimonial.page";
import AddTestimonialPage from "../../components/pages/Testimonial/AddTestimonial.page";
import UpdateTestimonialPage from "../../components/pages/Testimonial/UpdateTestimonial.page";
import ViewTestimonialPage from "../../components/pages/Testimonial/ViewTestimonial.page";

const TestimonialRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingTestimonialPage />} />
            <Route path="add" element={<AddTestimonialPage />} />
            <Route path=":id/edit" element={<UpdateTestimonialPage />} />
            <Route path=":id" element={<ViewTestimonialPage />} />
        </Routes>
    );
};

export default TestimonialRoutes;