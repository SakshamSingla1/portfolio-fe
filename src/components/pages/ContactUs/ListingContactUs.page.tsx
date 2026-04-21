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

const ContactUsListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const contactUsService = useContactUsService();
    const { showSnackbar } = useSnackbar();

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
    const [contactUs, setContactUs] = useState<ContactUs[]>([]);

    const refreshTemplates = async (page: string, size: string) => {
        const params: ContactUsFilterParams = {
            page: page,
            size: size,
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters?.search,
        };
        await contactUsService.getByProfile(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setContactUs(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching contact us:", error);
                setContactUs([]);
                showSnackbar('error', 'Failed to load contact us');
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

    const handleMarkRead = async (id?: string) => {
        if (!id) {
            console.warn("Invalid ID");
            return;
        }
        try {
            const response = await contactUsService.markAsRead(id);
            if (response.status === HTTP_STATUS.OK) {
                setContactUs(prev => prev.map(item => item.id === id ? { ...item, status: "READ" } : item));
                showSnackbar('success', 'Marked as read successfully');
            }
        } catch (error: any) {
            console.log("Backend error:", error?.response?.data);
            showSnackbar('error', 'Failed to mark as read');
        }
    };

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
                                    placeholder="Search inquiries..."
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

            <ContactUsTableTemplate 
                contactUs={contactUs} 
                pagination={pagination} 
                handlePaginationChange={handlePaginationChange} 
                handleRowsPerPageChange={handleRowsPerPageChange} 
                handleMarkRead={handleMarkRead}
            />
        </div>
    )
}

export default ContactUsListPage;
