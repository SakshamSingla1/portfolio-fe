import { Route, Routes } from "react-router-dom";
import ResumeListPage from "../../components/pages/Resume/ResumeList.page";

const ResumeRoutes = () => {
    return (
        <Routes>
            <Route index element={<ResumeListPage />} />
        </Routes>
    );
};

export default ResumeRoutes;