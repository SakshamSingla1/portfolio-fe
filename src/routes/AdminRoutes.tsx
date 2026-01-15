import { Routes, Route, Navigate } from 'react-router-dom';
import ExperienceRoutes from './AdminRoutes/ExperienceRoutes';
import EducationRoutes from './AdminRoutes/EducationRoutes';
import ProjectRoutes from './AdminRoutes/ProjectRoutes';
import SkillRoutes from './AdminRoutes/SkillRoutes';
import ContactUsRoutes from './AdminRoutes/ContactUsRoutes';
import SettingRoutes from './AdminRoutes/SettingRoutes';
import ProfileRoutes from './AdminRoutes/ProfileRoutes';
import NavLinkRoutes from './AdminRoutes/NavLinkRoutes';
import ColorThemeRoutes from './AdminRoutes/ColorThemeRoutes';
import TemplateRoutes from './AdminRoutes/TemplateRoutes';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="profile" replace />} />
      <Route path="profile" element={<div><ProfileRoutes /></div>} />
      <Route path="experience/*" element={<div><ExperienceRoutes /></div>} />
      <Route path="education/*" element={<div><EducationRoutes /></div>} />
      <Route path="projects/*" element={<div><ProjectRoutes /></div>} />
      <Route path="skills/*" element={<div><SkillRoutes /></div>} />
      <Route path="contact-us/*" element={<div><ContactUsRoutes /></div>} />
      <Route path="settings/*" element={<div><SettingRoutes /></div>} />
      <Route path="navlinks/*" element={<div><NavLinkRoutes /></div>} />
      <Route path="color-themes/*" element={<div><ColorThemeRoutes /></div>} />
      <Route path="templates/*" element={<div><TemplateRoutes /></div>} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
};

export default AdminRoutes;