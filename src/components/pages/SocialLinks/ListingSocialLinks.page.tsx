import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, SORT_ENUM, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useSocialLinkService, type SocialLinkFilterParams, type SocialLinkResponse } from '../../../services/useSocialLinkService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import SocialLinksTable from '../../templates/SocialLinks/SocialLinksTable.template';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiPlus, FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ADMIN_ROUTES } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { StatusOptions } from '../../../utils/types';

const ListingSocialLinksPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const socialLinkService = useSocialLinkService();
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
    const [socialLinks, setSocialLinksTo] = useState<SocialLinkResponse[]>([]);

    const refreshSocialLinks = async (page: string, size: string) => {
        const params: SocialLinkFilterParams = {
            page: page,
            size: size,
            sortDir: SORT_ENUM.DESC,
            sortBy: "createdAt",
            search: filters?.search,
            status: filters?.status,
        };
        await socialLinkService.getAll(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setSocialLinksTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching projects:", error);
                setSocialLinksTo([]);
                showSnackbar('error', 'Failed to load projects');
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

    useEffect(() => {
        refreshSocialLinks(pagination.currentPage.toString(), pagination.pageSize.toString());
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

    const handleAddSocialLink = () => {
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_ADD, {}));
    }

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Social Links List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddSocialLink}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Social Link"}
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
                                <div className="flex flex-col gap-4">
                                    <AutoCompleteInput
                                        label=""
                                        placeHolder="Select Status"
                                        options={StatusOptions}
                                        value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                                        onChange={(option: any) => {
                                            if (option) {
                                                handleFiltersChange("status", option.value);
                                            } else {
                                                handleFiltersChange("status", "");
                                            }
                                        }}
                                        onSearch={() => { }}
                                    />
                                    <TextField
                                        label=''
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
                        <div className="flex gap-4">
                            <div className="w-[250px]">
                                <AutoCompleteInput
                                    label=""
                                    placeHolder="Select Status"
                                    options={StatusOptions}
                                    value={filters.status ? StatusOptions.find(option => option.value === filters.status) : null}
                                    onChange={(option: any) => {
                                        if (option) {
                                            handleFiltersChange("status", option.value);
                                        } else {
                                            handleFiltersChange("status", "");
                                        }
                                    }}
                                    onSearch={() => { }}
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
                        </div>
                    )}
                </div>
            </div>

            <SocialLinksTable
                socialLinks={socialLinks}
                pagination={pagination}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    )
}

export default ListingSocialLinksPage;
