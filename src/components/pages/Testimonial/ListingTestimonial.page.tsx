import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, HTTP_STATUS, StatusOptions } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import TestimonialListTableTemplate from '../../templates/Testimonial/TestimonialTable.template';
import { useSearchParams } from 'react-router-dom';
import { useTestimonialService } from '../../../services/useTestimonialService';
import { useSnackbar } from '../../../hooks/useSnackBar';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const TestimonialListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const testimonialService = useTestimonialService();
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
        queryKey: ['testimonials', pagination.currentPage, pagination.pageSize, filters.search, filters.status],
        queryFn: () => testimonialService.getAll({
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
    const testimonials = pageData?.content ?? [];
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
            status: filters.status ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination]);

    const handleDelete = async (id: number) => {
        try {
            const res = await testimonialService.remove(id);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Testimonial deleted successfully');
                refetch();
            } else {
                showSnackbar('error', res?.data?.message ?? 'Failed to delete testimonial');
            }
        } catch {
            showSnackbar('error', 'Failed to delete testimonial');
        }
    };

    const handleBulkDelete = async (ids: number[]) => {
        try {
            const res = await testimonialService.bulkRemove(ids);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar('success', res?.data?.message ?? 'Testimonials deleted successfully');
                refetch();
            } else {
                showSnackbar('error', res?.data?.message ?? 'Failed to delete testimonials');
            }
        } catch {
            showSnackbar('error', 'Failed to delete testimonials');
        }
    };

    return (
        <TestimonialListTableTemplate
            testimonials={testimonials}
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

export default TestimonialListPage;
