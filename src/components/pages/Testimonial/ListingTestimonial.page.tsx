import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import TestimonialListTableTemplate from '../../templates/Testimonial/TestimonialTable.template';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { useTestimonialService, type Testimonial, type TestimonialFilterParams } from '../../../services/useTestimonialService';

const TestimonialListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const testimonialService = useTestimonialService();
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
    const [testimonials, setTestimonialsTo] = useState<Testimonial[]>([]);

    const refreshTestimonials = async (page: string, size: string) => {
        const params: TestimonialFilterParams = {
            page: page,
            size: size,
            sortDir: "DESC",
            sortBy: "createdAt",
            search: filters?.search,
        };
        await testimonialService.getAll(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setTestimonialsTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching experiences:", error);
                setTestimonialsTo([]);
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
        refreshTestimonials(pagination.currentPage.toString(), pagination.pageSize.toString());
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
            <TestimonialListTableTemplate testimonials={testimonials} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default TestimonialListPage;
