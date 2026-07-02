import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { StatusOptions, type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type NavlinkResponse } from "../../../services/useNavlinkService";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { enumToNormalKey } from "../../../utils/helper";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface INavlinkListTableTemplateProps {
    navlinks: NavlinkResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
}

const NavlinkListTableTemplate: React.FC<INavlinkListTableTemplateProps> = ({
    navlinks,
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

    const handleEdit = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.NAVLINKS_EDIT, {
                params: { id: String(id) },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.NAVLINKS_VIEW, {
                params: { id: String(id) },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const records = useMemo(() => navlinks?.map((navlink: NavlinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        `${enumToNormalKey(navlink.name)} (${navlink.index})`,
        DateUtils.dateTimeSecondToDate(navlink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(navlink.updatedAt ?? ""),
        StatusOptions.find((status) => status.value === navlink.status)?.label,
        <ActionButtons key={navlink.id} onEdit={() => handleEdit(navlink.id ?? 0)} onView={() => handleView(navlink.id ?? 0)} />
    ]) ?? [], [navlinks, pagination.currentPage, pagination.pageSize, handleEdit, handleView]);

    const schema = useMemo(() => ({
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
        columns: [
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
            { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Navigation Links"
            description="Portfolio navigation menu"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Navigation Link"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.NAVLINKS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    )
}
export default NavlinkListTableTemplate;
