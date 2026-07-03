import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { type Logo } from '../../../services/useLogoService';
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaImage } from "react-icons/fa";

interface LogoTableTemplateProps {
    logos: Logo[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const LogoTableTemplate: React.FC<LogoTableTemplateProps> = ({
    logos,
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
        }
        navigate(makeRoute(ADMIN_ROUTES.LOGO_EDIT, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.LOGO_VIEW, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const records = useMemo(() => logos?.map((logo: Logo, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        logo.name,
        <img key={logo.id} src={logo.url} alt={logo.name} className="w-8 h-8 bg-[#FFFFFF] rounded-sm p-1" title={logo.name} />,
        DateUtils.dateTimeSecondToDate(logo.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(logo.updatedAt ?? ""),
        <ActionButtons key={`action-${logo.id}`} onEdit={() => handleEdit(logo.id ?? 0)} onView={() => handleView(logo.id ?? 0)} />
    ]) ?? [], [logos, pagination.currentPage, pagination.pageSize, handleEdit, handleView]);

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
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: 'low' as const, hideOnMobile: true },
            { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: 'high' as const },
            { label: "Image", key: "image", type: "image" as ColumnType, props: { className: '' }, priority: 'medium' as const },
            { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
            { label: "Updated At", key: "updatedAt", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Logos"
            icon={<FaImage />}
            description="Technology logos and icons"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Logo"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.LOGO_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    )
}
export default LogoTableTemplate;
