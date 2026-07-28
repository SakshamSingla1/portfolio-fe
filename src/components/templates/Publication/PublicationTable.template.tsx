import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination, useColors } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import type { Publication } from "../../../services/usePublicationService";
import { DateUtils } from "../../../utils/helper";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { TbFileText } from "react-icons/tb";

interface TypeBadgeProps {
    type: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
    const themeColors = useColors();
    const TYPE_TOKENS: Record<string, string> = {
        PAPER: themeColors.primary600 ?? themeColors.primary500,
        ARTICLE: themeColors.success700 ?? themeColors.success500,
        TALK: themeColors.secondary600 ?? themeColors.secondary500,
        VIDEO: themeColors.error600 ?? themeColors.error500,
        PODCAST: themeColors.warning700 ?? themeColors.warning500,
    };
    const text = TYPE_TOKENS[type] ?? themeColors.neutral600;
    return (
        <span
            style={{
                background: `${text}18`,
                color: text,
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                display: "inline-block",
            }}
        >
            {type}
        </span>
    );
};

interface IPublicationTableTemplateProps {
    publications: Publication[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const PublicationListTableTemplate: React.FC<IPublicationTableTemplateProps> = ({
    publications,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(
            makeRoute(ADMIN_ROUTES.PUBLICATIONS_EDIT, {
                params: { id },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        };
        navigate(
            makeRoute(ADMIN_ROUTES.PUBLICATIONS_VIEW, {
                params: { id },
                query: query
            })
        );
    }, [navigate, searchParams]);

    const records = useMemo(() => publications.map((pub, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <span key={`title-${pub.id}`}>{pub.title} <TypeBadge type={pub.type} /></span>,
        pub.publisher ?? "—",
        pub.publishedDate ?? "—",
        DateUtils.dateTimeSecondToDate(pub.createdAt ?? ""),
        <ActionButtons key={pub.id} onEdit={() => handleEdit(pub.id ?? 0)} onView={() => handleView(pub.id ?? 0)} />
    ]) ?? [], [publications, pagination.currentPage, pagination.pageSize, handleEdit, handleView]);

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
            { label: "Title", key: "title", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Publisher", key: "publisher", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Published Date", key: "publishedDate", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Created At", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Publications"
            icon={<TbFileText />}
            description="Papers, articles, talks, and other publications"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Publication"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.PUBLICATIONS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default PublicationListTableTemplate;
