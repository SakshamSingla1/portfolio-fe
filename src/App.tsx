import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import EducationAddDetailsPage from './components/pages/Education/EducationAddDetails.page';
import EducationEditDetailsPage from './components/pages/Education/EducationEditDetails.page';
import EducationDetailsListingPage from './components/pages/Education/EducationDetailsListing.page';
import EducationDetailsViewPage from './components/pages/Education/EducationDetailsView.page';
import ContactUsListingPage from './components/pages/ContactUs/ContactUsListing.page';
import ProjectDetailsAddPage from './components/pages/Projects/ProjectDetailsAdd.page';
import ProjectListingPage from './components/pages/Projects/ProjectListing.page';
import ProjectDetailsViewPage from './components/pages/Projects/ProjectDetailsView.page';
import ProjectDetailsEditPage from './components/pages/Projects/ProjectDetailsEdit.page';
import ExperienceListingPage from './components/pages/Experience/ExperienceListing.page';
import ExperienceAddDetailsPage from './components/pages/Experience/ExperienceAddDetails.page';
import ExperienceEditDetailsPage from './components/pages/Experience/ExperienceEditDetails.page';
import ExperienceDetailsViewPage from './components/pages/Experience/ExperienceViewDetails.page';
import SkillListingPage from './components/pages/Skill/SkillListing.page';
import SkillAddDetailsPage from './components/pages/Skill/SkillAddDetails.page';
import SkillEditDetailsPage from './components/pages/Skill/SkillEditDetails.page';
import SkillViewDetailsPage from './components/pages/Skill/SkillViewDetails.page';

import { ADMIN_ROUTES } from './utils/constant';
import { ThemeProvider } from 'react-jss';
import { defaultTheme } from './utils/theme';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/pages/Login/Login';
import AdminLayout from './layouts/AdminLayout';
import Register from './components/pages/Register/Register';
import ProfilePage from './components/pages/Profile/Profile.page';

// Main layout component that includes NavBar and Footer
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Don't show NavBar and Footer on login/register pages or admin routes
  const hideLayout = [
    ADMIN_ROUTES.LOGIN,
    ADMIN_ROUTES.REGISTER,
    ...Object.values(ADMIN_ROUTES).filter(route => route !== ADMIN_ROUTES.LOGIN && route !== ADMIN_ROUTES.REGISTER)
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

// Main App component
const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthenticatedUserProvider>
        <MainLayout>
          <Routes>
            <Route path={ADMIN_ROUTES.REGISTER} element={<Register />} />
            <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
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
                  <Route path="add" element={<ProjectDetailsAddPage />} />
                  <Route path=":id/edit" element={<ProjectDetailsEditPage />} />
                  <Route path=":id" element={<ProjectDetailsViewPage />} />
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

                <Route path={ADMIN_ROUTES.PROFILE} element={<ProfilePage />} />

                <Route path="/" element={<Navigate to={ADMIN_ROUTES.PROFILE} replace />} />
              </Route>
            </Route>
            
            {/* Public routes */}
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
};

export default App;