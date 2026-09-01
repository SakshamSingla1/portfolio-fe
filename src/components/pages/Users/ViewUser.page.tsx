import React, { useEffect, useState } from "react";
import UserFormTemplate from "../../templates/Users/UserForm.template";
import { MODE } from "../../../utils/constant";
import { useProfileService, type UserResponse } from "../../../services/useProfileService";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackBar";

const ViewUserPage: React.FC = () => {

    const { id } = useParams();

    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();

    const [user,setUserTo] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const response = await profileService.getUserById(id ? Number(id) : null);
                setUserTo(response.data.data);
            } catch {
                showSnackbar("error", "Failed to load user details");
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, [id, profileService, showSnackbar])

    if (isLoading) {
        return <UserFormTemplate mode={MODE.VIEW} user={null} isLoading />;
    }

    return (
        <UserFormTemplate mode={MODE.VIEW} user={user} />
    );
};

export default ViewUserPage;