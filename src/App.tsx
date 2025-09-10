import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from './hooks/useAuthenticatedUser';

// Education Routes 
import EducationAddDetailsPage from './components/admin/pages/Education/EducationAddDetails.page';
import EducationEditDetailsPage from './components/admin/pages/Education/EducationEditDetails.page';
import EducationDetailsListingPage from './components/admin/pages/Education/EducationDetailsListing.page';
import EducationDetailsViewPage from './components/admin/pages/Education/EducationDetailsView.page';

// Contact Us Routes 
import ContactUsListingPage from './components/admin/pages/ContactUs/ContactUsListing.page';

// Project Routes 
import ProjectListingPage from './components/admin/pages/Project/ProjectListing.page';
import ProjectAddDetailsPage from './components/admin/pages/Project/ProjectAdd.page';
import ProjectEditDetailsPage from './components/admin/pages/Project/ProjectEdit.page';
import ProjectViewDetailsPage from './components/admin/pages/Project/ProjectView.page';

// Experience Routes 
import ExperienceListingPage from './components/admin/pages/Experience/ExperienceListing.page';
import ExperienceAddDetailsPage from './components/admin/pages/Experience/ExperienceAddDetails.page';
import ExperienceEditDetailsPage from './components/admin/pages/Experience/ExperienceEditDetails.page';
import ExperienceDetailsViewPage from './components/admin/pages/Experience/ExperienceViewDetails.page';

// Skill Routes 
import SkillListingPage from './components/admin/pages/Skill/SkillListing.page';
import SkillAddDetailsPage from './components/admin/pages/Skill/SkillAddDetails.page';
import SkillEditDetailsPage from './components/admin/pages/Skill/SkillEditDetails.page';
import SkillViewDetailsPage from './components/admin/pages/Skill/SkillViewDetails.page';

// Forgot Password Routes 
import ForgotPasswordPage from './components/admin/pages/ForgotPassword/ForgotPassword.page';
import ResetPasswordPage from './components/admin/pages/ResetPassword/ResetPassword.page';

// Users Layout 
import UsersLayout from './layouts/UsersLayout';

// Admin Layout 
import { ADMIN_ROUTES } from './utils/constant';
import { ThemeProvider } from 'react-jss';
import { defaultTheme } from './utils/theme';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/admin/pages/Login/Login';
import AdminLayout from './layouts/AdminLayout';
import Register from './components/admin/pages/Register/Register';
import ProfilePage from './components/admin/pages/Profile/Profile.page';
import { SnackbarProvider } from './contexts/SnackbarContext';
import SettingsPage from './components/admin/pages/Settings/Settings.page';

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
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path={ADMIN_ROUTES.EDUCATION}>
                    <Route index element={<EducationDetailsListingPage />} />
                    <Route path="add" element={<EducationAddDetailsPage />} />
                    <Route path=":degree/edit" element={<EducationEditDetailsPage />} />
                    <Route path=":degree" element={<EducationDetailsViewPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.CONTACT_US} element={<ContactUsListingPage />} />

                  <Route path={ADMIN_ROUTES.PROJECTS}>
                    <Route index element={<ProjectListingPage />} />
                    <Route path="add" element={<ProjectAddDetailsPage />} />
                    <Route path=":id/edit" element={<ProjectEditDetailsPage />} />
                    <Route path=":id" element={<ProjectViewDetailsPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.EXPERIENCE}>
                    <Route index element={<ExperienceListingPage />} />
                    <Route path="add" element={<ExperienceAddDetailsPage />} />
                    <Route path=":id/edit" element={<ExperienceEditDetailsPage />} />
                    <Route path=":id" element={<ExperienceDetailsViewPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.SKILL}>
                    <Route index element={<SkillListingPage />} />
                    <Route path="add" element={<SkillAddDetailsPage />} />
                    <Route path=":id/edit" element={<SkillEditDetailsPage />} />
                    <Route path=":id" element={<SkillViewDetailsPage />} />
                  </Route>

                  <Route path={ADMIN_ROUTES.SETTINGS} element={<SettingsPage />} />
                  <Route path={ADMIN_ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path="/" element={<Navigate to={ADMIN_ROUTES.PROFILE} replace />} />
                </Route>
              </Route>
            </Routes>
          </MainLayout>
        </SnackbarProvider>
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
};

export default App;