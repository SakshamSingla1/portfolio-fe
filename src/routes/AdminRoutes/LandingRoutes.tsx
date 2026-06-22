import { Route, Routes } from 'react-router-dom';
import LandingManagementPage from '../../components/pages/LandingManagement/LandingManagement.page';

const LandingRoutes = () => (
    <Routes>
        <Route index element={<LandingManagementPage />} />
    </Routes>
);

export default LandingRoutes;
