import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { StatusOptions, type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import { type TemplateResponse } from "../../../services/useTemplateService";
import { FiEdit, FiEye } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import ListingShell from "../Shared/ListingShell.template";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface TemplateListTableTemplateProps {
    templates: TemplateResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const TemplateListTableTemplate: React.FC<TemplateListTableTemplateProps> = ({ 
    templates, 
    pagination, 
    handlePaginationChange, 
    handleRowsPerPageChange,
    searchValue,
    onSearchChange
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = (name: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_EDIT, { query, params: { name: name } }));
    }

    const handleView = (name: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_VIEW, { query, params: { name: name } }));
    }

    const Action = (name: string) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
                <button onClick={() => handleEdit(name)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(name)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => templates?.map((template: TemplateResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        template.name,
        template.subject,
        template.type,
        DateUtils.dateTimeSecondToDate(template.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(template.updatedAt ?? ""),
        StatusOptions.find((status) => status.value === template.status)?.label,
        Action(template.name ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Subject", key: "subject", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Type", key: "type", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
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
            title="Templates" 
            description="Portfolio templates and layouts" 
            count={pagination.totalRecords} 
            isAddButtonVisible={true} 
            addButtonLabel="Add Template" 
            addButtonOnClick={() => navigate(ADMIN_ROUTES.TEMPLATES_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default TemplateListTableTemplate;