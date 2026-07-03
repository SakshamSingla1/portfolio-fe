import { Route, Routes } from "react-router-dom";
import HelpPage from "../../components/pages/Help/HelpPage";
import PermissionGuard from "../PermissionGuard";

const HelpRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><HelpPage /></PermissionGuard>} />
        </Routes>
    );
};

export default HelpRoutes;