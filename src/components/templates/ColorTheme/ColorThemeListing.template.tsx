import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from "@mui/material";
import Table from "../../organisms/TableV1/TableV1";
import { type ColorTheme, type ColorThemeFilterRequest } from "../../../services/useColorThemeService";
import { makeRoute, DateUtils } from "../../../utils/helper";
import { FiEdit, FiEye, FiSearch, FiFilter, FiPlus, FiChevronDown , FiChevronUp} from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import Select from "../../atoms/Select/Select";
import { StatusOptions } from "../../../utils/types";

interface ColorThemeListingTemplateProps {
    colorThemes: ColorTheme[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ColorThemeFilterRequest
}

const ColorThemeListingTemplate: React.FC<ColorThemeListingTemplateProps> = ({
    colorThemes,
    pagination,
    handleFiltersChange,
    handlePaginationChange,
    handleRowsPerPageChange,
    filters
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleEdit = (themeName: string) => {
        navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_EDIT, {
            params: {
                themeName
            },
            query: {
                page: searchParams.get("page") || "0",
                size: searchParams.get("size") || "10",
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || ""
            }
        }));
    };

    const handleView = (themeName: string) => {
        navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_VIEW, {
            params: {
                themeName
            },
            query: {
                page: searchParams.get("page") || "0",
                size: searchParams.get("size") || "10",
                search: searchParams.get("search") || "",
                status: searchParams.get("status") || ""
            }
        }));
    };

    const Action = (themeName: string) => (
            <div className={`flex ${isMobile ? 'justify-end' : 'justify-center'} space-x-2`} title=''>
            <button 
                onClick={() => handleEdit(themeName)} 
                className="w-6 h-6"
                title="Edit"
            >
                <FiEdit />
            </button>
            <button 
                onClick={() => handleView(themeName)} 
                className='w-6 h-6'
                title="View"
            >
                <FiEye />
            </button>
        </div>
    );

    const getRecords = () =>
        colorThemes?.map((theme, index) => [
            pagination.currentPage * pagination.pageSize + index + 1,
            theme.themeName,
            theme.createdAt ? DateUtils.dateTimeSecondToDate(theme.createdAt) : "-",
            theme.updatedAt ? DateUtils.dateTimeSecondToDate(theme.updatedAt) : "-",
            theme.updatedBy ?? "-",
            Action(theme.themeName ?? "")
        ]);

    const getTableColumns = () => [
        { 
            label: "Sr No.", 
            key: "srNo", 
            type: "number" as ColumnType, 
            props: {},
            priority: "low" as const,
            hideOnMobile: true
        },
        { 
            label: "Theme Name", 
            key: "themeName", 
            type: "string" as ColumnType, 
            props: {},
            priority: "high" as const
        },
        { 
            label: "Created Date", 
            key: "createdAt", 
            type: "date" as ColumnType, 
            props: {},
            priority: "medium" as const
        },
        { 
            label: "Last Modified", 
            key: "updatedAt", 
            type: "date" as ColumnType, 
            props: {},
            priority: "medium" as const,
            hideOnMobile: true
        },
        { 
            label: "Updated By", 
            key: "updatedBy", 
            type: "string" as ColumnType, 
            props: {},
            priority: "low" as const,
            hideOnMobile: true
        },
        { 
            label: "Action", 
            key: "action", 
            type: "custom" as ColumnType, 
            props: {},
            priority: "high" as const
        },
    ];

    const getSchema = () => ({
        id: "color-theme-table",
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

    return (
        <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Color Theme List
                        </h1>
                    </div>
                    <Button 
                        onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME_ADD, {}))}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Color Theme"}
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
                                    <Select
                                        label="Status"
                                        options={StatusOptions}
                                        value={filters.status || ""}
                                        onChange={(value) => handleFiltersChange("status", value)}
                                        fullWidth
                                        placeholder="Select Status"
                                    />
                                    <TextField
                                        label='Search'
                                        variant="outlined"
                                        placeholder="Search themes..."
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
                            <div className="w-[250px]">
                                <Select
                                    label=""
                                    options={StatusOptions}
                                    value={filters.status || ""}
                                    onChange={(value) => handleFiltersChange("status", value)}
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
            <div>
                <Table 
                    schema={getSchema()} 
                    records={getRecords()} 
                />
            </div>
        </div>
    );
};

export default ColorThemeListingTemplate;