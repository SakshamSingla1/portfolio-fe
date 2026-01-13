import { Route, Routes } from "react-router-dom";
import SettingPage from "../../components/pages/Settings/Settings.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const SettingRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.SETTINGS} element={<SettingPage />} />
        </Routes>
    );
};

export default SettingRoutes;