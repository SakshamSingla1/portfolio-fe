import { Route, Routes } from 'react-router-dom';
import LandingManagementPage from '../../components/pages/LandingManagement/LandingManagement.page';
import PermissionGuard from '../PermissionGuard';

const LandingRoutes = () => (
    <Routes>
        <Route index element={<PermissionGuard required="VIEW"><LandingManagementPage /></PermissionGuard>} />
    </Routes>
);

export default LandingRoutes;
