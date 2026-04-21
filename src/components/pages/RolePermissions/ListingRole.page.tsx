import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues, ADMIN_ROUTES } from '../../../utils/constant';
import { useRoleService, type RoleListResponseDTO, type GetAllRolesParams } from '../../../services/useRoleService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import RoleTableTemplate from '../../templates/Roles/RoleTable.template';
import { makeRoute } from '../../../utils/helper';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiPlus, FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';

const ListingRolesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleService = useRoleService();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const statusOptions = [
        { label: "All Status", value: "" },
        { label: "Active", value: Status.ACTIVE },
        { label: "Inactive", value: Status.INACTIVE }
    ];

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || ""
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [roles, setRolesTo] = useState<RoleListResponseDTO[]>([]);

    const refreshRoles = async (page: number, size: number) => {
        const params: GetAllRolesParams = {
            page: page,
            size: size,
            status: filters?.status,
            search: filters?.search,
        };
        await roleService.getAllRolesByCriteria(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setRolesTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching roles:", error);
                setRolesTo([]);
                showSnackbar('error', 'Failed to load roles');
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    useEffect(() => {
        refreshRoles(pagination.currentPage, pagination.pageSize);
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            status: filters.status ?? ""
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAdd = () => {
        navigate(makeRoute(ADMIN_ROUTES.ROLE_ADD, {}));
    }

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className={`${isMobile ? '' : 'flex justify-start items-end space-x-4'}`}>
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

            <RoleTableTemplate 
                users={roles} 
                pagination={pagination} 
                handlePaginationChange={handlePaginationChange} 
                handleRowsPerPageChange={handleRowsPerPageChange} 
            />
        </div>
    )
}

export default ListingRolesPage;
