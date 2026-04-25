import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ColorThemeListingTemplate from '../../templates/ColorTheme/ColorThemeListing.template';
import { useColorThemeService, type ColorTheme, type ColorThemeFilterRequest } from '../../../services/useColorThemeService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import Button from '../../atoms/Button/Button';
import { FiPlus } from 'react-icons/fi';

const ColorThemeListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const colorThemeService = useColorThemeService();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

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
        refreshColorThemes(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
        };
        setSearchParams(params);
    }, [pagination.currentPage, pagination.pageSize]);

    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAddTheme = () => {
        navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_ADD, {}));
    };

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Color Theme List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddTheme}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Theme"}
                        startIcon={isMobile ? <FiPlus /> : ""}
                        className={isMobile ? 'w-12 h-12 rounded-full' : ''}
                    />
                </div>
            </div>

            <ColorThemeListingTemplate 
                colorThemes={colorThemes} 
                pagination={pagination}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                onRefresh={() => refreshColorThemes(pagination.currentPage.toString(), pagination.pageSize.toString())} 
            />
        </div>
    )
}

export default ColorThemeListingPage;
