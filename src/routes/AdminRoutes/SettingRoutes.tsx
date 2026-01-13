import { Route, Routes } from "react-router-dom";
import SettingPage from "../../components/pages/Settings/Settings.page";

const SettingRoutes = () => {
    return (
        <Routes>
            <Route index element={<SettingPage />} />
        </Routes>
    );
};

export default SettingRoutes;