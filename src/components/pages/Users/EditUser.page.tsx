import React from "react";
import UserFormTemplate from "../../templates/Users/UserForm.template";
import { MODE } from "../../../utils/constant";
import { useProfileService, type UserResponse } from "../../../services/useProfileService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../../hooks/useSnackBar";

const EditUserPage: React.FC = () => {

    const { id } = useParams();

    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();

    const [user, setUserTo] = useState<UserResponse | null>(null);

    const loadUser = async () => {
        try {
            const response = await profileService.getUserById(id ? Number(id) : null);
            setUserTo(response.data.data);
        } catch {
            showSnackbar("error", "Failed to load user details");
        }
    }

    useEffect(() => {
        loadUser();
    }, [])

    return (
        <UserFormTemplate mode={MODE.EDIT} user={user} />
    );
};

export default EditUserPage;