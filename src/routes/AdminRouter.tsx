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
import { useSnackbar } from '../hooks/useSnackBar';
import axiosRetry from '../axios-retry';
import axios from 'axios';
import useRouteValidate from '../hooks/useRouteValidate';
import DashboardLayout from '../layouts/DashboardLayout';

export const AdminRouter: React.FC = () => {

  const { showSnackbar } = useSnackbar();

  useRouteValidate();
  axiosRetry(axios, {
    retryDelay: () => {
      return 1000;
    },
    retryCondition: (error: any) => {
      if (error.response) {
        if (error.response.status >= 500 && error.response.status < 600) {
          return true;
        } else if (
          (error.response.status >= 400 && !!!error.response?.data.exceptionCode) &&
          error.response.status < 500
        ) {
          showSnackbar('error', (error.response?.data as any).statusMessage);
        }
      }
      return false;
    },
    onMaxRetryTimesExceeded: (error) => {
      const status = error.response && error.response.status;
      if (
        status === 301 ||
        status === 302 ||
        status === 307 ||
        status === 308
      ) {
        showSnackbar(
          'error',
          'CORS Error: Access to the resource  is blocked by  CORS policy.'
        );
      } else if (error.response?.data) {
        showSnackbar(
          'error',
          (error.response?.data as any).statusMessage ||
          (error.response?.data as any)
        );
      } else {
        showSnackbar('error', 'Something went wrong!');
      }
    },
  });

  return (
    <Routes>
      <Route path="/*" element={<DashboardLayout />} >
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
      </Route>
    </Routes>
  );
};

export default AdminRouter;