import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputAdornment } from '@mui/material';
import {FiSearch} from "react-icons/fi";
import TextField from '../../atoms/TextField/TextField';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { initialPaginationValues } from '../../../utils/constant';
import { HTTP_STATUS, type IPagination } from '../../../utils/types';
import SkillsTableTemplate from '../../templates/Skill/SkillsTable.template';
import { useSkillService , type Skill , type SkillFilterParams} from '../../../services/useSkillService';

const useStyles = createUseStyles((theme: any) => ({
    heading: {
        color: theme.palette.background.neutral.neutral900,
    },
    title: {
        color: theme.palette.background.neutral.neutral900
    },
    value: {
        color: theme.palette.background.neutral.neutral900
    },
}));

const ListingSkillsPage : React.FC = () => {

    const classes = useStyles();
    const { showSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();

    const skillService = useSkillService();

    const [skills , setSkills] = useState<Skill[]>([]);

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFilters] = useState<SkillFilterParams>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 50,
    });

    const refreshSkills = async (page: number, size: number) => {
        const params: SkillFilterParams = {
            page: page,
            size: size,
            search: filters?.search?.trim(),
        };
        await skillService.getByProfile(params)
            .then(res => {
                if (res.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setSkills(res?.data?.data?.content)
                }
            }).catch(error => {
                showSnackbar('error', error);
                setSkills([]);
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
        refreshSkills(pagination.currentPage, pagination.pageSize);
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
            <SkillsTableTemplate skills={skills} filters={filters} pagination={pagination} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} />
        </div>
    )
}

export default ListingSkillsPage;