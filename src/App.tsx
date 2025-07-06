import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      <Route
        path={ADMIN_ROUTES.EDUCATION_ADD}
        element={<EducationAddDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.EDUCATION_EDIT}
        element={<EducationEditDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.EDUCATION_VIEW}
        element={<EducationDetailsViewPage />}
      />
      <Route
        path={ADMIN_ROUTES.EDUCATION}
        element={<EducationDetailsListingPage />}
      />
      <Route
        path={ADMIN_ROUTES.CONTACT_US}
        element={<ContactUsListingPage />}
      />
      <Route
        path={ADMIN_ROUTES.PROJECTS}
        element={<ProjectListingPage />}
      />
      <Route
        path={ADMIN_ROUTES.PROJECTS_ADD}
        element={<ProjectDetailsAddPage />}
      />
      <Route
        path={ADMIN_ROUTES.PROJECTS_EDIT}
        element={<ProjectDetailsEditPage />}
      />
      <Route
        path={ADMIN_ROUTES.PROJECTS_VIEW}
        element={<ProjectDetailsViewPage />}
      />
      <Route
        path={ADMIN_ROUTES.EXPERIENCE}
        element={<ExperienceListingPage />}
      />
      <Route
        path={ADMIN_ROUTES.EXPERIENCE_ADD}
        element={<ExperienceAddDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.EXPERIENCE_EDIT}
        element={<ExperienceEditDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.EXPERIENCE_VIEW}
        element={<ExperienceDetailsViewPage />}
      />
      <Route
        path={ADMIN_ROUTES.SKILL}
        element={<SkillListingPage />}
      />
      <Route
        path={ADMIN_ROUTES.SKILL_ADD}
        element={<SkillAddDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.SKILL_EDIT}
        element={<SkillEditDetailsPage />}
      />
      <Route
        path={ADMIN_ROUTES.SKILL_VIEW}
        element={<SkillViewDetailsPage />}
      />
    </Routes>
  );
}

export default App;