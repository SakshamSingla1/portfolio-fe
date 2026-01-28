import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import TableV1 from "../../organisms/TableV1/TableV1";
import { FiEdit, FiEye, FiSearch, FiPlus, FiFilter, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import Button from "../../atoms/Button/Button";
import type { Certification, CertificationFilterParams } from "../../../services/useCertificationService";
import { DateUtils } from "../../../utils/helper";

interface ICertificationsTableTemplateProps {
    certifications: Certification[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: CertificationFilterParams;
}

const CertificationsTableTemplate: React.FC<ICertificationsTableTemplateProps> = ({ certifications, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handleAddCertification = () => {
        navigate(makeRoute(ADMIN_ROUTES.CERTIFICATIONS_ADD, {}));
    }

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.CERTIFICATIONS_EDIT, {
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
            makeRoute(ADMIN_ROUTES.CERTIFICATIONS_VIEW, {
                params: { id },
                query: query
            })
        );
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

    const getRecords = () =>
        certifications.map((certification, index) => {
            const issue = certification.issueDate ?? "";
            const expiry = certification.expiryDate ?? "Present";
            const duration = issue || expiry ? `${issue} - ${expiry}` : "";
            return [
                pagination.currentPage * pagination.pageSize + index + 1,
                `${certification.title} - ${certification.order}`,
                certification.issuer,
                duration,
                DateUtils.dateTimeSecondToDate(certification.createdAt ?? ""),
                DateUtils.dateTimeSecondToDate(certification.updatedAt ?? ""),
                Action(certification.id ?? "")
            ];
        });

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Issuer", key: "issuer", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Duration", key: "duration", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Created At", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Updated At", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
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
                            Certifications List
                        </h1>
                    </div>
                    <Button
                        onClick={handleAddCertification}
                        variant={isMobile ? "primaryText" : "primaryContained"}
                        label={isMobile ? "" : "Add New Certification"}
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
            <TableV1 schema={getSchema()} records={getRecords()} />
        </div>
    )
}
export default CertificationsTableTemplate;