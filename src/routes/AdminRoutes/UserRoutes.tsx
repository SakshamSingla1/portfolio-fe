import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingUserPage = lazy(() => import("../../components/pages/Users/ListingUsers.page"));
const AddUserPage = lazy(() => import("../../components/pages/Users/AddUser.page"));
const EditUserPage = lazy(() => import("../../components/pages/Users/EditUser.page"));
const ViewUserPage = lazy(() => import("../../components/pages/Users/ViewUser.page"));

const UserRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingUserPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddUserPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditUserPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewUserPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default UserRoutes;