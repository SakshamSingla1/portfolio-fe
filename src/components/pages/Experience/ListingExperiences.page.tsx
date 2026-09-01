import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ExperienceListTableTemplate from '../../templates/Experience/ExperiencesTable.template';
import { useSearchParams } from 'react-router-dom';
import { useExperienceService, EmploymentStatusOptions } from '../../../services/useExperienceService';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ExperienceListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const experienceService = useExperienceService();
    const isMobile = useIsMobile();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        employmentStatus: searchParams.get("employmentStatus") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading } = useQuery({
        queryKey: ['experiences', pagination.currentPage, pagination.pageSize, filters.search, filters.employmentStatus],
        queryFn: () => experienceService.getAllByProfile({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters.search,
            employmentStatus: filters.employmentStatus || undefined,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const experiences = pageData?.content ?? [];
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
            employmentStatus: filters.employmentStatus ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.employmentStatus, pagination, setSearchParams]);

    return (
        <ExperienceListTableTemplate
            experiences={experiences}
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
                        options={EmploymentStatusOptions}
                        value={filters.employmentStatus ? EmploymentStatusOptions.find(o => o.value === filters.employmentStatus) ?? null : null}
                        onChange={(option: any) => handleFiltersChange("employmentStatus", option?.value ?? "")}
                        onSearch={() => { }}
                    />
                </div>
            }
        />
    )
}

export default ExperienceListPage;
