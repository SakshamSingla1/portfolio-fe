import { Route, Routes } from "react-router-dom";
import ExperienceRoutes from "./AdminRoutes/ExperienceRoutes";
import ColorThemeRoutes from "./AdminRoutes/ColorThemeRoutes";
import EducationRoutes from "./AdminRoutes/EducationRoutes";
import ProjectRoutes from "./AdminRoutes/ProjectRoutes";
import SkillRoutes from "./AdminRoutes/SkillRoutes";
import ContactUsRoutes from "./AdminRoutes/ContactUsRoutes";
import SettingRoutes from "./AdminRoutes/SettingRoutes";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="experience/*" element={<ExperienceRoutes />} />
            <Route path="color-theme/*" element={<ColorThemeRoutes />} />
            <Route path="education/*" element={<EducationRoutes />} />
            <Route path="project/*" element={<ProjectRoutes />} />
            <Route path="skill/*" element={<SkillRoutes />} />
            <Route path="contact-us/*" element={<ContactUsRoutes />} />
            <Route path="setting/*" element={<SettingRoutes />} />
        </Routes>
    );
};

export default AdminRoutes;