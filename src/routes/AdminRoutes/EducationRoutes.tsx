import { Route, Routes } from "react-router-dom";
import ListingEducationPage from "../../components/pages/Education/ListingEducation.page";
import AddEducationPage from "../../components/pages/Education/AddEducation.page";
import EditEducationPage from "../../components/pages/Education/EditEducation.page";
import ViewEducationPage from "../../components/pages/Education/ViewEducation.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const EducationRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.EDUCATION} element={<ListingEducationPage />} />
            <Route path={ADMIN_ROUTES.EDUCATION_ADD} element={<AddEducationPage />} />
            <Route path={ADMIN_ROUTES.EDUCATION_EDIT} element={<EditEducationPage />} />
            <Route path={ADMIN_ROUTES.EDUCATION_VIEW} element={<ViewEducationPage />} />
        </Routes>
    );
};

export default EducationRoutes;