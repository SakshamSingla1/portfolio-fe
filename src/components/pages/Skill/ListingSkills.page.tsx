import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues, SKILL_CATEGORY_OPTIONS } from '../../../utils/constant';
import SkillTableTemplate from '../../templates/Skill/SkillsTable.template';
import { useSkillService, type SkillResponse, type SkillStats } from '../../../services/useSkillService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ListingSkillsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const skillService = useSkillService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

    const [skillStats, setSkillStats] = useState<SkillStats | null>(null);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
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
        } catch {
            showSnackbar("error", "Failed to load skill stats");
        }
    };

    const { data: pageResponse } = useQuery({
        queryKey: ['skills', pagination.currentPage, pagination.pageSize, filters.search, filters.category],
        queryFn: () => skillService.getByProfile({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search,
            category: filters.category || undefined,
        }),
        refetchOnMount: 'always',
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
            category: filters.category ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.category, pagination]);

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
                filterContent={
                    <div className="w-full sm:w-64">
                        <AutoCompleteInput
                            label={isMobile ? "Category" : ""}
                            placeHolder="Filter by category"
                            options={SKILL_CATEGORY_OPTIONS}
                            value={filters.category ? SKILL_CATEGORY_OPTIONS.find(o => o.value === filters.category) ?? null : null}
                            onChange={(option: any) => handleFiltersChange("category", option?.value ?? "")}
                            onSearch={() => { }}
                        />
                    </div>
                }
            />
        </div>
    );
};

export default ListingSkillsPage;
