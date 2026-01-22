import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, SORT_ENUM, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useSocialLinkService , type SocialLinkFilterParams, type SocialLinkResponse} from '../../../services/useSocialLinkService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import SocialLinksTable from '../../templates/SocialLinks/SocialLinksTable.template';

const ProjectListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const socialLinkService = useSocialLinkService();
    const { showSnackbar } = useSnackbar();

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
        refreshSocialLinks(pagination.currentPage.toString(), pagination.pageSize.toString());
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
            <SocialLinksTable socialLinks={socialLinks} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default ProjectListPage;
