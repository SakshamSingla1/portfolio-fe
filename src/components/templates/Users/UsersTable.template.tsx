import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enumToNormalKey, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type UserResponse, type GetProfilesParams } from "../../../services/useProfileService";
import { FiEdit, FiEye, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiCheck } from "react-icons/fi";
import { ADMIN_ROUTES, ROLES } from "../../../utils/constant";
import { Status } from "../../../utils/types";
import { useProfileService } from "../../../services/useProfileService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";

interface UserTableTemplateProps {
    users: UserResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: GetProfilesParams;
}

const UsersTableTemplate: React.FC<UserTableTemplateProps> = ({ users, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const { showSnackbar } = useSnackbar();
    const { toggleUserVerification } = useProfileService();

    const roleOptions = [
        { label: "All Roles", value: "" },
        { label: "Admin", value: ROLES.ADMIN },
        { label: "Super Admin", value: ROLES.SUPER_ADMIN }
    ];

    const statusOptions = [
        { label: "All Status", value: "" },
        { label: "Active", value: Status.ACTIVE },
        { label: "Inactive", value: Status.INACTIVE }
    ];

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

    const Action = (user: UserResponse) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
                <button onClick={() => handleEdit(user.id)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(user.id)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
                {user.emailVerified !== 'VERIFIED' && user.phoneVerified !== 'VERIFIED' && <button
                    onClick={() => handleVerifyUser(user.id)}
                    className={`w-6 h-6 ${user.emailVerified === 'VERIFIED' ? 'text-green-600' : 'text-blue-600'}`}
                    title={user.emailVerified === 'VERIFIED' ? 'Verified' : 'Verify User'}
                >
                    <FiCheck />
                </button>}
            </div>
        );
    };

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
        enumToNormalKey(user.status),
        Action(user)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "User", key: "user", type: "custom" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Username", key: "username", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Role", key: "role", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
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
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Users List
                        </h1>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className={`${isMobile ? '' : 'flex justify-between items-end space-x-4'}`}>
                    {isMobile ? (
                        <div className="w-full">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-3"
                            >
                                <span className="flex items-center">
                                    <FiFilter />
                                    <span className="ml-2">Filters</span>
                                </span>
                                <span className="transform transition-transform">
                                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>

                            {showFilters && (
                                <div className="space-y-3 p-4">
                                    <TextField
                                        label='Search'
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={filters.search}
                                        name='search'
                                        onChange={(event) => {
                                            handleFiltersChange("search", event.target.value)
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"> <FiSearch /></InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                    <AutoCompleteInput
                                        label='Role'
                                        placeHolder='Select role'
                                        options={roleOptions}
                                        value={roleOptions.find(option => option.value === filters.roleId) || null}
                                        onChange={(value) => handleFiltersChange('role', value?.value || '')}
                                        onSearch={() => { }}
                                    />
                                    <AutoCompleteInput
                                        label='Status'
                                        placeHolder='Select status'
                                        options={statusOptions}
                                        value={statusOptions.find(option => option.value === filters.status) || null}
                                        onChange={(value) => handleFiltersChange('status', value?.value || '')}
                                        onSearch={() => { }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="w-[250px]">
                                <TextField
                                    label=''
                                    variant="outlined"
                                    placeholder="Search...."
                                    value={filters.search}
                                    name='search'
                                    onChange={(event) => {
                                        handleFiltersChange("search", event.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" className='pl-[11px]'> <FiSearch /></InputAdornment>,
                                    }}
                                    fullWidth
                                />
                            </div>
                            <div className="w-[250px]">
                                <AutoCompleteInput
                                    label=''
                                    placeHolder='Select role'
                                    options={roleOptions}
                                    value={roleOptions.find(option => option.value === filters.roleId) || null}
                                    onChange={(value) => handleFiltersChange('roleId', value?.value || '')}
                                    onSearch={() => { }}
                                />
                            </div>
                            <div className="w-[250px]">
                                <AutoCompleteInput
                                    label=''
                                    placeHolder='Select status'
                                    options={statusOptions}
                                    value={statusOptions.find(option => option.value === filters.status) || null}
                                    onChange={(value) => handleFiltersChange('status', value?.value || '')}
                                    onSearch={() => { }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default UsersTableTemplate;