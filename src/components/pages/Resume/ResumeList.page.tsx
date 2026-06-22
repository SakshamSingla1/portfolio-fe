import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, StatusOptions, type IPagination } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useResumeService , type DocumentUploadResponse , type ResumeSearchParams} from '../../../services/useResumeService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackBar';
import ResumeTable from '../../templates/Resume/ResumeTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';

const ResumeListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const resumeService = useResumeService();
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
    const [resumes, setResumesTo] = useState<DocumentUploadResponse[]>([]);

    const refreshResumes = async (page: string, size: string) => {
        const params: ResumeSearchParams = {
            page: page,
            size: size,
            sortDir: "DESC",
            sortBy: "updatedAt",
            search: filters?.search,
            status: filters?.status,
        };
        await resumeService.getByProfile(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setResumesTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                console.error("Error fetching projects:", error);
                setResumesTo([]);
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
        refreshResumes(pagination.currentPage.toString(), pagination.pageSize.toString());
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
        <div>
            <ResumeTable 
                resumes={resumes} 
                pagination={pagination} 
                handlePaginationChange={handlePaginationChange} 
                handleRowsPerPageChange={handleRowsPerPageChange} 
                searchValue={filters.search}
                onSearchChange={(val) => handleFiltersChange("search", val)}
                filterContent={
                    <div className="w-full sm:w-72">
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
                }
            />
        </div>
    )
}

export default ResumeListPage;

