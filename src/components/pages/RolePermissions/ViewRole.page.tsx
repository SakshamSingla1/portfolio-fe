import React, { useEffect, useState } from "react";
import { type RolePermissionResponseDTO, useRoleService } from "../../../services/useRoleService";
import RoleFormTemplate from "../../templates/Roles/RoleForm.template";
import { useParams } from "react-router-dom";
import { MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const ViewRolePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { showSnackbar } = useSnackbar();

    const roleService = useRoleService();

    const [roleDetails, setRoleDetails] = useState<RolePermissionResponseDTO | null>(null);

    const loadRoleDetails = async (id: number | null) => {
        try {
            const response = await roleService.getRolePermissionsByRoleId(id);
            if (response.status === HTTP_STATUS.OK) {
                setRoleDetails(response.data.data);
            }
        } catch {
            showSnackbar("error", "Failed to load role details");
        }
    }

    useEffect(() => {
        if (id) {
            loadRoleDetails(id ? Number(id) : null);
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