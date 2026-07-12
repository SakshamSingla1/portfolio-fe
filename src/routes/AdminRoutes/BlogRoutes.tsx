import { Route, Routes } from "react-router-dom";
import ListingBlogsPage from "../../components/pages/Blogs/ListingBlogs.page";
import AddBlogPage from "../../components/pages/Blogs/AddBlog.page";
import EditBlogPage from "../../components/pages/Blogs/EditBlog.page";
import ViewBlogPage from "../../components/pages/Blogs/ViewBlog.page";
import PermissionGuard from "../PermissionGuard";

const BlogRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingBlogsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddBlogPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditBlogPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewBlogPage /></PermissionGuard>} />
        </Routes>
    );
};

export default BlogRoutes;
