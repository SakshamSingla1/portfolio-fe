import React, { useMemo, useCallback, useState } from "react";
import { type ColumnType, type TableSelection } from "../../organisms/Table/TableV1";
import { type IPagination, Status } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute, getOptimizedImageUrl } from "../../../utils/helper";
import { exportToCsv } from "../../../utils/csvExport";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell, { type BulkAction } from "../Shared/ListingShell.template";
import { type UserResponse } from "../../../services/useProfileService";
import { FiCheck, FiTrash2, FiUserCheck, FiUserX, FiSlash } from "react-icons/fi";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import ConfirmDialog from "../../molecules/ConfirmDialog/ConfirmDialog";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useProfileService } from "../../../services/useProfileService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { usePermissionHelper } from "../../../hooks/usePermissionHelper";
import { FaUsers } from "react-icons/fa";

interface UserTableTemplateProps {
    users: UserResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
    onRefresh?: () => void;
    isLoading?: boolean;
    onDelete?: (id: number) => void | Promise<void>;
    selectedIds?: number[];
    onToggleSelect?: (id: number) => void;
    onToggleSelectAll?: () => void;
    onClearSelection?: () => void;
    onBulkDelete?: () => void | Promise<void>;
    onBulkStatusChange?: (status: string) => void | Promise<void>;
}

const ROLE_CHIP_COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981", "#ec4899"];
const roleChipColor = (roleName: string): string => {
    let hash = 0;
    for (let i = 0; i < roleName.length; i++) hash = roleName.charCodeAt(i) + ((hash << 5) - hash);
    return ROLE_CHIP_COLORS[Math.abs(hash) % ROLE_CHIP_COLORS.length];
};

const RoleChip: React.FC<{ roleName: string }> = ({ roleName }) => {
    const color = roleChipColor(roleName || "—");
    return (
        <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
        >
            {roleName || "—"}
        </span>
    );
};

const UsersTableTemplate: React.FC<UserTableTemplateProps> = ({
    users,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    searchValue,
    onSearchChange,
    filterContent,
    onRefresh,
    isLoading,
    onDelete,
    selectedIds = [],
    onToggleSelect,
    onToggleSelectAll,
    onClearSelection,
    onBulkDelete,
    onBulkStatusChange,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const { showSnackbar } = useSnackbar();
    const { toggleUserVerification } = useProfileService();
    const { canDelete, canEdit } = usePermissionHelper();

    const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);
    const [bulkAction, setBulkAction] = useState<null | "delete" | { status: string }>(null);
    const [actionBusy, setActionBusy] = useState(false);

    const handleEdit = useCallback((id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.USER_EDIT, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const handleView = useCallback((id?: number | null) => {
        if (!id) return;
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.USER_VIEW, { query, params: { id: String(id) } }));
    }, [navigate, searchParams]);

    const handleVerifyUser = useCallback(async (userId?: number | null) => {
        if (!userId) return;
        try {
            const response = await toggleUserVerification(userId);
            if (response?.status === 200) {
                showSnackbar('success', 'User verification status updated successfully');
                onRefresh?.();
            }
        } catch {
            showSnackbar('error', 'Failed to update user verification status');
        }
    }, [toggleUserVerification, showSnackbar, onRefresh]);

    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

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

    const runBulkAction = async () => {
        if (!bulkAction) return;
        setActionBusy(true);
        try {
            if (bulkAction === "delete") await onBulkDelete?.();
            else await onBulkStatusChange?.(bulkAction.status);
        } finally {
            setActionBusy(false);
            setBulkAction(null);
        }
    };

    const records = useMemo(() => users?.map((user: UserResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <div key={`user-${user.id}`} className={`flex ${isMobile ? 'justify-end' : ''} items-center space-x-2`} title=''>
            <img src={getOptimizedImageUrl(user.profileImageUrl, { width: 80, height: 80 })} alt={user.userName} className='w-10 h-10' loading="lazy" width={40} height={40} />
            <div className='flex flex-col'>
                <div className='font-medium'>{user.fullName}</div>
                <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
        </div>,
        user.userName,
        <RoleChip key={`role-${user.id}`} roleName={user.roleName} />,
        <ResourceStatus key={`status-${user.id}`} status={user.status} />,
        user.createdAt ? DateUtils.formatDateTimeToDateMonthYear(user.createdAt) : "—",
        <div key={user.id} className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
            <ActionButtons
                onEdit={() => handleEdit(user.id)}
                onView={() => handleView(user.id)}
                onDelete={onDelete && user.id ? () => setDeleteTarget(user) : undefined}
            />
            {user.emailVerified !== 'VERIFIED' && user.phoneVerified !== 'VERIFIED' && <button
                onClick={() => handleVerifyUser(user.id)}
                className={`w-6 h-6 ${user.emailVerified === 'VERIFIED' ? 'text-green-600' : 'text-blue-600'}`}
                title={user.emailVerified === 'VERIFIED' ? 'Verified' : 'Verify User'}
            >
                <FiCheck />
            </button>}
        </div>
    ]) ?? [], [users, pagination.currentPage, pagination.pageSize, isMobile, handleEdit, handleView, handleVerifyUser, onDelete]);

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
            { label: "User", key: "user", type: "custom" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Username", key: "username", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Role", key: "role", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Created", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true
        // Depend on pagination's primitive fields, not the object itself —
        // the caller rebuilds `pagination` as a fresh object literal every
        // render (see ListingUsers.page.tsx's paginationWithTotal), so this
        // memo was invalidating on renders where nothing pagination-related
        // actually changed.
    }), [isMobile, pagination.totalRecords, pagination.currentPage, pagination.pageSize, handlePaginationChange, handleRowsPerPageChange]);

    const selection: TableSelection | undefined = useMemo(() => onToggleSelect ? {
        selectedIds: selectedIdSet,
        getRowId: (_row, index) => users[index]?.id ?? index,
        onToggle: (id) => onToggleSelect(Number(id)),
        onToggleAll: () => onToggleSelectAll?.(),
    } : undefined, [onToggleSelect, onToggleSelectAll, selectedIdSet, users]);

    const bulkActions: BulkAction[] = useMemo(() => {
        const actions: BulkAction[] = [];
        if (canEdit && onBulkStatusChange) {
            actions.push(
                { label: "Mark Active", icon: <FiUserCheck size={13} />, onClick: () => setBulkAction({ status: Status.ACTIVE }) },
                { label: "Mark Inactive", icon: <FiUserX size={13} />, onClick: () => setBulkAction({ status: Status.INACTIVE }) },
                { label: "Block", icon: <FiSlash size={13} />, onClick: () => setBulkAction({ status: Status.BLOCKED }) },
            );
        }
        if (canDelete && onBulkDelete) {
            actions.push({ label: "Delete", icon: <FiTrash2 size={13} />, variant: "danger", onClick: () => setBulkAction("delete") });
        }
        return actions;
    }, [canEdit, canDelete, onBulkStatusChange, onBulkDelete]);

    return (
        <ListingShell
            title="Users"
            icon={<FaUsers />}
            description="Platform user accounts"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add User"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.USER_ADD)}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
            onExport={onToggleSelect ? () => exportToCsv("users", users.map((u) => ({
                id: u.id, fullName: u.fullName, email: u.email, username: u.userName,
                role: u.roleName, status: u.status, createdAt: u.createdAt ?? "",
            }))) : undefined}
            selectedCount={selectedIds.length}
            onClearSelection={onClearSelection}
            bulkActions={bulkActions}
        >
            <TableV1 schema={schema} records={records} isLoading={isLoading} selection={selection} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this user?"
                message={<>This permanently removes <strong>{deleteTarget?.fullName}</strong>&apos;s account access. This cannot be undone.</>}
                confirmLabel="Delete"
                danger
                loading={actionBusy}
                onConfirm={runDelete}
                onClose={() => setDeleteTarget(null)}
            />

            <ConfirmDialog
                open={!!bulkAction}
                title={bulkAction === "delete" ? "Delete selected users?" : "Update selected users?"}
                message={
                    bulkAction === "delete"
                        ? <>This permanently removes account access for <strong>{selectedIds.length}</strong> user(s). This cannot be undone.</>
                        : <>Set status to <strong>{bulkAction ? bulkAction.status : ""}</strong> for <strong>{selectedIds.length}</strong> user(s).</>
                }
                confirmLabel={bulkAction === "delete" ? "Delete" : "Apply"}
                danger={bulkAction === "delete"}
                loading={actionBusy}
                onConfirm={runBulkAction}
                onClose={() => setBulkAction(null)}
            />
        </ListingShell>
    )
}
export default UsersTableTemplate;
