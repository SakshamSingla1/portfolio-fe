import React from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import TableV1 from "../../organisms/TableV1/TableV1";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import type { Education, EducationFilterParams } from "../../../services/useEducationService";

interface IEducationsTableTemplateProps {
    educations: Education[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: EducationFilterParams;
}

const EducationsTableTemplate: React.FC<IEducationsTableTemplateProps> = ({ educations, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleAddEducation = () => {
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_ADD, {}));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, {
                params: { id },
                query: query    
            })
        );
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, {
                params: { id },
                query: query
            })
        );
    }

    const Action = (id: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={() => handleEdit(id)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(id)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => educations?.map((education: Education, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        education.institution,
        education.degree,
        DateUtils.dateTimeSecondToDate(education.startYear ?? ""),
        DateUtils.dateTimeSecondToDate(education.endYear ?? ""),
        Action(education.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Institution", key: "institution", type: "text" as ColumnType, props: { className: '' } },
        { label: "Degree", key: "degree", type: "text" as ColumnType, props: { className: '' } },
        { label: "Start Year", key: "startYear", type: "date" as ColumnType, props: { className: '' } },
        { label: "End Year", key: "endYear", type: "date" as ColumnType, props: { className: '' } },
        { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' } },
    ]

    const getSchema = () => ({
        id: "1",
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns() ?? []
    });

    return (
        <div className="grid gap-y-4">
            <div className='flex justify-between'>
                <div className={`text-2xl font-semibold my-auto`}>Education List</div>
                <Button 
                    onClick={() => handleAddEducation()}
                    variant="primaryContained"
                    label="Add New Education"
                />
            </div>
            <div className='flex justify-between'>
                <div className={`w-[250px]`}>
                    <TextField
                        label=''
                        variant="outlined"
                        placeholder="Search...."
                        value={filters.search}
                        name='search'
                        onChange={(event) => {
                            handleFiltersChange("search", event.target.value)
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" className='pl-[11px]'> <FiSearch /></InputAdornment>,
                        }}
                    />
                </div>
            </div>
            <TableV1 schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default EducationsTableTemplate;
