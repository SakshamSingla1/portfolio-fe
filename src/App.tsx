import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from './hooks/useAuthenticatedUser';

// Admin Layout 
import { ADMIN_ROUTES } from './utils/constant';
import { ThemeProvider } from 'react-jss';
import { defaultTheme } from './utils/theme';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';
import Login from './components/pages/Authentication/Login.page';
import AdminLayout from './layouts/AdminLayout';
import Register from './components/pages/Authentication/Register.page';
import ForgotPasswordPage from './components/pages/Authentication/ForgotPassword.page';
import ResetPasswordPage from './components/pages/Authentication/ResetPassword.page';
import ProfilePage from './components/pages/Profile/Profile.page';

import { SnackbarProvider } from './contexts/SnackbarContext';
import EditSkillPage from './components/pages/Skill/EditSkill.page';
import AddSkillPage from './components/pages/Skill/AddSkill.page';
import ViewSkillPage from './components/pages/Skill/ViewSkill.page';
import ListingSkillsPage from './components/pages/Skill/ListingSkills.page';

import AddEducationPage from './components/pages/Education/AddEducation.page';
import EditEducationPage from './components/pages/Education/EditEducation.page';
import ViewEducationPage from './components/pages/Education/ViewEducation.page';
import ListingEducationPage from './components/pages/Education/ListingEducation.page';

import AddExperiencePage from './components/pages/Experience/AddExperience.page';
import EditExperiencePage from './components/pages/Experience/EditExperience.page';
import ViewExperiencePage from './components/pages/Experience/ViewExperience.page';
import ListingExperiencesPage from './components/pages/Experience/ListingExperiences.page';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const hideLayout = [
    ADMIN_ROUTES.LOGIN,
    ADMIN_ROUTES.REGISTER,
    ADMIN_ROUTES.FORGOT_PASSWORD,
    ADMIN_ROUTES.RESET_PASSWORD,
    ...Object.values(ADMIN_ROUTES).filter(route => route !== ADMIN_ROUTES.LOGIN && route !== ADMIN_ROUTES.REGISTER && route !== ADMIN_ROUTES.FORGOT_PASSWORD && route !== ADMIN_ROUTES.RESET_PASSWORD)
  ].some(route => location.pathname.startsWith(route.split('/')[1]));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

const AuthRedirect = () => {
  const { user } = useAuthenticatedUser();
  return user ?
    <Navigate to={ADMIN_ROUTES.PROFILE} replace /> :
    <Navigate to="/users" replace />;
};

// Main App component
const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthenticatedUserProvider>
        <SnackbarProvider>
          <MainLayout>
            <Routes>
              {/* Authentication Routes */}
              <Route path={ADMIN_ROUTES.REGISTER} element={<Register />} />
              <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
              <Route path={ADMIN_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ADMIN_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

              {/* Protected admin routes */}
              <Route element={<AdminLayout />}>
                {/* 
                  <Route path={ADMIN_ROUTES.CONTACT_US} element={<ContactUsListingPage />} />

                  <Route path={ADMIN_ROUTES.PROJECTS}>
                    <Route index element={<ProjectListingPage />} />
                    <Route path="add" element={<ProjectAddDetailsPage />} />
                    <Route path=":id/edit" element={<ProjectEditDetailsPage />} />
                    <Route path=":id" element={<ProjectViewDetailsPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.SKILL}>
                    <Route index element={<SkillListingPage />} />
                    <Route path="add" element={<SkillAddDetailsPage />} />
                    <Route path=":id/edit" element={<SkillEditDetailsPage />} />
                    <Route path=":id" element={<SkillViewDetailsPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.SETTINGS} element={<SettingsPage />} /> */}
                <Route path={ADMIN_ROUTES.SKILL}>
                  <Route index element={<ListingSkillsPage />} />
                  <Route path="add" element={<AddSkillPage />} />
                  <Route path=":id/edit" element={<EditSkillPage />} />
                  <Route path=":id" element={<ViewSkillPage />} />
                </Route>

                <Route path={ADMIN_ROUTES.EDUCATION}>
                  <Route index element={<ListingEducationPage />} />
                  <Route path="add" element={<AddEducationPage />} />
                  <Route path=":id/edit" element={<EditEducationPage />} />
                  <Route path=":id" element={<ViewEducationPage />} />
                </Route>

                <Route path={ADMIN_ROUTES.EXPERIENCE}>
                    <Route index element={<ListingExperiencesPage />} />
                    <Route path="add" element={<AddExperiencePage />} />
                    <Route path=":id/edit" element={<EditExperiencePage />} />
                    <Route path=":id" element={<ViewExperiencePage />} />
                  </Route>

                <Route path={ADMIN_ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path="/" element={<Navigate to={ADMIN_ROUTES.PROFILE} replace />} />
              </Route>
            </Routes>
          </MainLayout>
        </SnackbarProvider>
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
};

export default App;