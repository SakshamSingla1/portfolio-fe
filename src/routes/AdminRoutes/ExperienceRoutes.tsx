import { Route, Routes } from "react-router-dom";
import ListingExperiencePage from "../../components/pages/Experience/ListingExperiences.page";
import AddExperiencePage from "../../components/pages/Experience/AddExperience.page";
import EditExperiencePage from "../../components/pages/Experience/EditExperience.page";
import ViewExperiencePage from "../../components/pages/Experience/ViewExperience.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const ExperienceRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.EXPERIENCE} element={<ListingExperiencePage />} />
            <Route path={ADMIN_ROUTES.EXPERIENCE_ADD} element={<AddExperiencePage />} />
            <Route path={ADMIN_ROUTES.EXPERIENCE_EDIT} element={<EditExperiencePage />} />
            <Route path={ADMIN_ROUTES.EXPERIENCE_VIEW} element={<ViewExperiencePage />} />
        </Routes>
    );
};

export default ExperienceRoutes;