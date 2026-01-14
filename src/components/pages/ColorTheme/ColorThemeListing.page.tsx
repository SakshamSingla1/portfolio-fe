import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ColorThemeListingTemplate from '../../templates/ColorTheme/ColorThemeListing.template';
import { useColorThemeService, type ColorTheme, type ColorThemeFilterRequest } from '../../../services/useColorThemeService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';

const ColorThemeListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const colorThemeService = useColorThemeService();
    const { showSnackbar } = useSnackbar();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        role: searchParams.get("role") || "",
        status: searchParams.get("status") || ""
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [colorThemes, setColorThemesTo] = useState<ColorTheme[]>([]);

    const refreshColorThemes = async (page: string, size: string) => {
        const params: ColorThemeFilterRequest = {
                    page: page,
                    size: size,
                    sortDir: "desc",
                    sortBy: "createdAt",
                    search: filters?.search,
                    status: filters?.status
                };
        await colorThemeService.getColorTheme(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setColorThemesTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error('Error fetching color themes:', error);
                setColorThemesTo([]);
                showSnackbar('error', 'Failed to load color themes');
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    useEffect(() => {
        refreshColorThemes(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div>
            <ColorThemeListingTemplate colorThemes={colorThemes} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default ColorThemeListingPage;
