import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PermissionGuard from "../PermissionGuard";

const ListingSkillsPage = lazy(() => import("../../components/pages/Skill/ListingSkills.page"));
const AddSkillPage = lazy(() => import("../../components/pages/Skill/AddSkill.page"));
const EditSkillPage = lazy(() => import("../../components/pages/Skill/EditSkill.page"));
const ViewSkillPage = lazy(() => import("../../components/pages/Skill/ViewSkill.page"));

const SkillRoutes = () => {
    return (
        <Suspense fallback={null}>
        <Routes>
            <Route index element={<PermissionGuard required="VIEW"><ListingSkillsPage /></PermissionGuard>} />
            <Route path="add" element={<PermissionGuard required="ADD"><AddSkillPage /></PermissionGuard>} />
            <Route path=":id/edit" element={<PermissionGuard required="EDIT"><EditSkillPage /></PermissionGuard>} />
            <Route path=":id" element={<PermissionGuard required="VIEW"><ViewSkillPage /></PermissionGuard>} />
        </Routes>
        </Suspense>
    );
};

export default SkillRoutes;