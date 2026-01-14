import { Route, Routes } from "react-router-dom";
import ListingEducationPage from "../../components/pages/Education/ListingEducation.page";
import AddEducationPage from "../../components/pages/Education/AddEducation.page";
import EditEducationPage from "../../components/pages/Education/EditEducation.page";
import ViewEducationPage from "../../components/pages/Education/ViewEducation.page";

const EducationRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingEducationPage />} />
            <Route path="add" element={<AddEducationPage />} />
            <Route path=":id/edit" element={<EditEducationPage />} />
            <Route path=":id" element={<ViewEducationPage />} />
        </Routes>
    );
};

export default EducationRoutes;