import React, { useMemo, useCallback, useState } from "react";
import { type ColumnType, type TableSelection } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { exportToCsv } from "../../../utils/csvExport";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell, { type BulkAction } from "../Shared/ListingShell.template";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ConfirmDialog from "../../molecules/ConfirmDialog/ConfirmDialog";
import { ADMIN_ROUTES } from "../../../utils/constant";
import type { Certification } from "../../../services/useCertificationService";
import { DateUtils } from "../../../utils/helper";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { usePermissionHelper } from "../../../hooks/usePermissionHelper";
import { FaCertificate } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

interface ICertificationsTableTemplateProps {
    certifications: Certification[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    isLoading?: boolean;
    onDelete?: (id: number) => void | Promise<void>;
    onBulkDelete?: (ids: number[]) => void | Promise<void>;
}

const CertificationsTableTemplate: React.FC<ICertificationsTableTemplateProps> = ({
    certifications,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    isLoading,
    onDelete,
    onBulkDelete,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const { canDelete } = usePermissionHelper();

    const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [actionBusy, setActionBusy] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const handleEdit = useCallback((id: number) => {
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
    }, [navigate, searchParams]);

    const handleView = useCallback((id: number) => {
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
    }, [navigate, searchParams]);

    const records = useMemo(() => certifications.map((certification, index) => {
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
            <ActionButtons
                key={certification.id}
                onEdit={() => handleEdit(certification.id ?? 0)}
                onView={() => handleView(certification.id ?? 0)}
                onDelete={onDelete && certification.id ? () => setDeleteTarget(certification) : undefined}
            />
        ];
    }) ?? [], [certifications, pagination.currentPage, pagination.pageSize, handleEdit, handleView, onDelete]);

    const selection: TableSelection | undefined = useMemo(() => onBulkDelete ? {
        selectedIds,
        getRowId: (_row, index) => certifications[index]?.id ?? index,
        onToggle: (id) => setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(Number(id))) next.delete(Number(id)); else next.add(Number(id));
            return next;
        }),
        onToggleAll: (ids) => setSelectedIds((prev) =>
            ids.every((id) => prev.has(Number(id))) ? new Set() : new Set(ids.map(Number))
        ),
    } : undefined, [onBulkDelete, selectedIds, certifications]);

    const bulkActions: BulkAction[] = useMemo(() => (canDelete && onBulkDelete) ? [
        { label: "Delete", icon: <FiTrash2 size={13} />, variant: "danger", onClick: () => setBulkDeleteConfirm(true) },
    ] : [], [canDelete, onBulkDelete]);

    const runDelete = async () => {
        if (!deleteTarget?.id || !onDelete) return;
        setActionBusy(true);
        try {
            await onDelete(deleteTarget.id);
        } finally {
            setActionBusy(false);
            setDeleteTarget(null);
        }
    };

    const runBulkDelete = async () => {
        if (!onBulkDelete) return;
        setActionBusy(true);
        try {
            await onBulkDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
        } finally {
            setActionBusy(false);
            setBulkDeleteConfirm(false);
        }
    };

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
            { label: "Issuer", key: "issuer", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Created At", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Updated At", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Certifications"
            icon={<FaCertificate />}
            description="Professional certifications"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Certification"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.CERTIFICATIONS_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onExport={() => exportToCsv("certifications", certifications.map((c) => ({
                id: c.id, title: c.title, issuer: c.issuer, issueDate: c.issueDate,
                expiryDate: c.expiryDate, status: c.status, createdAt: c.createdAt,
            })))}
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            bulkActions={bulkActions}
        >
            <TableV1 schema={schema} records={records} isLoading={isLoading} selection={selection} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this certification?"
                message={<>This permanently removes <strong>{deleteTarget?.title}</strong>. This cannot be undone.</>}
                confirmLabel="Delete"
                danger
                loading={actionBusy}
                onConfirm={runDelete}
                onClose={() => setDeleteTarget(null)}
            />

            <ConfirmDialog
                open={bulkDeleteConfirm}
                title="Delete selected certifications?"
                message={<>This permanently removes <strong>{selectedIds.size}</strong> certification(s). This cannot be undone.</>}
                confirmLabel="Delete"
                danger
                loading={actionBusy}
                onConfirm={runBulkDelete}
                onClose={() => setBulkDeleteConfirm(false)}
            />
        </ListingShell>
    )
}
export default CertificationsTableTemplate;
