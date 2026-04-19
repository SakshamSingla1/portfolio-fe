import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useProfileService , type UserResponse , type GetProfilesParams } from '../../../services/useProfileService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import UserTableTemplate from '../../templates/Users/UsersTable.template';

const ListingUsersPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const profileService = useProfileService();
    const { showSnackbar } = useSnackbar();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        role: searchParams.get("role") || "",
        status: searchParams.get("starus") || ""
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [users, setUsersTo] = useState<UserResponse[]>([]);

    const refreshSkills = async (page: number, size: number) => {
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
        refreshSkills(pagination.currentPage, pagination.pageSize);
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            role: filters.role ?? "",
            status: filters.status ?? ""
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div>
            <UserTableTemplate users={users} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default ListingUsersPage;
