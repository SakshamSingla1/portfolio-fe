import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues, ROLES } from '../../../utils/constant';
import { useProfileService } from '../../../services/useProfileService';
import { useSearchParams } from 'react-router-dom';
import UserTableTemplate from '../../templates/Users/UsersTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ListingUsersPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const profileService = useProfileService();
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

    const { data: pageResponse, isLoading: _isLoading, refetch } = useQuery({
        queryKey: ['users', pagination.currentPage, pagination.pageSize, filters.search, filters.roleId, filters.status],
        queryFn: () => profileService.getAllUsers({
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
            roleId: filters.roleId,
            status: filters.status,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const users = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

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
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            onRefresh={refetch}
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
