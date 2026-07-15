import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import AchievementListTableTemplate from '../../templates/Achievements/AchievementTable.template';
import { useSearchParams } from 'react-router-dom';
import { useAchievementService } from '../../../services/useAchievementService';

const AchievementListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const achievementService = useAchievementService();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading: _isLoading } = useQuery({
        queryKey: ['achievements', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => achievementService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const achievements = pageData?.content ?? [];
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
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <AchievementListTableTemplate
            achievements={achievements}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
        />
    );
};

export default AchievementListPage;
