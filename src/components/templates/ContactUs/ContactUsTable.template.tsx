import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type ContactUs, type ContactUsFilterParams } from "../../../services/useContactUsService";
import { FiSearch } from "react-icons/fi";
import { DateUtils } from "../../../utils/helper";
import { FiFilter, FiChevronUp, FiChevronDown } from "react-icons/fi";

interface ContactUsTableTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ContactUsFilterParams;
}

const ContactUsTableTemplate: React.FC<ContactUsTableTemplateProps> = ({ contactUs, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const getRecords = () => contactUs?.map((contactUs: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUs.name,
        contactUs.email,
        contactUs.phone,
        contactUs.message,
        DateUtils.formatDateTimeToDateMonthYear(contactUs.createdAt)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Email", key: "email", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Phone", key: "phone", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Message", key: "message", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Contact Us List
                    </h1>
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
            <div>
                <Table 
                    schema={getSchema()} 
                    records={getRecords()} 
                />
            </div>
        </div>
    )
}
export default ContactUsTableTemplate;