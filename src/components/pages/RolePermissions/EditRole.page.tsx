import React, { useEffect, useState } from "react";
import { type RolePermissionResponseDTO, type RoleRequestBodyDTO, useRoleService } from "../../../services/useRoleService";
import RoleFormTemplate from "../../templates/Roles/RoleForm.template";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { HTTP_STATUS } from "../../../utils/types";

const EditRolePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
   
    const roleService = useRoleService();

    const [roleDetails, setRoleDetails] = useState<RolePermissionResponseDTO | null>(null);

    const handleSubmit = async (values: RoleRequestBodyDTO) => {
        try {
            const response = await roleService.updateRole(id!, values);
            if(response.status === HTTP_STATUS.OK) {
                navigate(makeRoute(ADMIN_ROUTES.ROLE, {}));
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const loadRoleDetails = async (id: string) => {
        try {
            const response = await roleService.getRolePermissionsByRoleId(id);
            if(response.status === HTTP_STATUS.OK) {
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
            mode={MODE.EDIT}
            onSubmit={handleSubmit}
            roleDetails={roleDetails}
        />
    );
};

export default EditRolePage;