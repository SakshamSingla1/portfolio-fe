import React, { useState, useEffect } from "react";
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

interface RoleTableTemplateProps {
    users: RoleListResponseDTO[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
}

const RoleTableTemplate: React.FC<RoleTableTemplateProps> = ({ users, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.ROLE_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.ROLE_VIEW, { query, params: { id: id } }));
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
        id: "1",
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

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <ListingShell title="Roles" description="User roles and permissions" count={pagination.totalRecords} accentColor="#0ea5e9">
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default RoleTableTemplate;