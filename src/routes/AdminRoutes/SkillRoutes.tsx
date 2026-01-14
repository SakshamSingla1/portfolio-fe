import { Route, Routes } from "react-router-dom";
import ListingSkillsPage from "../../components/pages/Skill/ListingSkills.page";
import AddSkillPage from "../../components/pages/Skill/AddSkill.page";
import EditSkillPage from "../../components/pages/Skill/EditSkill.page";
import ViewSkillPage from "../../components/pages/Skill/ViewSkill.page";

const SkillRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingSkillsPage />} />
            <Route path="add" element={<AddSkillPage />} />
            <Route path="edit/:id" element={<EditSkillPage />} />
            <Route path=":id" element={<ViewSkillPage />} />
        </Routes>
    );
};

export default SkillRoutes;