import { Route, Routes } from "react-router-dom";
import ResumeListPage from "../../components/pages/Resume/ResumeList.page";
import PermissionGuard from "../PermissionGuard";

const ResumeRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ResumeListPage /></PermissionGuard>} />
        </Routes>
    );
};

export default ResumeRoutes;