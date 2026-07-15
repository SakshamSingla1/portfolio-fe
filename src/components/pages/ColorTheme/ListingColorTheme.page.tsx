import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ColorThemeListingTemplate from '../../templates/ColorTheme/ColorThemeListing.template';
import { useColorThemeService } from '../../../services/useColorThemeService';
import { useSearchParams } from 'react-router-dom';

const ColorThemeListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const colorThemeService = useColorThemeService();

    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading: _isLoading, refetch } = useQuery({
        queryKey: ['colorThemes', pagination.currentPage, pagination.pageSize],
        queryFn: () => colorThemeService.getColorTheme({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "desc",
            sortBy: "createdAt",
        }),
    });

    const pageData = pageResponse?.data?.data;
    const colorThemes = pageData?.content ?? [];
    const totalRecords = pageData?.totalElements ?? 0;
    const totalPages = pageData?.totalPages ?? 0;

    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords,
        totalPages,
    };

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage,
            currentPage: 0
        }));
    };

    useEffect(() => {
        const params: Record<string, string> = {
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
        };
        setSearchParams(params);
    }, [pagination.currentPage, pagination.pageSize]);

    return (
        <ColorThemeListingTemplate
            colorThemes={colorThemes}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            onRefresh={() => refetch()}
        />
    )
}

export default ColorThemeListingPage;
