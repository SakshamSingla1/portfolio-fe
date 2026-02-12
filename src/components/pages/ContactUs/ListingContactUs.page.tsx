import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ContactUsTableTemplate from '../../templates/ContactUs/ContactUsTable.template';
import { useContactUsService , type ContactUs , type ContactUsFilterParams } from '../../../services/useContactUsService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';

const ContactUsListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const contactUsService = useContactUsService();
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

    return (
        <div>
            <ContactUsTableTemplate contactUs={contactUs} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} handleMarkRead={handleMarkRead} />
        </div>
    )
}

export default ContactUsListPage;
