import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM } from '../../../utils/types';
import { initialPaginationValues, ADMIN_ROUTES } from '../../../utils/constant';
import EducationTable from '../../templates/Education/EducationsTable.template';
import { useEducationService, type Education, type EducationFilterParams } from '../../../services/useEducationService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { makeRoute } from '../../../utils/helper';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiPlus, FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";

const ListingEducationPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const educationService = useEducationService();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [educations, setEducationsTo] = useState<Education[]>([]);

    const refreshServices = async (page: string, size: string) => {
        const params: EducationFilterParams = {
            page: page,
            size: size,
            sortDir: SORT_ENUM.DESC,
            sortBy: "createdAt",
            search: filters?.search,
        };
        await educationService.getAllByProfile(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setEducationsTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching educations:", error);
                setEducationsTo([]);
                showSnackbar('error', 'Failed to load educations');
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
        refreshServices(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAddEducation = () => {
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_ADD, {}));
    }

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Education List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddEducation}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Education"}
                        startIcon={isMobile ? <FiPlus /> : ""}
                        className={isMobile ? 'w-12 h-12 rounded-full' : ''}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className={`${isMobile ? '' : 'flex justify-between items-end space-x-4'}`}>
                    {isMobile ? (
                        <div className="w-full">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-3"
                            >
                                <span className="flex items-center">
                                    <FiFilter />
                                    <span className="ml-2">Filters</span>
                                </span>
                                <span className="transform transition-transform">
                                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>

                            {showFilters && (
                                <div className="space-y-3 p-4">
                                    <TextField
                                        label='Search'
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={filters.search}
                                        name='search'
                                        onChange={(event) => {
                                            handleFiltersChange("search", event.target.value)
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"> <FiSearch /></InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="w-[250px]">
                                <TextField
                                    label=''
                                    variant="outlined"
                                    placeholder="Search...."
                                    value={filters.search}
                                    name='search'
                                    onChange={(event) => {
                                        handleFiltersChange("search", event.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" className='pl-[11px]'> <FiSearch /></InputAdornment>,
                                    }}
                                    fullWidth
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <EducationTable
                educations={educations}
                pagination={pagination}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    )
}

export default ListingEducationPage;
