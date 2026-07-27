import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingAchievementPage = lazy(() => import("../../components/pages/Achievements/ListingAchievements.page"));
const AddAchievementPage = lazy(() => import("../../components/pages/Achievements/AddAchievement.page"));
const EditAchievementPage = lazy(() => import("../../components/pages/Achievements/EditAchievement.page"));
const ViewAchievementPage = lazy(() => import("../../components/pages/Achievements/ViewAchievement.page"));

const AchievementRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingAchievementPage /></PermissionGuard>} />    
            <Route path="add" element={<PermissionGuard required="ADD"><AddAchievementPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditAchievementPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewAchievementPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default AchievementRoutes;