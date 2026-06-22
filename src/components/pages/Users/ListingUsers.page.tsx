import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues, ROLES } from '../../../utils/constant';
import { useProfileService, type UserResponse, type GetProfilesParams } from '../../../services/useProfileService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import UserTableTemplate from '../../templates/Users/UsersTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ListingUsersPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

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

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        roleId: searchParams.get("roleId") || "",
        status: searchParams.get("status") || ""
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [users, setUsersTo] = useState<UserResponse[]>([]);

    const refreshUsers = async (page: number, size: number) => {
        const params: GetProfilesParams = {
            page: page,
            size: size,
            status: filters?.status,
            roleId: filters?.roleId,
            search: filters?.search,
        };
        await profileService.getAllUsers(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setUsersTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching users:", error);
                setUsersTo([]);
                showSnackbar('error', 'Failed to load users');
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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
        refreshUsers(pagination.currentPage, pagination.pageSize);
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            roleId: filters.roleId ?? "",
            status: filters.status ?? ""
        };
        setSearchParams(params);
    }, [filters.search, filters.roleId, filters.status, pagination]);

    return (
        <UserTableTemplate 
            users={users} 
            pagination={pagination} 
            handlePaginationChange={handlePaginationChange} 
            handleRowsPerPageChange={handleRowsPerPageChange} 
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            filterContent={
                <>
                    <div className="w-full sm:w-72">
                        <AutoCompleteInput
                            label={isMobile ? 'Role' : ''}
                            placeHolder='Select role'
                            options={roleOptions}
                            value={roleOptions.find(option => option.value === filters.roleId) || null}
                            onChange={(value) => handleFiltersChange('roleId', value?.value || '')}
                            onSearch={() => { }}
                        />
                    </div>
                    <div className="w-full sm:w-72">
                        <AutoCompleteInput
                            label={isMobile ? 'Status' : ''}
                            placeHolder='Select status'
                            options={statusOptions}
                            value={statusOptions.find(option => option.value === filters.status) || null}
                            onChange={(value) => handleFiltersChange('status', value?.value || '')}
                            onSearch={() => { }}
                        />
                    </div>
                </>
            }
        />
    )
}

export default ListingUsersPage;
