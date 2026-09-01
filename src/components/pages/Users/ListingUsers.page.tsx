import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useProfileService } from '../../../services/useProfileService';
import { useRoleService } from '../../../services/useRoleService';
import { useSearchParams } from 'react-router-dom';
import UserTableTemplate from '../../templates/Users/UsersTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useSnackbar } from '../../../hooks/useSnackBar';

const ListingUsersPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const profileService = useProfileService();
    const roleService = useRoleService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

    // Role filtering is by real role id (the backend parses this as a list of
    // numeric ids), so options must come from the actual roles list rather
    // than a hardcoded "ADMIN"/"SUPER_ADMIN" string — those never matched
    // anything server-side and the filter silently did nothing.
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([
        { label: "All Roles", value: "" },
    ]);

    useEffect(() => {
        roleService.getAllRolesByCriteria({ size: 100 }).then((res: any) => {
            const roles = res?.data?.data?.content ?? [];
            setRoleOptions([
                { label: "All Roles", value: "" },
                ...roles.map((r: any) => ({ label: r.name, value: String(r.id) })),
            ]);
        }).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statusOptions = [
        { label: "All Status", value: "" },
        { label: "Active", value: Status.ACTIVE },
        { label: "Inactive", value: Status.INACTIVE },
        { label: "Blocked", value: Status.BLOCKED },
        { label: "Deleted", value: Status.DELETED },
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

    const { data: pageResponse, isLoading, refetch } = useQuery({
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
    const totalRecords = pageData?.totalElements ?? 0;
    const totalPages = pageData?.totalPages ?? 0;
    // Memoized on primitive fields — a fresh object here every render was
    // silently invalidating UsersTable's `schema` memo (which the table's
    // own useMemo call depended on by object reference) on every unrelated
    // re-render, not just when pagination actually changed.
    // Intentionally depending on pagination.currentPage/pageSize (not the whole
    // `pagination` object) per the comment above; IPagination has exactly these
    // 4 fields and totalRecords/totalPages are already listed explicitly, so
    // this is exhaustive in practice.
    const paginationWithTotal: IPagination = useMemo(() => ({
        ...pagination,
        totalRecords,
        totalPages,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [pagination.currentPage, pagination.pageSize, totalRecords, totalPages]);

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

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    };

    const handleToggleSelectAll = () => {
        const idsOnPage = users.map((u: any) => u.id).filter(Boolean);
        const allSelected = idsOnPage.length > 0 && idsOnPage.every((id: number) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : idsOnPage);
    };

    const handleClearSelection = () => setSelectedIds([]);

    const handleDelete = async (id: number) => {
        try {
            const res = await profileService.deleteUser(id);
            if (res?.status === 200) {
                showSnackbar("success", "User deleted successfully");
                setSelectedIds((prev) => prev.filter((x) => x !== id));
                refetch();
            } else {
                showSnackbar("error", res?.data?.message ?? "Failed to delete user");
            }
        } catch {
            showSnackbar("error", "Failed to delete user");
        }
    };

    const handleBulkDelete = async () => {
        try {
            const res = await profileService.bulkDeleteUsers({ ids: selectedIds });
            if (res?.status === 200) {
                showSnackbar("success", res?.data?.message ?? "Users deleted successfully");
                setSelectedIds([]);
                refetch();
            } else {
                showSnackbar("error", res?.data?.message ?? "Failed to delete users");
            }
        } catch {
            showSnackbar("error", "Failed to delete users");
        }
    };

    const handleBulkStatusChange = async (status: string) => {
        try {
            const res = await profileService.bulkUpdateStatus({ ids: selectedIds, status });
            if (res?.status === 200) {
                showSnackbar("success", res?.data?.message ?? "Users updated successfully");
                setSelectedIds([]);
                refetch();
            } else {
                showSnackbar("error", res?.data?.message ?? "Failed to update users");
            }
        } catch {
            showSnackbar("error", "Failed to update users");
        }
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
    }, [filters.search, filters.roleId, filters.status, pagination, setSearchParams]);

    return (
        <UserTableTemplate
            users={users}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            onRefresh={refetch}
            isLoading={isLoading}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
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
