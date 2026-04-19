import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enumToNormalKey, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type RoleListResponseDTO, type GetAllRolesParams } from "../../../services/useRoleService";
import { FiEdit, FiEye, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiPlus } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { Status } from "../../../utils/types";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import Button from "../../atoms/Button/Button";

interface RoleTableTemplateProps {
    users: RoleListResponseDTO[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: GetAllRolesParams;
}

const RoleTableTemplate: React.FC<RoleTableTemplateProps> = ({ users, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const statusOptions = [
        { label: "All Status", value: "" },
        { label: "Active", value: Status.ACTIVE },
        { label: "Inactive", value: Status.INACTIVE }
    ];

    const handleAdd = () => {
        navigate(makeRoute(ADMIN_ROUTES.ROLE_ADD, {}));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.ROLE_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.USER_VIEW, { query, params: { id: id } }));
    }


    const Action = (role: RoleListResponseDTO) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
                <button onClick={() => handleView(role.id)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
                <button onClick={() => handleEdit(role.id)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
            </div>
        );
    };

    const getRecords = () => users?.map((role: RoleListResponseDTO, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        role.name,
        role.description || '-',
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            role.status === Status.ACTIVE 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
        }`}>
            {enumToNormalKey(role.status)}
        </span>,
        new Date(role.createdAt).toLocaleDateString(),
        Action(role)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Role Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Description", key: "description", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Created Date", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const, hideOnMobile: true },
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
                            Roles List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAdd}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Role"}
                        startIcon={isMobile ? <FiPlus /> : ""}
                        className={isMobile ? 'w-12 h-12 rounded-full' : ''}
                    />
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
                                        placeholder="Search roles..."
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
                                    placeholder="Search roles..."
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
export default RoleTableTemplate;