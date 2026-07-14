import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useRoleService, type RoleListResponseDTO } from '../../../services/useRoleService';
import { useSearchParams } from 'react-router-dom';
import RoleTableTemplate from '../../templates/Roles/RoleTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ListingRolesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleService = useRoleService();
    const isMobile = useIsMobile();

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

    const { data: pageResponse } = useQuery({
        queryKey: ['roles', pagination.currentPage, pagination.pageSize, filters.search, filters.status],
        queryFn: () => roleService.getAllRolesByCriteria({
            page: pagination.currentPage,
            size: pagination.pageSize,
            status: filters.status,
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const roles: RoleListResponseDTO[] = pageData?.content ?? [];
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
            status: filters.status ?? ""
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination]);

    return (
        <RoleTableTemplate
            users={roles}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            filterContent={
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
            }
        />
    )
}

export default ListingRolesPage;
