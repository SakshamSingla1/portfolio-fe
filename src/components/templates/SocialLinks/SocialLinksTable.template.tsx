import React, { useEffect, useState } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { StatusOptions, type IPagination } from "../../../utils/types";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { FiEye,FiEdit, FiSearch,FiPlus, FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import type { SocialLinkResponse , SocialLinkFilterParams} from "../../../services/useSocialLinkService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";

interface SocialLinksTableTemplateProps {
    socialLinks: SocialLinkResponse[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: SocialLinkFilterParams;
}

const SocialLinksTableTemplate: React.FC<SocialLinksTableTemplateProps> = ({ socialLinks, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_VIEW, { query, params: { id: id } }));
    }

    const handleAddSocialLink = () => {
        navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS_ADD, {}));
    }

    const Action = (id: string) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
                <button onClick={() => handleEdit(id)} className={`w-6 h-6`}>
                    <FiEdit />
                </button>
                <button onClick={() => handleView(id)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => socialLinks?.map((socialLink: SocialLinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        enumToNormalKey(socialLink.platform),
        StatusOptions.find((status) => status.value === socialLink.status)?.label,
        DateUtils.dateTimeSecondToDate(socialLink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(socialLink.updatedAt ?? ""),
        Action(socialLink.id)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Platform", key: "platform", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Updated At", key: "updatedAt", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
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
                            Social Links List
                        </h1>
                    </div>
                    <Button 
                        onClick={handleAddSocialLink}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Social Link"}
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
                                <div className="flex flex-col gap-4">
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
                                    <TextField
                                        label=''
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
                        <div className="flex gap-4">
                            <div className="w-[250px]">
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
                        </div>
                    )}
                </div>
            </div>
            <Table schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default SocialLinksTableTemplate;