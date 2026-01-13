import { Route, Routes } from "react-router-dom";
import ListingSkillsPage from "../../components/pages/Skill/ListingSkills.page";
import AddSkillPage from "../../components/pages/Skill/AddSkill.page";
import EditSkillPage from "../../components/pages/Skill/EditSkill.page";
import ViewSkillPage from "../../components/pages/Skill/ViewSkill.page";
import { ADMIN_ROUTES } from "../../utils/constant";

const SkillRoutes = () => {
    return (
        <Routes>
            <Route index path={ADMIN_ROUTES.SKILL} element={<ListingSkillsPage />} />
            <Route path={ADMIN_ROUTES.SKILL_ADD} element={<AddSkillPage />} />
            <Route path={ADMIN_ROUTES.SKILL_EDIT} element={<EditSkillPage />} />
            <Route path={ADMIN_ROUTES.EDUCATION_VIEW} element={<ViewSkillPage />} />
        </Routes>
    );
};

export default SkillRoutes;