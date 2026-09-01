import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, HTTP_STATUS, StatusOptions } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import CertificationListTableTemplate from '../../templates/Certification/CertificationTable.template';
import { useSearchParams } from 'react-router-dom';
import { useCertificationService } from '../../../services/useCertificationService';
import { useSnackbar } from '../../../hooks/useSnackBar';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const CertificationListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const certificationService = useCertificationService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading, refetch } = useQuery({
        queryKey: ['certifications', pagination.currentPage, pagination.pageSize, filters.search, filters.status],
        queryFn: () => certificationService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters.search,
            status: filters.status,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const certifications = pageData?.content ?? [];
    const totalRecords = pageData?.totalElements ?? 0;
    const totalPages = pageData?.totalPages ?? 0;

    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords,
        totalPages,
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
            status: filters.status ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination, setSearchParams]);

    const handleDelete = async (id: number) => {
        try {
            const res = await certificationService.remove(id);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Certification deleted successfully');
                refetch();
            } else {
                showSnackbar('error', res?.data?.message ?? 'Failed to delete certification');
            }
        } catch {
            showSnackbar('error', 'Failed to delete certification');
        }
    };

    const handleBulkDelete = async (ids: number[]) => {
        try {
            const res = await certificationService.bulkRemove(ids);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar('success', res?.data?.message ?? 'Certifications deleted successfully');
                refetch();
            } else {
                showSnackbar('error', res?.data?.message ?? 'Failed to delete certifications');
            }
        } catch {
            showSnackbar('error', 'Failed to delete certifications');
        }
    };

    return (
        <CertificationListTableTemplate
            certifications={certifications}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            isLoading={isLoading}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            filterContent={
                <div className="w-full sm:w-72">
                    <AutoCompleteInput
                        label={isMobile ? "Status" : ""}
                        placeHolder="Select Status"
                        options={StatusOptions}
                        value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                        onChange={(option: any) => handleFiltersChange("status", option?.value ?? "")}
                        onSearch={() => { }}
                    />
                </div>
            }
        />
    )
}

export default CertificationListPage;
