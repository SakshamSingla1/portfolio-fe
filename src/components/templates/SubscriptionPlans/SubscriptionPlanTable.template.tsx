import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type SubscriptionPlanResponseDTO } from "../../../services/useSubscriptionPlanService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaLayerGroup } from "react-icons/fa";

interface SubscriptionPlanTableTemplateProps {
    plans: SubscriptionPlanResponseDTO[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
    onDelete: (id: number) => void;
    isLoading?: boolean;
}

const SubscriptionPlanTableTemplate: React.FC<SubscriptionPlanTableTemplateProps> = ({
    plans,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent,
    onDelete,
    isLoading,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = useCallback((id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(makeRoute(ADMIN_ROUTES.SUBSCRIPTION_PLAN_EDIT, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const handleView = useCallback((id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(makeRoute(ADMIN_ROUTES.SUBSCRIPTION_PLAN_VIEW, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const formatPrice = (value: number, currency: string) =>
        `${currency ?? ""} ${Number(value ?? 0).toFixed(2)}`;

    const records = useMemo(() => plans?.map((plan, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <span key={`name-${plan.id}`} className="font-medium">
            {plan.name}{plan.isDefault ? " (default)" : ""}
        </span>,
        plan.code,
        formatPrice(plan.priceMonthly, plan.currency),
        formatPrice(plan.priceYearly, plan.currency),
        <ResourceStatus key={`status-${plan.id}`} status={plan.status} />,
        <ActionButtons
            key={plan.id}
            onEdit={() => handleEdit(plan.id)}
            onView={() => handleView(plan.id)}
            onDelete={() => plan.id != null && onDelete(plan.id)}
        />,
    ]) ?? [], [plans, pagination.currentPage, pagination.pageSize, handleEdit, handleView, onDelete]);

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
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
            { label: "Plan Name", key: "name", type: "custom" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Code", key: "code", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Monthly", key: "priceMonthly", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Yearly", key: "priceYearly", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const, hideOnMobile: true },
            { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true,
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Subscription Plans"
            icon={<FaLayerGroup />}
            description="Pricing tiers and the modules each one unlocks"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Plan"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.SUBSCRIPTION_PLAN_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={schema} records={records} isLoading={isLoading} />
        </ListingShell>
    );
};

export default SubscriptionPlanTableTemplate;
