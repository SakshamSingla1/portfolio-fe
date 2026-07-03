import { Route, Routes } from "react-router-dom";
import ListingAchievementPage from "../../components/pages/Achievements/ListingAchievements.page";
import AddAchievementPage from "../../components/pages/Achievements/AddAchievement.page";
import EditAchievementPage from "../../components/pages/Achievements/EditAchievement.page";
import ViewAchievementPage from "../../components/pages/Achievements/ViewAchievement.page";
import PermissionGuard from "../PermissionGuard";

const AchievementRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingAchievementPage /></PermissionGuard>} />    
            <Route path="add" element={<PermissionGuard required="ADD"><AddAchievementPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditAchievementPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewAchievementPage /></PermissionGuard>} />
        </Routes>
    );
};

export default AchievementRoutes;