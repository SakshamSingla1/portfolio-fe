import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM, StatusOptions } from '../../../utils/types';
import { initialPaginationValues, ADMIN_ROUTES } from '../../../utils/constant';
import NavlinkListTableTemplate from '../../templates/Navlinks/NavlinksListing.template';
import { useNavlinkService, type NavlinkResponse, type NavlinkFilterRequest } from '../../../services/useNavlinkService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { makeRoute } from '../../../utils/helper';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiPlus, FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';

const NavlinkListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navlinkService = useNavlinkService();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [navlinks, setNavlinksTo] = useState<NavlinkResponse[]>([]);

    const refreshNavlinks = async (page: string, size: string) => {
        try {
            const params: NavlinkFilterRequest = {
                page,
                size,
                sortDir: SORT_ENUM.ASC,
                sortBy: "index",
                search: filters?.search,
                status: filters?.status
            };
            const res1 = await navlinkService.getAllNavlinks(params);
            if (res1?.status === HTTP_STATUS.OK) {
                const { totalElements, totalPages } = res1?.data?.data;
                setPagination(prev => ({
                    ...prev,
                    totalPages,
                    totalRecords: totalElements
                }));
                setNavlinksTo(res1?.data?.data?.content);
            }
        } catch (error) {
            console.log(error);
            setNavlinksTo([]);
            showSnackbar('error', 'Failed to fetch navlinks');
        }
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
        refreshNavlinks(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            status: filters.status ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAddNavlink = () => {
        navigate(makeRoute(ADMIN_ROUTES.NAVLINKS_ADD, {}));
    }

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Navlinks List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddNavlink}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Navlink"}
                        startIcon={isMobile ? <FiPlus /> : ""}
                        className={isMobile ? 'w-12 h-12 rounded-full' : ''}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className={`${isMobile ? '' : 'flex justify-start items-end space-x-4'}`}>
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
                                    <AutoCompleteInput
                                        label="Status"
                                        placeHolder="Search and select a status"
                                        options={StatusOptions}
                                        value={StatusOptions.find(option => option.value === filters.status) || null}
                                        onSearch={() => { }}
                                        onChange={value => {
                                            handleFiltersChange("status", value?.value ?? null);
                                        }}
                                        isDisabled={false}
                                    />
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
                                <AutoCompleteInput
                                    label=""
                                    placeHolder="Search and select a status"
                                    options={StatusOptions}
                                    value={StatusOptions.find(option => option.value === filters.status) || null}
                                    onSearch={() => { }}
                                    onChange={value => {
                                        handleFiltersChange("status", value?.value ?? "");
                                    }}
                                    isDisabled={false}
                                />
                            </div>
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

            <NavlinkListTableTemplate 
                navlinks={navlinks} 
                pagination={pagination} 
                handlePaginationChange={handlePaginationChange} 
                handleRowsPerPageChange={handleRowsPerPageChange} 
            />
        </div>
    )
}

export default NavlinkListingPage;
