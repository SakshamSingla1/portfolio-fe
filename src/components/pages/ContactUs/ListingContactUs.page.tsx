import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ContactUsTableTemplate from '../../templates/ContactUs/ContactUsTable.template';
import { useContactUsService, type ContactUs, type ContactUsFilterParams } from '../../../services/useContactUsService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import TextField from '../../atoms/TextField/TextField';
import { InputAdornment } from '@mui/material';
import { FiFilter, FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '../../../hooks/useIsMobile';

const ContactUsListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const contactUsService = useContactUsService();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();

    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filters, setFiltersTo] = useState<any>({
        search: searchParams.get("search") || "",
    });
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const queryParams: ContactUsFilterParams = {
        page: pagination.currentPage.toString(),
        size: pagination.pageSize.toString(),
        sortDir: "DESC",
        sortBy: "createdAt",
        search: filters.search,
    };

    const { data: queryResult } = useQuery({
        queryKey: ['contactUs', queryParams],
        queryFn: async () => {
            const res = await contactUsService.getByProfile(queryParams);
            if (res?.status === HTTP_STATUS.OK) {
                return res.data.data;
            }
            return null;
        },
        placeholderData: (prev) => prev,
    });

    const contactUs: ContactUs[] = queryResult?.content ?? [];
    const totalPages: number = queryResult?.totalPages ?? 0;
    const totalRecords: number = queryResult?.totalElements ?? 0;

    const currentPagination: IPagination = {
        ...pagination,
        totalPages,
        totalRecords,
    };

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo((prev: any) => ({ ...prev, [name]: value ?? "" }));
        setPagination((prev) => ({ ...prev, currentPage: 0 }));
    };

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prev) => ({ ...prev, pageSize: newRowsPerPage }));
    };

    const handleMarkRead = async (id?: string) => {
        if (!id) return;
        try {
            const response = await contactUsService.markAsRead(id);
            if (response.status === HTTP_STATUS.OK) {
                queryClient.setQueryData(['contactUs', queryParams], (old: any) => {
                    if (!old?.content) return old;
                    return {
                        ...old,
                        content: old.content.map((item: ContactUs) =>
                            item.id === id ? { ...item, status: "READ" } : item
                        ),
                    };
                });
                showSnackbar('success', 'Marked as read successfully');
            }
        } catch {
            showSnackbar('error', 'Failed to mark as read');
        }
    };

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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Contact Us Inquiries
                        </h1>
                    </div>
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
                                    <TextField
                                        label='Search'
                                        variant="outlined"
                                        placeholder="Search inquiries..."
                                        value={filters.search}
                                        name='search'
                                        onChange={(event) => handleFiltersChange("search", event.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-[250px]">
                            <TextField
                                label=''
                                variant="outlined"
                                placeholder="Search inquiries..."
                                value={filters.search}
                                name='search'
                                onChange={(event) => handleFiltersChange("search", event.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" className='pl-[11px]'><FiSearch /></InputAdornment>,
                                }}
                                fullWidth
                            />
                        </div>
                    )}
                </div>
            </div>

            <ContactUsTableTemplate
                contactUs={contactUs}
                pagination={currentPagination}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                handleMarkRead={handleMarkRead}
            />
        </div>
    );
};

export default ContactUsListPage;
