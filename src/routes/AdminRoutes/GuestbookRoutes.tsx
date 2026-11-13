import { Route, Routes } from "react-router-dom";
import GuestbookManagementPage from "../../components/pages/Guestbook/GuestbookManagement.page";
import PermissionGuard from "../PermissionGuard";

const GuestbookRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><GuestbookManagementPage /></PermissionGuard>} />
        </Routes>
    );
};

export default GuestbookRoutes;
