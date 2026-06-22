import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM, StatusOptions } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import NavlinkListTableTemplate from '../../templates/Navlinks/NavlinksListing.template';
import { useNavlinkService, type NavlinkResponse, type NavlinkFilterRequest } from '../../../services/useNavlinkService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';

const NavlinkListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navlinkService = useNavlinkService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

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

    return (
        <NavlinkListTableTemplate 
            navlinks={navlinks} 
            pagination={pagination} 
            handlePaginationChange={handlePaginationChange} 
            handleRowsPerPageChange={handleRowsPerPageChange} 
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            filterContent={
                <div className="w-full sm:w-72">
                    <AutoCompleteInput
                        label={isMobile ? "Status" : ""}
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
            }
        />
    )
}

export default NavlinkListingPage;
