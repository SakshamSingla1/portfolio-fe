import React from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import { ADMIN_ROUTES } from "../../../utils/constant";
import type { Certification } from "../../../services/useCertificationService";
import { DateUtils } from "../../../utils/helper";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ICertificationsTableTemplateProps {
    certifications: Certification[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const CertificationsTableTemplate: React.FC<ICertificationsTableTemplateProps> = ({
    certifications,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const handleEdit = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.CERTIFICATIONS_EDIT, {
                params: { id },
                query: query
            })
        );
    }

    const handleView = (id: number) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.CERTIFICATIONS_VIEW, {
                params: { id },
                query: query
            })
        );
    }

    const Action = (id: number) => <ActionButtons onEdit={() => handleEdit(id)} onView={() => handleView(id)} />;

    const getRecords = () =>
        certifications.map((certification, index) => {
            const issue = certification.issueDate ?? "";
            const expiry = certification.expiryDate ?? "Present";
            const duration = issue || expiry ? `${issue} - ${expiry}` : "";
            return [
                pagination.currentPage * pagination.pageSize + index + 1,
                `${certification.title} - ${certification.order}`,
                certification.issuer,
                duration,
                DateUtils.dateTimeSecondToDate(certification.createdAt ?? ""),
                DateUtils.dateTimeSecondToDate(certification.updatedAt ?? ""),
                Action(certification.id ?? 0)
            ];
        });

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Issuer", key: "issuer", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Created At", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Updated At", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
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
            title="Certifications"
            description="Professional certifications"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Certification"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.CERTIFICATIONS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default CertificationsTableTemplate;