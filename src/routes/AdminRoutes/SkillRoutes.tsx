import { Route, Routes } from "react-router-dom";
import ListingSkillsPage from "../../components/pages/Skill/ListingSkills.page";
import AddSkillPage from "../../components/pages/Skill/AddSkill.page";
import EditSkillPage from "../../components/pages/Skill/EditSkill.page";
import ViewSkillPage from "../../components/pages/Skill/ViewSkill.page";
import PermissionGuard from "../PermissionGuard";

const SkillRoutes = () => {
    return (
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingSkillsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddSkillPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditSkillPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewSkillPage /></PermissionGuard>} />
        </Routes>
    );
};

export default SkillRoutes;