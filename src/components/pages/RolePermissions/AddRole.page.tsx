import React from "react";
import { useRoleService, type RoleRequestBodyDTO } from "../../../services/useRoleService";
import RoleFormTemplate from "../../templates/Roles/RoleForm.template";
import { useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

const AddRolePage : React.FC = () => {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const roleService = useRoleService();

    const handleCreateRole = async (values: RoleRequestBodyDTO) => {
       try {
        const response = await roleService.createRole(values);
        if(response.status === HTTP_STATUS.OK) {
            navigate(makeRoute(ADMIN_ROUTES.ROLE, {}));
        }
       } catch {
        showSnackbar("error", "Failed to create role");
       }
    }
    return (
        <div>
            <RoleFormTemplate 
                mode={MODE.ADD}
                onSubmit={handleCreateRole}
            />
        </div>
    )

}

export default AddRolePage;
