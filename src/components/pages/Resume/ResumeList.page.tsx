import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { StatusOptions, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useResumeService, type DocumentUploadResponse } from '../../../services/useResumeService';
import { useSearchParams } from 'react-router-dom';
import ResumeTable from '../../templates/Resume/ResumeTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';

const ResumeListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const resumeService = useResumeService();

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
        queryKey: ['resumes', pagination.currentPage, pagination.pageSize, filters.search, filters.status],
        queryFn: () => resumeService.getByProfile({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "updatedAt",
            search: filters.search,
            status: filters.status,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const resumes: DocumentUploadResponse[] = pageData?.content ?? [];
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
    }, [filters.search, filters.status, pagination, setSearchParams]);

    return (
        <div>
            <ResumeTable
                resumes={resumes}
                pagination={paginationWithTotal}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                searchValue={filters.search}
                onSearchChange={(val) => handleFiltersChange("search", val)}
                onRefresh={() => refetch()}
                isLoading={isLoading}
                filterContent={
                    <div className="w-full sm:w-72">
                        <AutoCompleteInput
                            label=""
                            placeHolder="Select Status"
                            options={StatusOptions}
                            value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                            onChange={(option: any) => {
                                if (option) {
                                    handleFiltersChange("status", option.value);
                                } else {
                                    handleFiltersChange("status", "");
                                }
                            }}
                            onSearch={() => { }}
                        />
                    </div>
                }
            />
        </div>
    )
}

export default ResumeListPage;
