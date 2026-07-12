import React from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { type ServiceOffering } from "../../../services/useServiceService";
import { type IPagination } from "../../../utils/types";
import ListingShell from "../Shared/ListingShell.template";
import TableV1 from "../../molecules/TableV1/TableV1";
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

    const columns = [
        { key: "srNo", label: "Sr No." },
        { key: "title", label: "Service" },
        { key: "priceRange", label: "Price Range" },
        { key: "deliveryTime", label: "Delivery" },
        { key: "isActive", label: "Active" },
        { key: "actions", label: "Actions" },
    ];

    const rows = services.map((s, idx) => ({
        srNo: (pagination.currentPage * pagination.pageSize) + idx + 1,
        title: (
            <div className="flex items-center gap-2">
                {s.icon && <span className="text-lg">{s.icon}</span>}
                <span className="font-medium">{s.title}</span>
            </div>
        ),
        priceRange: s.priceRange || "—",
        deliveryTime: s.deliveryTime || "—",
        isActive: (
            <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                    background: s.isActive ? "#d1fae5" : "#fee2e2",
                    color: s.isActive ? "#065f46" : "#991b1b",
                }}
            >
                {s.isActive ? "Active" : "Inactive"}
            </span>
        ),
        actions: null,
        _id: s.id,
    }));

    return (
        <ListingShell
            title="Services"
            subtitle="Manage the services you offer to clients"
            icon={<TbBriefcase />}
            addRoute={ADMIN_ROUTES.SERVICES_ADD}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1
                columns={columns}
                rows={rows}
                pagination={pagination}
                onPageChange={handlePaginationChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onView={(id) => navigate(ADMIN_ROUTES.SERVICES_VIEW.replace(":id", String(id)))}
                onEdit={(id) => navigate(ADMIN_ROUTES.SERVICES_EDIT.replace(":id", String(id)))}
                onDelete={(id) => onDelete(id as number)}
            />
        </ListingShell>
    );
};

export default ServiceTableTemplate;
