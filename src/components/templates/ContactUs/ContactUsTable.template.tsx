import React, { useState } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { type ContactUs } from "../../../services/useContactUsService";
import { DateUtils } from "../../../utils/helper";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import MessageDetailModal from "../../atoms/MessageDetailModal/MessageDetailModal";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ContactUsTableTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleMarkRead: (id: number | null) => void;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const ContactUsTableTemplate: React.FC<ContactUsTableTemplateProps> = ({ 
    contactUs, 
    pagination, 
    handlePaginationChange, 
    handleRowsPerPageChange, 
    handleMarkRead,
    searchValue,
    onSearchChange
}) => {

    const isMobile = useIsMobile();
    const [selectedMessage, setSelectedMessage] = useState<ContactUs | null>(null);

    const handleView = async (message: ContactUs) => {
        setSelectedMessage(message);
    }

    const handleClose = () => {
        setSelectedMessage(null);
        if (selectedMessage?.status === 'UNREAD') {
            handleMarkRead(selectedMessage.id ?? 0);
        }
    }

    const Action = (message: ContactUs) => <ActionButtons onView={() => handleView(message)} />;

    const getRecords = () => contactUs?.map((contactUs: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUs.name,
        contactUs.email,
        contactUs.phone,
        <ResourceStatus status={contactUs.status} />,
        DateUtils.formatDateTimeToDateMonthYear(contactUs.createdAt),
        Action(contactUs)
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Email", key: "email", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Phone", key: "phone", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
        { label: "Actions", key: "actions", type: "action" as ColumnType, props: { className: '' }, priority: "low" as const },
    ]

    const getSchema = () => ({
        id: 1,
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
        <ListingShell 
            title="Messages" 
            description="Visitor inquiries and contact" 
            count={pagination.totalRecords} 
            isAddButtonVisible={false}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
        >
            <>
                <TableV1
                    schema={getSchema()}
                    records={getRecords()}
                />
                {selectedMessage && (
                    <MessageDetailModal message={selectedMessage} onClose={handleClose} />
                )}
            </>
        </ListingShell>
    )
}
export default ContactUsTableTemplate;
