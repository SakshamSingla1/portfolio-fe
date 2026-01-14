import React from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { RoleOptions, StatusOptions, type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type NavlinkResponse, type NavlinkFilterRequest } from "../../../services/useNavlinkService";
import { FiEdit, FiEye, FiSearch } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";

interface INavlinkListTableTemplateProps {
    navlinks: NavlinkResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: NavlinkFilterRequest;
}

const NavlinkListTableTemplate: React.FC<INavlinkListTableTemplateProps> = ({ navlinks, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleAddNavlink = () => {
        navigate(makeRoute(ADMIN_ROUTES.NAVLINKS_ADD, {}));
    }

    const handleEdit = (role: string, index: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.NAVLINKS_EDIT, {
                params: { role, index },
                query: query    
            })
        );
    }

    const handleView = (role: string, index: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.NAVLINKS_VIEW, {
                params: { role, index },
                query: query
            })
        );
    }

    const Action = (role: string, index: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={() => handleEdit(role, index)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(role, index)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => navlinks?.map((navlink: NavlinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        navlink.name,
        navlink.role,
        navlink.index,
        DateUtils.dateTimeSecondToDate(navlink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(navlink.updatedAt ?? ""),
        navlink.status,
        Action(navlink.role ?? "", navlink.index ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Role", key: "role", type: "text" as ColumnType, props: { className: '' } },
        { label: "Index", key: "index", type: "number" as ColumnType, props: { className: '' } },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' } },
        { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' } },
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
                <div className={`text-2xl font-semibold my-auto`}>Navlink List</div>
                <Button 
                    onClick={() => handleAddNavlink()}
                    variant="primaryContained"
                    label="Add New Navlink"
                />
            </div>
            <div className='flex justify-between'>
                <div className={`w-[250px]`}>
                    <Select
                        label="Role"
                        options={RoleOptions}
                        value={filters.role || ""}
                        onChange={(e) => handleFiltersChange("role", e)}
                        fullWidth
                        placeholder="Select Role"
                    />
                </div>
                <div className="w-[250px]">
                    <Select
                        label="Status"
                        options={StatusOptions}
                        value={filters.status || ""}
                        onChange={(e) => handleFiltersChange("status", e)}
                        fullWidth
                        placeholder="Select Status"
                    />
                </div>
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
export default NavlinkListTableTemplate;
