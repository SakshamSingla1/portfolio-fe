import React, { useState, useEffect } from "react";
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

interface UserTableTemplateProps {
    users: UserResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsersTableTemplate: React.FC<UserTableTemplateProps> = ({ users, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { showSnackbar } = useSnackbar();
    const { toggleUserVerification } = useProfileService();

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.USER_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.USER_VIEW, { query, params: { id: id } }));
    }

    const handleVerifyUser = async (userId: string) => {
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
    }

    const Action = (user: UserResponse) => (
        <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
            <ActionButtons onEdit={() => handleEdit(user.id)} onView={() => handleView(user.id)} />
            {user.emailVerified !== 'VERIFIED' && user.phoneVerified !== 'VERIFIED' && <button
                onClick={() => handleVerifyUser(user.id)}
                className={`w-6 h-6 ${user.emailVerified === 'VERIFIED' ? 'text-green-600' : 'text-blue-600'}`}
                title={user.emailVerified === 'VERIFIED' ? 'Verified' : 'Verify User'}
            >
                <FiCheck />
            </button>}
        </div>
    );

    const getRecords = () => users?.map((user: UserResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        <div className={`flex ${isMobile ? 'justify-end' : ''} items-center space-x-2`} title=''>
            <img src={user.profileImageUrl} alt={user.userName} className='w-10 h-10' />
            <div className='flex flex-col'>
                <div className='font-medium'>{user.fullName}</div>
                <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
        </div>,
        user.userName,
        user.roleName,
        <ResourceStatus status={user.status} />,
        Action(user)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "User", key: "user", type: "custom" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Username", key: "username", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Role", key: "role", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ]

    const getSchema = () => ({
        id: "1",
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

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <ListingShell title="Users" description="Platform user accounts" count={pagination.totalRecords} accentColor="#64748b">
            <TableV1 schema={getSchema()} records={getRecords()} />
        </ListingShell>
    )
}
export default UsersTableTemplate;