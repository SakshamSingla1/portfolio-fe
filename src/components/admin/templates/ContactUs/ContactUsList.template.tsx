import React, { useMemo } from 'react';
import { IPagination } from '../../../../utils/types';
import TableV1, { ColumnType, TableColumn } from '../../../molecules/TableV1/TableV1';
import { ContactUs } from '../../../../services/useContactUsService';
import ContactForm from '../../../atoms/ContactForm/ContactForm';

interface IContactUsListTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    onPageChange: (event: any, newPage: number) => void;
    onRowsPerPageChange: (event: any) => void;
    onRowClick?: (contactUs: ContactUs) => void;
}

const ContactUsListTemplate: React.FC<IContactUsListTemplateProps> = ({ 
    contactUs, 
    pagination, 
    onPageChange, 
    onRowsPerPageChange,
    onRowClick 
}) => {

    const schema = {
        id: 'contactUs-list',
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: onPageChange,
            handleChangeRowsPerPage: onRowsPerPageChange
        },
        columns: [
            { 
                label: "Sr No.", 
                key: "index", 
                type: "number" as ColumnType, 
                props: { 
                    style: { width: '80px' } 
                } 
            },
            { 
                label: "Name", 
                key: "name", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Email", 
                key: "email", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Phone", 
                key: "phone", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Message", 
                key: "message", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "created", 
                key: "created", 
                type: "string" as ColumnType,
                props: {} 
            },
        ] as TableColumn[]
    };

    const records = useMemo(() => {
        return contactUs.map((contact: ContactUs, index: number) => {
            const date = new Date(contact.created);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            
            return [
                pagination.currentPage + index,
                contact.name,
                contact.email,
                contact.phone,
                contact.message,
                formattedDate,
            ];
        });
    }, [contactUs, pagination.currentPage, pagination.pageSize]);
    return (
        <div>
            <div className={`pt-8`}>
                <TableV1 schema={schema} records={records} />
            </div>
            <div className="pt-8 ">
                <ContactForm />
            </div>
        </div>
    );
};

export default ContactUsListTemplate;