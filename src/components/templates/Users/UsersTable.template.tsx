import React, { useMemo, useCallback } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type UserResponse } from "../../../services/useProfileService";
import { FiCheck } from "react-icons/fi";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { useProfileService } from "../../../services/useProfileService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaUsers } from "react-icons/fa";

interface UserTableTemplateProps {
    users: UserResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    filterContent?: React.ReactNode;
}

const UsersTableTemplate: React.FC<UserTableTemplateProps> = ({
    users,
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
    const { showSnackbar } = useSnackbar();
    const { toggleUserVerification } = useProfileService();

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
                window.location.reload();
            }
        } catch (error) {
            showSnackbar('error', 'Failed to update user verification status');
            console.error('Error verifying user:', error);
        }
    }, [toggleUserVerification, showSnackbar]);

    const records = useMemo(() => users?.map((user: UserResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <div key={`user-${user.id}`} className={`flex ${isMobile ? 'justify-end' : ''} items-center space-x-2`} title=''>
            <img src={user.profileImageUrl} alt={user.userName} className='w-10 h-10' />
            <div className='flex flex-col'>
                <div className='font-medium'>{user.fullName}</div>
                <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
        </div>,
        user.userName,
        user.roleName,
        <ResourceStatus key={`status-${user.id}`} status={user.status} />,
        <div key={user.id} className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
            <ActionButtons onEdit={() => handleEdit(user.id)} onView={() => handleView(user.id)} />
            {user.emailVerified !== 'VERIFIED' && user.phoneVerified !== 'VERIFIED' && <button
                onClick={() => handleVerifyUser(user.id)}
                className={`w-6 h-6 ${user.emailVerified === 'VERIFIED' ? 'text-green-600' : 'text-blue-600'}`}
                title={user.emailVerified === 'VERIFIED' ? 'Verified' : 'Verify User'}
            >
                <FiCheck />
            </button>}
        </div>
    ]) ?? [], [users, pagination.currentPage, pagination.pageSize, isMobile, handleEdit, handleView, handleVerifyUser]);

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
            { label: "Role", key: "role", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
            { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    return (
        <ListingShell
            title="Users"
            icon={<FaUsers />}
            description="Platform user accounts"
            count={pagination.totalRecords}
            isAddButtonVisible={false}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    )
}
export default UsersTableTemplate;
