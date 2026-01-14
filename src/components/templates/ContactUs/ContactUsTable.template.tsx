import React from "react";
import { type ColumnType } from "../../organisms/TableV1/TableV1";
import { type IPagination } from "../../../utils/types";
import TextField from "../../atoms/TextField/TextField";
import { InputAdornment } from '@mui/material';
import Table from "../../organisms/TableV1/TableV1";
import { type ContactUs, type ContactUsFilterParams } from "../../../services/useContactUsService";
import { FiSearch } from "react-icons/fi";
import { DateUtils } from "../../../utils/helper";

interface ContactUsTableTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: ContactUsFilterParams;
}

const ContactUsTableTemplate: React.FC<ContactUsTableTemplateProps> = ({ contactUs, pagination, handleFiltersChange, handlePaginationChange, handleRowsPerPageChange, filters }) => {

    const getRecords = () => contactUs?.map((contactUs: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUs.name,
        contactUs.email,
        contactUs.phone,
        contactUs.message,
        DateUtils.formatDateTimeToDateMonthYear(contactUs.createdAt)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' } },
        { label: "Logo", key: "logo", type: "custom" as ColumnType, props: { className: '' } },
        { label: "Level", key: "level", type: "text" as ColumnType, props: { className: '' } },
        { label: "Category", key: "category", type: "custom" as ColumnType, props: { className: '' } },
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
                <div className={`text-2xl font-semibold my-auto`}>Contact Us List</div>
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
export default ContactUsTableTemplate;