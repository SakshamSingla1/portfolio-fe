import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import type { SocialLinkResponse } from "../../../services/useSocialLinkService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface SocialLinksTableTemplateProps {
    socialLinks: SocialLinkResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
}

const SocialLinksTableTemplate: React.FC<SocialLinksTableTemplateProps> = ({ 
    socialLinks, 
    pagination, 
    handlePaginationChange, 
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent
}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isMobile = useIsMobile();

    const handleEdit = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_EDIT, { query, params: { id: String(id) } }));
    }

    const handleView = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_VIEW, { query, params: { id: String(id) } }));
    }

    const Action = (id: number) => <ActionButtons onEdit={() => handleEdit(id)} onView={() => handleView(id)} />;

    const getRecords = () => socialLinks?.map((sl: SocialLinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        enumToNormalKey(sl.platform),
        sl.status,
        DateUtils.dateTimeSecondToDate(sl.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(sl.updatedAt ?? ""),
        Action(sl.id ?? 0)
    ]);

    const getTableColumns = () => [
        { label: "Sr No.", key: "serial", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Platform", key: "platform", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Updated At", key: "updatedAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Action", key: "id", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ];

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
            title="Social Links" 
            description="Online profiles and presence" 
            count={pagination.totalRecords} 
            isAddButtonVisible={true} 
            addButtonLabel="Add Social Link" 
            addButtonOnClick={() => navigate(ADMIN_ROUTES.SOCIAL_LINKS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default SocialLinksTableTemplate;