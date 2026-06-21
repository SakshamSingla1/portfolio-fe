import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackBar';
import axiosRetry from '../axios-retry';
import axios from 'axios';
import useRouteValidate from '../hooks/useRouteValidate';
import DashboardLayout from '../layouts/DashboardLayout';

const ExperienceRoutes = lazy(() => import('./AdminRoutes/ExperienceRoutes'));
const EducationRoutes = lazy(() => import('./AdminRoutes/EducationRoutes'));
const ProjectRoutes = lazy(() => import('./AdminRoutes/ProjectRoutes'));
const SkillRoutes = lazy(() => import('./AdminRoutes/SkillRoutes'));
const ContactUsRoutes = lazy(() => import('./AdminRoutes/ContactUsRoutes'));
const SettingRoutes = lazy(() => import('./AdminRoutes/SettingRoutes'));
const ProfileRoutes = lazy(() => import('./AdminRoutes/ProfileRoutes'));
const NavLinkRoutes = lazy(() => import('./AdminRoutes/NavLinkRoutes'));
const ColorThemeRoutes = lazy(() => import('./AdminRoutes/ColorThemeRoutes'));
const TemplateRoutes = lazy(() => import('./AdminRoutes/TemplateRoutes'));
const ResumeRoutes = lazy(() => import('./AdminRoutes/ResumeRouter'));
const SocialLinkRoutes = lazy(() => import('./AdminRoutes/SocialLinkRoutes'));
const CertificationRoutes = lazy(() => import('./AdminRoutes/CertificationRoutes'));
const TestimonialRoutes = lazy(() => import('./AdminRoutes/TestimonialRoutes'));
const AchievementRoutes = lazy(() => import('./AdminRoutes/AchievementRoutes'));
const DashboardRoutes = lazy(() => import('./AdminRoutes/DashboardRoutes'));
const LogoRoutes = lazy(() => import('./AdminRoutes/LogoRoutes'));
const UserRoutes = lazy(() => import('./AdminRoutes/UserRoutes'));
const RoleRoutes = lazy(() => import('./AdminRoutes/RoleRoutes'));
const HelpRoutes = lazy(() => import('./AdminRoutes/HelpRoutes'));
const LandingPage = lazy(() => import('../components/pages/Landing/Landing.page'));

export const AdminRouter: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const snackbarRef = useRef(showSnackbar);
  snackbarRef.current = showSnackbar;

  useRouteValidate();

  useEffect(() => {
    axiosRetry(axios, {
      retryDelay: () => 1000,
      retryCondition: (error: any) => {
        if (error.response) {
          if (error.response.status >= 500 && error.response.status < 600) {
            return true;
          } else if (
            error.response.status >= 400 &&
            !error.response?.data.exceptionCode &&
            error.response.status < 500
          ) {
            snackbarRef.current('error', (error.response?.data as any).statusMessage);
          }
        }
        return false;
      },
      onMaxRetryTimesExceeded: (error) => {
        const status = error.response && error.response.status;
        if (status === 301 || status === 302 || status === 307 || status === 308) {
          snackbarRef.current('error', 'CORS Error: Access to the resource is blocked by CORS policy.');
        } else if (error.response?.data) {
          snackbarRef.current('error',
            (error.response?.data as any).statusMessage || (error.response?.data as any)
          );
        } else {
          snackbarRef.current('error', 'Something went wrong!');
        }
      },
    });
  }, []);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/*" element={<DashboardLayout />} >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile/*" element={<div><ProfileRoutes /></div>} />
          <Route path="experience/*" element={<div><ExperienceRoutes /></div>} />
          <Route path="education/*" element={<div><EducationRoutes /></div>} />
          <Route path="projects/*" element={<div><ProjectRoutes /></div>} />
          <Route path="skills/*" element={<div><SkillRoutes /></div>} />
          <Route path="messages/*" element={<div><ContactUsRoutes /></div>} />
          <Route path="settings/*" element={<div><SettingRoutes /></div>} />
          <Route path="navlinks/*" element={<div><NavLinkRoutes /></div>} />
          <Route path="themes/*" element={<div><ColorThemeRoutes /></div>} />
          <Route path="notifications/*" element={<div><TemplateRoutes /></div>} />
          <Route path="resumes/*" element={<div><ResumeRoutes /></div>} />
          <Route path="social-links/*" element={<div><SocialLinkRoutes /></div>} />
          <Route path="certifications/*" element={<div><CertificationRoutes /></div>} />
          <Route path="testimonials/*" element={<div><TestimonialRoutes /></div>} />
          <Route path="achievements/*" element={<div><AchievementRoutes /></div>} />
          <Route path="dashboard/*" element={<div><DashboardRoutes /></div>} />
          <Route path="logos/*" element={<div><LogoRoutes /></div>} />
          <Route path="users/*" element={<div><UserRoutes /></div>} />
          <Route path="roles-permissions/*" element={<div><RoleRoutes /></div>} />
          <Route path="help/*" element={<div><HelpRoutes /></div>} />
        </Route>
        {/* Renders without admin chrome — full-screen landing preview */}
        <Route path="landing" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
