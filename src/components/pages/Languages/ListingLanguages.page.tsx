import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { type IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useLanguageService } from "../../../services/useLanguageService";
import LanguageTableTemplate from "../../templates/Languages/LanguageTable.template";

const ListingLanguagesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const languageService = useLanguageService();

    const [filters, setFilters] = useState({ search: searchParams.get("search") || "" });
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading } = useQuery({
        queryKey: ['languages', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => languageService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "ASC",
            sortBy: "sortOrder",
            search: filters.search,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const languages = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

    const handlePaginationChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((p) => ({ ...p, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPagination((p) => ({ ...p, pageSize: parseInt(e.target.value, 10) }));
    };

    useEffect(() => {
        setSearchParams({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search,
        });
    }, [filters.search, pagination.currentPage, pagination.pageSize, setSearchParams]);

    return (
        <LanguageTableTemplate
            languages={languages}
            pagination={paginationWithTotal}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => {
                setFilters({ search: val ?? "" });
                setPagination((p) => ({ ...p, currentPage: 0 }));
            }}
            isLoading={isLoading}
        />
    );
};

export default ListingLanguagesPage;
