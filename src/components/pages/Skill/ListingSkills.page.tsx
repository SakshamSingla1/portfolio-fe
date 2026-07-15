import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import SkillTableTemplate from '../../templates/Skill/SkillsTable.template';
import { useSkillService, type SkillResponse, type SkillStats } from '../../../services/useSkillService';
import { useSearchParams } from 'react-router-dom';
const ListingSkillsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const skillService = useSkillService();

    const [skillStats, setSkillStats] = useState<SkillStats | null>(null);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
        totalRecords: 0,
    });

    const handleFiltersChange = (key: string, value: any) => {
        setFiltersTo((prevFilters: any) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    const loadSkillStats = async () => {
        try {
            const response = await skillService.getStats();
            if (response?.status === HTTP_STATUS.OK) {
                setSkillStats(response?.data?.data);
            }
        } catch (error) {
        }
    };

    const { data: pageResponse } = useQuery({
        queryKey: ['skills', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => skillService.getByProfile({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const skills: SkillResponse[] = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

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
        loadSkillStats();
    }, []);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div className="grid gap-y-4">
            <SkillTableTemplate
                skills={skills}
                pagination={paginationWithTotal}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                searchValue={filters.search}
                onSearchChange={(val) => handleFiltersChange("search", val)}
                stats={skillStats}
            />
        </div>
    );
};

export default ListingSkillsPage;
