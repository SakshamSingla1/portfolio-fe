import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useProjectService, WorkStatusOptions } from '../../../services/useProjectService';
import { useSearchParams } from 'react-router-dom';
import ProjectsTable from '../../templates/Project/ProjectsTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ListingProjectsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const projectService = useProjectService();
    const isMobile = useIsMobile();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        workStatus: searchParams.get("workStatus") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading } = useQuery({
        queryKey: ['projects', pagination.currentPage, pagination.pageSize, filters.search, filters.workStatus],
        queryFn: () => projectService.getByProfile({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters.search,
            workStatus: filters.workStatus || undefined,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const projects = pageData?.content ?? [];
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
            workStatus: filters.workStatus ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.workStatus, pagination, setSearchParams]);

    return (
        <ProjectsTable
            projects={projects}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            isLoading={isLoading}
            filterContent={
                <div className="w-full sm:w-64">
                    <AutoCompleteInput
                        label={isMobile ? "Status" : ""}
                        placeHolder="Filter by status"
                        options={WorkStatusOptions}
                        value={filters.workStatus ? WorkStatusOptions.find(o => o.value === filters.workStatus) ?? null : null}
                        onChange={(option: any) => handleFiltersChange("workStatus", option?.value ?? "")}
                        onSearch={() => { }}
                    />
                </div>
            }
        />
    )
}

export default ListingProjectsPage;
