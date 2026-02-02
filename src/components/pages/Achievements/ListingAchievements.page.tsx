import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import AchievementListTableTemplate from '../../templates/Achievements/AchievementTable.template';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { useAchievementService, type Achievement, type AchievementFilterParams } from '../../../services/useAchievementService';
import AchievementCard from '../../public-view/Achievement.card';

const AchievementListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const achievementService = useAchievementService();
    const { showSnackbar } = useSnackbar();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [achievements, setAchievementsTo] = useState<Achievement[]>([]);

    const refreshAchievements = async (page: string, size: string) => {
        const params: AchievementFilterParams = {
            page: page,
            size: size,
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters?.search,
        };
        await achievementService.getAll(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setAchievementsTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching experiences:", error);
                setAchievementsTo([]);
                showSnackbar('error', 'Failed to load experiences');
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
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
        refreshAchievements(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div>
            <AchievementListTableTemplate achievements={achievements} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {achievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                    />
                ))}
            </div>
        </div>
    )
}

export default AchievementListPage;
