import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingBlogsPage = lazy(() => import("../../components/pages/Blogs/ListingBlogs.page"));
const AddBlogPage = lazy(() => import("../../components/pages/Blogs/AddBlog.page"));
const EditBlogPage = lazy(() => import("../../components/pages/Blogs/EditBlog.page"));
const ViewBlogPage = lazy(() => import("../../components/pages/Blogs/ViewBlog.page"));

const BlogRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingBlogsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddBlogPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditBlogPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewBlogPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default BlogRoutes;
