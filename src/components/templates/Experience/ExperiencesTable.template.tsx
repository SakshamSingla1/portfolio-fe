import React from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type ExperienceResponse, type ExperienceFilterParams ,EmploymentStatus} from "../../../services/useExperienceService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import { DateUtils } from "../../../utils/helper";

interface ExperienceTableTemplateProps {
    experiences: ExperienceResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ExperienceFilterParams;
}

const ExperienceTableTemplate: React.FC<ExperienceTableTemplateProps> = ({ experiences, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const handleAddExperience = () => {
        navigate(makeRoute(
            ADMIN_ROUTES.EXPERIENCE_ADD,{}
        ));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { query, params: { id: id } }));
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

    const getRecords = () => experiences?.map((experience: ExperienceResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        experience.companyName,
        experience.jobTitle,
        experience.location,
        experience.employmentStatus === EmploymentStatus.CURRENT ? DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - Present" : DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - " + DateUtils.formatDateTimeToDateMonthYear(experience.endDate || ""),
        Action(experience.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Company Name", key: "companyName", type: "text" as ColumnType, props: { className: '' } },
        { label: "Job Title", key: "jobTitle", type: "text" as ColumnType, props: { className: '' } },
        { label: "Location", key: "location", type: "text" as ColumnType, props: { className: '' } },
        { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' } },
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
                <div className={`text-2xl font-semibold my-auto`}>Experience List</div>
                <Button 
                    onClick={handleAddExperience}
                    variant="primaryContained"
                    label="Add New Experience"
                />
            </div>
            <div className='flex justify-end'>
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
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default ExperienceTableTemplate;