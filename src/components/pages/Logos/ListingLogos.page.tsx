import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination, SORT_ENUM } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useSearchParams } from 'react-router-dom';
import { useLogoService } from '../../../services/useLogoService';
import LogoTableTemplate from '../../templates/Logos/LogoTable.template';

const ListingLogosPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const logoService = useLogoService();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse } = useQuery({
        queryKey: ['logos', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => logoService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: SORT_ENUM.DESC,
            sortBy: "createdAt",
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const logos = pageData?.content ?? [];
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
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <LogoTableTemplate
            logos={logos}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
        />
    )
}

export default ListingLogosPage;
