import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination, useColors } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { type ServiceOffering } from "../../../services/useServiceService";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { TbBriefcase } from "react-icons/tb";

interface ServiceTableProps {
    services: ServiceOffering[];
    pagination: IPagination;
    handlePaginationChange: (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue: string;
    onSearchChange: (val: string | null) => void;
    onDelete: (id: number) => void;
}

const ServiceTableTemplate: React.FC<ServiceTableProps> = ({
    services,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    onDelete,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const colors = useColors();

    const handleEdit = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(makeRoute(ADMIN_ROUTES.SERVICES_EDIT, { params: { id }, query }));
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(makeRoute(ADMIN_ROUTES.SERVICES_VIEW, { params: { id }, query }));
    }, [navigate, searchParams]);

    const records = useMemo(() => services.map((s, idx) => [
        pagination.currentPage * pagination.pageSize + idx + 1,
        <span key={`title-${s.id}`} className="flex items-center gap-2">
            {s.icon && <span className="text-lg">{s.icon}</span>}
            <span className="font-medium">{s.title}</span>
        </span>,
        s.priceRange || "—",
        s.deliveryTime || "—",
        <span
            key={`status-${s.id}`}
            style={{
                background: s.isActive ? `${colors.success500}18` : `${colors.error500}18`,
                color: s.isActive ? (colors.success700 ?? colors.success500) : (colors.error700 ?? colors.error500),
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                display: "inline-block",
            }}
        >
            {s.isActive ? "Active" : "Inactive"}
        </span>,
        <ActionButtons
            key={s.id}
            onEdit={() => handleEdit(s.id ?? 0)}
            onView={() => handleView(s.id ?? 0)}
            onDelete={() => onDelete(s.id ?? 0)}
        />,
    ]), [services, pagination.currentPage, pagination.pageSize, handleEdit, handleView, onDelete, colors]);

    const schema = useMemo(() => ({
        id: 1,
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange,
        },
        columns: [
            { label: "Sr No.", key: "srNo", type: "number" as ColumnType, props: {}, priority: "low" as const, hideOnMobile: true },
            { label: "Service", key: "title", type: "custom" as ColumnType, props: {}, priority: "high" as const },
            { label: "Price Range", key: "priceRange", type: "string" as ColumnType, props: {}, priority: "medium" as const },
            { label: "Delivery", key: "deliveryTime", type: "string" as ColumnType, props: {}, priority: "medium" as const },
            { label: "Status", key: "isActive", type: "custom" as ColumnType, props: {}, priority: "medium" as const },
            { label: "Actions", key: "actions", type: "custom" as ColumnType, props: {}, priority: "low" as const },
        ],
        hover: true,
        striped: true,
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Services"
            description="Manage the services you offer to clients"
            icon={<TbBriefcase />}
            isAddButtonVisible={true}
            addButtonLabel="Add Service"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.SERVICES_ADD)}
            searchValue={searchValue}
            onSearchChange={(val) => onSearchChange(val)}
            count={pagination.totalRecords}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default ServiceTableTemplate;
