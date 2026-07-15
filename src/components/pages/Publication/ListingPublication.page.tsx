import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import PublicationListTableTemplate from '../../templates/Publication/PublicationTable.template';
import { useSearchParams } from 'react-router-dom';
import { usePublicationService } from '../../../services/usePublicationService';

const ListingPublicationPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const publicationService = usePublicationService();

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
        queryKey: ['publications', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => publicationService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const publications = pageData?.content ?? [];
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
        <PublicationListTableTemplate
            publications={publications}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
        />
    )
}

export default ListingPublicationPage;
