import React from "react";
import UserFormTemplate from "../../templates/Users/UserForm.template";
import { MODE } from "../../../utils/constant";
import { useProfileService, type UserResponse } from "../../../services/useProfileService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditUserPage: React.FC = () => {

    const { id } = useParams();

    const profileService = useProfileService();

    const [user, setUserTo] = useState<UserResponse | null>(null);

    const loadUser = async () => {
        try {
            const response = await profileService.getUserById(String(id));
            setUserTo(response.data.data);
        } catch (error) {
            console.error("Error loading user:", error);
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