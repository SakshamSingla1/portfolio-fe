import { Route, Routes } from "react-router-dom";
import ListingExperiencePage from "../../components/pages/Experience/ListingExperiences.page";
import AddExperiencePage from "../../components/pages/Experience/AddExperience.page";
import EditExperiencePage from "../../components/pages/Experience/EditExperience.page";
import ViewExperiencePage from "../../components/pages/Experience/ViewExperience.page";

const ExperienceRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingExperiencePage />} />
            <Route path="add" element={<AddExperiencePage />} />
            <Route path=":id/edit" element={<EditExperiencePage />} />
            <Route path=":id" element={<ViewExperiencePage />} />
        </Routes>
    );
};

export default ExperienceRoutes;