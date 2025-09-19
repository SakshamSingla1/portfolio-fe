import React from 'react';
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { type IPagination } from '../../../utils/types';
import { type ContactUs } from '../../../services/useContactUsService';
import { DateUtils } from '../../../utils/helper';

interface IContactUsListTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
}

const ContactUsTableTemplate: React.FC<IContactUsListTemplateProps> = ({ contactUs, pagination, handlePaginationChange, handleRowsPerPageChange }) => {

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

    const getRecords = () => contactUs?.map((contactUs: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUs.name,
        contactUs.email,
        contactUs.phone,
        contactUs.message,
        DateUtils.formatDateTimeToDateMonthYear(contactUs.created)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { align: "center" } },
        { label: "Name", key: "name", type: "string" as ColumnType, props: {} },
        { label: "Email", key: "email", type: "string" as ColumnType, props: {} },
        { label: "Phone", key: "phone", type: "string" as ColumnType, props: {} },
        { label: "Message", key: "message", type: "string" as ColumnType, props: {} },
        { label: "Created", key: "created", type: "string" as ColumnType, props: {} },
      ];

    return (
        <div>
            <TableV1 schema={getSchema()} records={getRecords()} />
        </div>
    )
}

export default ContactUsTableTemplate;
