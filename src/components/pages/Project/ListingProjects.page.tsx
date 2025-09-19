import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { InputAdornment } from '@mui/material';
import {FiSearch} from "react-icons/fi";
import TextField from '../../atoms/TextField/TextField';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { initialPaginationValues } from '../../../utils/constant';
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import ProjectsTableTemplate from '../../templates/Project/ProjectsTable.template';
import { useProjectService , type ProjectResponse , type ProjectFilterParams} from '../../../services/useProjectService';

const ListingProjectsPage : React.FC = () => {
    const { showSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();

    const projectService = useProjectService();

    const [projects , setProjects] = useState<ProjectResponse[]>([]);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFilters] = useState<ProjectFilterParams>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 50,
    });

    const refreshProjects = async (page: number, size: number) => {
        const params: ProjectFilterParams = {
            page: page,
            size: size,
            search: filters?.search?.trim(),
        };
        await projectService.getByProfile(params)
            .then(res => {
                if (res.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setProjects(res?.data?.data?.content)
                }
            }).catch(error => {
                showSnackbar('error', error);
                setProjects([]);
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setPagination({ ...pagination, currentPage: 0 });
        setFilters({ ...filters, [name]: value ?? "" });
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 50);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    useEffect(() => {
        refreshProjects(pagination.currentPage, pagination.pageSize);
    }, [pagination.currentPage, pagination.pageSize, filters.search]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div className='grid gap-y-4'>
            <div className='flex justify-end'>
                <div className={`w-[230px]`}>
                    <TextField
                        label=''
                        placeholder="Search.."
                        name='search'
                        value={filters.search}
                        onChange={(e: any) => handleFiltersChange("search", e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" className="pl-[11px]"> <FiSearch /></InputAdornment>,
                        }}
                    />
                </div>
            </div>
            <ProjectsTableTemplate projects={projects} filters={filters} pagination={pagination} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} />
        </div>
    )
}

export default ListingProjectsPage;