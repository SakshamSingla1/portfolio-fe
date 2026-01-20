import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { RoleOptions, StatusOptions, type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type NavlinkResponse, type NavlinkFilterRequest } from "../../../services/useNavlinkService";
import { FiEdit, FiEye, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiPlus } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";
import { enumToNormalKey } from "../../../utils/helper";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";

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
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handleAddNavlink = () => {
        navigate(makeRoute(ADMIN_ROUTES.NAVLINKS_ADD, {}));
    }

    const handleEdit = (role: string, index: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
            role: searchParams.get("role") || "",
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
            role: searchParams.get("role") || "",
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
            <div className={`flex ${isMobile ? 'justify-end' : 'justify-center'} space-x-2`} title=''>
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
        `${enumToNormalKey(navlink.role)} - ${enumToNormalKey(navlink.name)} (${navlink.index})`,
        DateUtils.dateTimeSecondToDate(navlink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(navlink.updatedAt ?? ""),
        StatusOptions.find((status) => status.value === navlink.status)?.label,
        Action(navlink.role ?? "", navlink.index ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ]

    const getSchema = () => ({
        id: "1",
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns(),
        hover: true,
        striped: true
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="grid gap-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Navlink List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddNavlink}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Navlink"}
                        startIcon={isMobile ? <FiPlus /> : ""}
                        className={isMobile ? 'w-12 h-12 rounded-full' : ''}
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className={`${isMobile ? '' : 'flex justify-between items-end space-x-4'}`}>
                    {isMobile ? (
                        <div className="w-full">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-3"
                            >
                                <span className="flex items-center">
                                    <FiFilter />
                                    <span className="ml-2">Filters</span>
                                </span>
                                <span className="transform transition-transform">
                                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>

                            {showFilters && (
                                <div className="space-y-3 p-4">
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
                                    <TextField
                                        label='Search'
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={filters.search}
                                        name='search'
                                        onChange={(event) => {
                                            handleFiltersChange("search", event.target.value)
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"> <FiSearch /></InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
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
                            <div className="w-[250px]">
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
                                    fullWidth
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default NavlinkListTableTemplate;
