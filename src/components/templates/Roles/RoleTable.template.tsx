import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type RoleListResponseDTO } from "../../../services/useRoleService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface RoleTableTemplateProps {
    users: RoleListResponseDTO[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
}

const RoleTableTemplate: React.FC<RoleTableTemplateProps> = ({ 
    users, 
    pagination, 
    handlePaginationChange, 
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = (id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.ROLE_EDIT, { query, params: { id: String(id) } }));
    }

    const handleView = (id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.ROLE_VIEW, { query, params: { id: String(id) } }));
    }

    const Action = (role: RoleListResponseDTO) => <ActionButtons onEdit={() => handleEdit(role.id)} onView={() => handleView(role.id)} />;

    const getRecords = () => users?.map((role: RoleListResponseDTO, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        role.name,
        role.description || '-',
        <ResourceStatus status={role.status} />,
        new Date(role.createdAt).toLocaleDateString(),
        Action(role)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Role Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Description", key: "description", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Created Date", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const, hideOnMobile: true },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ]

    const getSchema = () => ({
        id: 1,
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns(),
        hover: true,
        striped: true
    });

    return (
        <ListingShell 
            title="Roles" 
            description="User roles and permissions" 
            count={pagination.totalRecords} 
            isAddButtonVisible={true} 
            addButtonLabel="Add Role" 
            addButtonOnClick={() => navigate(ADMIN_ROUTES.ROLE_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default RoleTableTemplate;