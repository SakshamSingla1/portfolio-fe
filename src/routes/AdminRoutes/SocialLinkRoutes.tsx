import { Route, Routes } from "react-router-dom";
import ListingSocialLinksPage from "../../components/pages/SocialLinks/ListingSocialLinks.page";
import AddSocialLinkPage from "../../components/pages/SocialLinks/AddSocialLink.page";
import EditSocialLinkPage from "../../components/pages/SocialLinks/EditSocialLink.page";
import ViewSocialLinkPage from "../../components/pages/SocialLinks/ViewSocialLink.page";

const SocialLinkRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingSocialLinksPage />} />
            <Route path="add" element={<AddSocialLinkPage />} />
            <Route path="edit/:id" element={<EditSocialLinkPage />} />
            <Route path=":id" element={<ViewSocialLinkPage />} />
        </Routes>
    );
};

export default SocialLinkRoutes;