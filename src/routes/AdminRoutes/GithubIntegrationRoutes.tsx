import { Route, Routes } from "react-router-dom";
import GithubIntegrationPage from "../../components/pages/Github/GithubIntegration.page";
import PermissionGuard from "../PermissionGuard";

const GithubIntegrationRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><GithubIntegrationPage /></PermissionGuard>} />
        </Routes>
    );
};

export default GithubIntegrationRoutes;
