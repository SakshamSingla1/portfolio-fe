import { Route, Routes } from "react-router-dom";
import HelpPage from "../../components/pages/Help/HelpPage";

const HelpRoutes = () => {
    return (
        <Routes>
            <Route index element={<HelpPage />} />
        </Routes>
    );
};

export default HelpRoutes;