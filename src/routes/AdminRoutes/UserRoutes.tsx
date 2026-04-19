import { Route, Routes } from "react-router-dom";
import ListingUserPage from "../../components/pages/Users/ListingUsers.page";
import EditUserPage from "../../components/pages/Users/EditUser.page";
import ViewUserPage from "../../components/pages/Users/ViewUser.page";

const UserRoutes = () => {
    return (
        <Routes>
            <Route index element={<ListingUserPage />} />
            <Route path="/:id/edit" element={<EditUserPage />} />
            <Route path="/:id" element={<ViewUserPage />} />
        </Routes>
    );
};

export default UserRoutes;