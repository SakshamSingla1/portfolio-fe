import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingTestimonialPage = lazy(() => import("../../components/pages/Testimonial/ListingTestimonial.page"));
const AddTestimonialPage = lazy(() => import("../../components/pages/Testimonial/AddTestimonial.page"));
const UpdateTestimonialPage = lazy(() => import("../../components/pages/Testimonial/UpdateTestimonial.page"));
const ViewTestimonialPage = lazy(() => import("../../components/pages/Testimonial/ViewTestimonial.page"));

const TestimonialRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingTestimonialPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddTestimonialPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><UpdateTestimonialPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewTestimonialPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default TestimonialRoutes;