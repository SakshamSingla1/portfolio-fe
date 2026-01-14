import React from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type ProjectResponse, type ProjectFilterParams } from "../../../services/useProjectService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";

interface ProjectsTableTemplateProps {
    projects: ProjectResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ProjectFilterParams;
}

const ProjectsTableTemplate: React.FC<ProjectsTableTemplateProps> = ({ projects, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const handleAddProject = () => {
        navigate(makeRoute(
            ADMIN_ROUTES.PROJECTS_ADD,{}
        ));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_VIEW, { query, params: { id: id } }));
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

    const getRecords = () => projects?.map((project: ProjectResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        project.projectName,
        project.projectStartDate,
        project.projectEndDate,
        project.workStatus,
        Action(project.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Start Date", key: "startDate", type: "text" as ColumnType, props: { className: '' } },
        { label: "End Date", key: "endDate", type: "text" as ColumnType, props: { className: '' } },
        { label: "Work Status", key: "workStatus", type: "text" as ColumnType, props: { className: '' } },
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
                <div className={`text-2xl font-semibold my-auto`}>Project List</div>
                <Button 
                    onClick={handleAddProject}
                    variant="primaryContained"
                    label="Add New Project"
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
export default ProjectsTableTemplate;