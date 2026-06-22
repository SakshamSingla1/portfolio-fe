import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import ContactUsTableTemplate from '../../templates/ContactUs/ContactUsTable.template';
import { useContactUsService, type ContactUs, type ContactUsFilterParams } from '../../../services/useContactUsService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ContactUsListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const contactUsService = useContactUsService();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

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

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prev) => ({ ...prev, pageSize: newRowsPerPage }));
    };

    const handleMarkRead = async (id?: number | null) => {
        if (!id) return;
        try {
            const response = await contactUsService.markAsRead(id);
            if (response.status === HTTP_STATUS.OK) {
                queryClient.setQueryData(['contactUs', queryParams], (old: any) => {
                    if (!old?.content) return old;
                    return {
                        ...old,
                        content: old.content.map((item: ContactUs) =>
                            String(item.id) === String(id) ? { ...item, status: "READ" } : item
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
        <ContactUsTableTemplate
            contactUs={contactUs}
            pagination={currentPagination}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handleMarkRead={handleMarkRead}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
        />
    );
};

export default ContactUsListPage;
