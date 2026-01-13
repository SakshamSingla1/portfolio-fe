import { Route, Routes } from "react-router-dom";
import ProfilePage from "../../components/pages/Profile/Profile.page";

const ProfileRoutes = () => {
    return (
        <Routes>
            <Route index element={<ProfilePage />} />
        </Routes>
    );
};

export default ProfileRoutes;