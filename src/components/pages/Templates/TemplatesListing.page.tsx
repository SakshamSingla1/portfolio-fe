import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM } from '../../../utils/types';
import { initialPaginationValues, ADMIN_ROUTES } from '../../../utils/constant';
import TemplateListTableTemplate from '../../templates/Templates/TemplateList.template';
import { useTemplateService, type TemplateResponse, type TemplateFilterRequest } from '../../../services/useTemplateService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { makeRoute } from '../../../utils/helper';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiPlus, FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";

const TemplatesListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const templateService = useTemplateService();
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
    const [templates, setTemplatesTo] = useState<TemplateResponse[]>([]);

    const refreshTemplates = async (page: string, size: string) => {
        const params: TemplateFilterRequest = {
            page: page,
            size: size,
            sortDir: SORT_ENUM.DESC,
            sortBy: "createdAt",
            search: filters?.search,
        };
        await templateService.getAllTemplates(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setTemplatesTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching templates:", error);
                setTemplatesTo([]);
                showSnackbar('error', 'Failed to load templates');
            })
    }

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

    const handleAddTemplate = () => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_ADD, {}));
    }

    useEffect(() => {
        refreshTemplates(pagination.currentPage.toString(), pagination.pageSize.toString());
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

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Templates List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddTemplate}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Template"}
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

            <TemplateListTableTemplate 
                templates={templates} 
                pagination={pagination} 
                handlePaginationChange={handlePaginationChange} 
                handleRowsPerPageChange={handleRowsPerPageChange} 
            />
        </div>
    )
}

export default TemplatesListingPage;
