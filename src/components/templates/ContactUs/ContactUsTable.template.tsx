import React, { useMemo, useCallback, useState } from "react";
import { type ColumnType, type TableSelection } from "../../organisms/Table/TableV1";
import { type IPagination, useColors } from "../../../utils/types";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell, { type BulkAction } from "../Shared/ListingShell.template";
import { type ContactUs } from "../../../services/useContactUsService";
import { DateUtils } from "../../../utils/helper";
import { exportToCsv } from "../../../utils/csvExport";
import ActionButtons from "../../atoms/TableUtils/ActionButtons";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import MessageDetailModal from "../../atoms/MessageDetailModal/MessageDetailModal";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { FaEnvelope } from "react-icons/fa";
import { TbMailOpened } from "react-icons/tb";

type ReadFilter = "all" | "UNREAD" | "READ";

interface ContactUsTableTemplateProps {
    contactUs: ContactUs[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleMarkRead: (id: number | null) => void;
    handleBulkMarkRead?: (ids: number[]) => void | Promise<void>;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
}

const ContactUsTableTemplate: React.FC<ContactUsTableTemplateProps> = ({
    contactUs,
    pagination,
    handlePaginationChange,
    handleRowsPerPageChange,
    handleMarkRead,
    handleBulkMarkRead,
    searchValue,
    onSearchChange
}) => {

    const isMobile = useIsMobile();
    const colors = useColors();
    const [selectedMessage, setSelectedMessage] = useState<ContactUs | null>(null);
    const [readFilter, setReadFilter] = useState<ReadFilter>("all");
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const handleView = useCallback(async (message: ContactUs) => {
        setSelectedMessage(message);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedMessage(null);
        if (selectedMessage?.status === 'UNREAD') {
            handleMarkRead(selectedMessage.id ?? 0);
        }
    }, [selectedMessage, handleMarkRead]);

    const visibleMessages = useMemo(() => {
        if (readFilter === "all") return contactUs;
        return contactUs.filter((m) => m.status === readFilter);
    }, [contactUs, readFilter]);

    const unreadOnPage = useMemo(() => contactUs.filter((m) => m.status === "UNREAD").length, [contactUs]);

    const selection: TableSelection = useMemo(() => ({
        selectedIds,
        getRowId: (_row, index) => visibleMessages[index]?.id ?? index,
        onToggle: (id) => setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(Number(id))) next.delete(Number(id)); else next.add(Number(id));
            return next;
        }),
        onToggleAll: (ids) => setSelectedIds((prev) =>
            ids.every((id) => prev.has(Number(id))) ? new Set() : new Set(ids.map(Number))
        ),
    }), [selectedIds, visibleMessages]);

    const bulkActions: BulkAction[] = useMemo(() => [
        {
            label: "Mark as read",
            icon: <TbMailOpened size={13} />,
            onClick: async () => {
                await handleBulkMarkRead?.(Array.from(selectedIds));
                setSelectedIds(new Set());
            },
        },
    ], [selectedIds, handleBulkMarkRead]);

    const records = useMemo(() => visibleMessages?.map((contactUsItem: ContactUs, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        contactUsItem.name,
        contactUsItem.email,
        contactUsItem.phone,
        <ResourceStatus
            key={`status-${contactUsItem.id}`}
            status={contactUsItem.status}
            colourMap={{ UNREAD: colors.primary600, READ: colors.neutral400 }}
        />,
        DateUtils.formatDateTimeToDateMonthYear(contactUsItem.createdAt),
        <ActionButtons key={contactUsItem.id} onView={() => handleView(contactUsItem)} />
    ]) ?? [], [visibleMessages, pagination.currentPage, pagination.pageSize, handleView, colors]);

    const schema = useMemo(() => ({
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
        columns: [
            { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "high" as const },
            { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
            { label: "Email", key: "email", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
            { label: "Phone", key: "phone", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
            { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
            { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: "low" as const },
            { label: "Actions", key: "actions", type: "action" as ColumnType, props: { className: '' }, priority: "low" as const },
        ],
        hover: true,
        striped: true
    }), [isMobile, pagination, handlePaginationChange, handleRowsPerPageChange]);

    const filterButtons: { key: ReadFilter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "UNREAD", label: `Unread${unreadOnPage ? ` (${unreadOnPage})` : ""}` },
        { key: "READ", label: "Read" },
    ];

    const filterContent = (
        <div className="flex items-center gap-1.5 flex-wrap">
            {filterButtons.map(({ key, label }) => {
                const active = readFilter === key;
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setReadFilter(key)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                        style={{
                            background: active ? colors.primary100 : colors.neutral100,
                            color: active ? colors.primary700 : colors.neutral500,
                            border: `1px solid ${active ? colors.primary300 : colors.neutral300}`,
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <ListingShell
            title="Messages"
            icon={<FaEnvelope />}
            description="Visitor inquiries and contact"
            count={pagination.totalRecords}
            isAddButtonVisible={false}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filterContent={filterContent}
            onExport={() => exportToCsv("messages", contactUs.map((m) => ({
                id: m.id, name: m.name, email: m.email, phone: m.phone,
                status: m.status, createdAt: m.createdAt, message: m.message,
            })))}
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            bulkActions={bulkActions}
        >
            <>
                <TableV1
                    schema={schema}
                    records={records}
                    selection={handleBulkMarkRead ? selection : undefined}
                />
                {selectedMessage && (
                    <MessageDetailModal message={selectedMessage} onClose={handleClose} />
                )}
            </>
        </ListingShell>
    )
}
export default ContactUsTableTemplate;
