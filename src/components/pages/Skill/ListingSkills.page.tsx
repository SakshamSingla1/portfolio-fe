import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import SkillTableTemplate from '../../templates/Skill/SkillsTable.template';
import { useSkillService, type SkillResponse, type SkillFilterParams, type SkillStats } from '../../../services/useSkillService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';

const ListingSkillsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const skillService = useSkillService();
    const { showSnackbar } = useSnackbar();

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
    const [skills, setSkills] = useState<SkillResponse[]>([]);

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
            console.error("Error loading skill stats:", error);
        }
    };

    const refreshSkills = async (page: string, size: string) => {
        try {
            const params: SkillFilterParams = {
                page: page,
                size: size,
                search: filters?.search,
            };
            const response = await skillService.getByProfile(params);
            if (response?.status === HTTP_STATUS.OK) {
                const { totalElements, totalPages } = response?.data?.data;
                setPagination((prev) => ({
                    ...prev,
                    totalPages: totalPages,
                    totalRecords: totalElements
                }));
                setSkills(response?.data?.data?.content);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
            setSkills([]);
            showSnackbar('error', 'Failed to load skills');
        }
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
        refreshSkills(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

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
                pagination={pagination}
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
