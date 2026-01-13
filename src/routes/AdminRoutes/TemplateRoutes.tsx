import { Route, Routes } from "react-router-dom";
import ListingTemplatesPage from "../../components/pages/Templates/TemplatesListing.page";
import AddTemplatePage from "../../components/pages/Templates/TemplateCreate.page";
import EditTemplatePage from "../../components/pages/Templates/TemplateEdit.page";
import ViewTemplatePage from "../../components/pages/Templates/TemplateView.page";

const TemplateRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingTemplatesPage />} />
            <Route path="add" element={<AddTemplatePage />} />
            <Route path=":name/edit" element={<EditTemplatePage />} />
            <Route path=":name" element={<ViewTemplatePage />} />
        </Routes>
    );
};

export default TemplateRoutes;