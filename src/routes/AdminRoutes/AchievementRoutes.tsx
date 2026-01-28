import { Route, Routes } from "react-router-dom";
import ListingAchievementPage from "../../components/pages/Achievements/ListingAchievements.page";
import AddAchievementPage from "../../components/pages/Achievements/AddAchievement.page";
import UpdateAchievementPage from "../../components/pages/Achievements/UpdateAchievement.page";
import ViewAchievementPage from "../../components/pages/Achievements/ViewAchievement.page";

const AchievementRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingAchievementPage />} />    
            <Route path="add" element={<AddAchievementPage />} />
            <Route path=":id/edit" element={<UpdateAchievementPage />} />
            <Route path=":id" element={<ViewAchievementPage />} />
        </Routes>
    );
};

export default AchievementRoutes;