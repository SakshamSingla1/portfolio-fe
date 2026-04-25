import React, { useEffect, useState } from "react";
import { type RolePermissionResponseDTO, useRoleService } from "../../../services/useRoleService";
import RoleFormTemplate from "../../templates/Roles/RoleForm.template";
import { useParams } from "react-router-dom";
import { MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";

const ViewRolePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const roleService = useRoleService();

    const [roleDetails, setRoleDetails] = useState<RolePermissionResponseDTO | null>(null);

    const loadRoleDetails = async (id: string) => {
        try {
            const response = await roleService.getRolePermissionsByRoleId(id);
            if (response.status === HTTP_STATUS.OK) {
                setRoleDetails(response.data.data);
            }
        } catch (error) {
            console.error('Error loading role details:', error);
        }
    }

    useEffect(() => {
        if (id) {
            loadRoleDetails(id);
        }
    }, [id]);

    return (
        <RoleFormTemplate
            mode={MODE.VIEW}
            roleDetails={roleDetails}
            onSubmit={() => { }}
        />
    );
};

export default ViewRolePage;