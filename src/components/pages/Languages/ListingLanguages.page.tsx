import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HTTP_STATUS, type IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useLanguageService, type Language, type LanguageFilterParams } from "../../../services/useLanguageService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import LanguageTableTemplate from "../../templates/Languages/LanguageTable.template";

const ListingLanguagesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const languageService = useLanguageService();
    const { showSnackbar } = useSnackbar();

    const [filters, setFilters] = useState({ search: searchParams.get("search") || "" });
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [languages, setLanguages] = useState<Language[]>([]);

    const fetchLanguages = async (page: string, size: string) => {
        const params: LanguageFilterParams = {
            page,
            size,
            sortDir: "ASC",
            sortBy: "sortOrder",
            search: filters.search || undefined,
        };
        try {
            const res = await languageService.getAll(params);
            if (res?.status === HTTP_STATUS.OK) {
                const { totalElements, totalPages } = res.data.data;
                setPagination((p) => ({ ...p, totalPages, totalRecords: totalElements }));
                setLanguages(res.data.data.content);
            }
        } catch {
            showSnackbar("error", "Failed to load languages");
        }
    };

    const handlePaginationChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((p) => ({ ...p, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPagination((p) => ({ ...p, pageSize: parseInt(e.target.value, 10) }));
    };

    useEffect(() => {
        fetchLanguages(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        setSearchParams({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search,
        });
    }, [filters.search, pagination.currentPage, pagination.pageSize]);

    return (
        <LanguageTableTemplate
            languages={languages}
            pagination={pagination}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => {
                setFilters({ search: val ?? "" });
                setPagination((p) => ({ ...p, currentPage: 0 }));
            }}
        />
    );
};

export default ListingLanguagesPage;
