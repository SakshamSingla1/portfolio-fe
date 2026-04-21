import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import TableV1 from "../../organisms/Table/TableV1";
import { type ContactUs } from "../../../services/useContactUsService";
import { DateUtils } from "../../../utils/helper";
import { FiEye } from "react-icons/fi";
import { capitalizeFirstLetter } from "../../../utils/helper"
import MessageDetailModal from "../../atoms/MessageDetailModal/MessageDetailModal";

interface ContactUsTableTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    handleMarkRead: (id: string) => void;
}

const ContactUsTableTemplate: React.FC<ContactUsTableTemplateProps> = ({ contactUs, pagination, handlePaginationChange, handleRowsPerPageChange, handleMarkRead }) => {

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<ContactUs | null>(null);

    const handleView = async (message: ContactUs) => {
        setSelectedMessage(message);
    }

    const handleClose = () => {
        setSelectedMessage(null);
        if (selectedMessage?.status === 'UNREAD') {
            handleMarkRead(selectedMessage.id ?? '');
        }
    }

    const Action = (message: ContactUs) => {
        return (
            <div className={`flex ${isMobile ? 'justify-end' : ''} space-x-2`} title=''>
                <button onClick={() => handleView(message)} className={`w-6 h-6`}>
                    <FiEye />
                </button>
            </div>
        );
    };

    const getRecords = () => contactUs?.map((contactUs: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUs.name,
        contactUs.email,
        contactUs.phone,
        capitalizeFirstLetter(contactUs.status),
        DateUtils.formatDateTimeToDateMonthYear(contactUs.createdAt),
        Action(contactUs)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Email", key: "email", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Phone", key: "phone", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Status", key: "status", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Actions", key: "actions", type: "action" as ColumnType, props: { className: '' }, priority: "low" as const },
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
        <>
            <TableV1
                schema={getSchema()}
                records={getRecords()}
            />
            {selectedMessage && (
                <MessageDetailModal message={selectedMessage} onClose={handleClose} />
            )}
        </>
    )
}
export default ContactUsTableTemplate;