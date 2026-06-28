import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEdit, FiEye, FiMail, FiMessageSquare, FiMessageCircle, FiInbox } from "react-icons/fi";
import type { ColumnType } from "../../organisms/Table/TableV1";
import type { IPagination } from "../../../utils/types";
import { useColors } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { DateUtils, makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import type { ListingStat } from "../Shared/ListingShell.template";
import type { INotificationTemplate } from "../../../services/useTemplateService";
import type { ChannelFilter } from "../../pages/Templates/TemplatesListing.page";

interface Props {
    templates: INotificationTemplate[];
    pagination: IPagination;
    handleFiltersChange: (name: string, value: any) => void;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
    filters: any;
    loading: boolean;
    channelFilter: ChannelFilter;
    setChannelFilter: (f: ChannelFilter) => void;
    stats: ListingStat[];
}

const TemplateListTableTemplate: React.FC<Props> = ({
    templates,
    pagination,
    handleFiltersChange,
    handlePaginationChange,
    handleRowsPerPageChange,
    filters,
    loading,
    channelFilter,
    setChannelFilter,
    stats,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const colors = useColors();
    const { isDark } = useTheme();

    const handleEdit = (id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_EDIT, {
            query: {
                page: searchParams.get("page") || "",
                size: searchParams.get("size") || "",
                search: searchParams.get("search") || "",
            },
            params: { id },
        }));
    };

    const handleView = (id: number) => {
        navigate(makeRoute(ADMIN_ROUTES.TEMPLATES_VIEW, {
            query: {
                page: searchParams.get("page") || "",
                size: searchParams.get("size") || "",
                search: searchParams.get("search") || "",
            },
            params: { id },
        }));
    };

    const ChannelBadges = (isEmail: number, isSms: number, isWhatsapp: number) => (
        <div className="flex flex-wrap gap-1">
            {isEmail === 1 && (
                <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: colors.primary100, color: colors.primary700 }}
                >
                    <FiMail size={10} /> Email
                </span>
            )}
            {isSms === 1 && (
                <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: colors.success100, color: colors.success700 }}
                >
                    <FiMessageSquare size={10} /> SMS
                </span>
            )}
            {isWhatsapp === 1 && (
                <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: colors.secondary100, color: colors.secondary700 }}
                >
                    <FiMessageCircle size={10} /> WhatsApp
                </span>
            )}
            {isEmail === 0 && isSms === 0 && isWhatsapp === 0 && (
                <span style={{ color: colors.neutral400, fontSize: 12 }}>—</span>
            )}
        </div>
    );

    const ActionCell = (id: number) => (
        <div className="flex items-center gap-3">
            <FiEye
                className="w-4 h-4 cursor-pointer transition-colors"
                style={{ color: colors.neutral400 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary600)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral400)}
                onClick={() => handleView(id)}
            />
            <FiEdit
                className="w-4 h-4 cursor-pointer transition-colors"
                style={{ color: colors.neutral400 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary600)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral400)}
                onClick={() => handleEdit(id)}
            />
        </div>
    );

    const visibleTemplates = templates.filter((t) => {
        if (channelFilter === "email")    return t.isEmail    === 1;
        if (channelFilter === "sms")      return t.isSms      === 1;
        if (channelFilter === "whatsapp") return t.isWhatsapp === 1;
        return true;
    });

    const SkeletonRow = () => (
        <tr>
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div
                        className="h-4 rounded animate-pulse"
                        style={{
                            width: i === 0 ? 28 : i === 1 ? "70%" : i === 3 ? "80%" : "50%",
                            background: isDark ? colors.neutral700 : colors.neutral200,
                        }}
                    />
                </td>
            ))}
        </tr>
    );

    const getRecords = () => {
        if (loading) return [];
        return visibleTemplates.map((t: INotificationTemplate, index) => [
            pagination.currentPage * pagination.pageSize + index + 1,
            t.template,
            t.subject || "—",
            ChannelBadges(t.isEmail, t.isSms, t.isWhatsapp),
            DateUtils.dateTimeSecondToDate(t.createdAt ?? ""),
            DateUtils.dateTimeSecondToDate(t.updatedAt ?? ""),
            ActionCell(t.id),
        ]);
    };

    const getTableColumns = () => [
        { label: "Sr No.",        key: "id",        type: "number" as ColumnType, props: {} },
        { label: "Template",      key: "template",  type: "text"   as ColumnType, props: {} },
        { label: "Subject",       key: "subject",   type: "text"   as ColumnType, props: {} },
        { label: "Channels",      key: "channels",  type: "custom" as ColumnType, props: {} },
        { label: "Created",       key: "createdAt", type: "date"   as ColumnType, props: {} },
        { label: "Last Modified", key: "updatedAt", type: "date"   as ColumnType, props: {} },
        { label: "Action",        key: "action",    type: "custom" as ColumnType, props: {} },
    ];

    const getSchema = () => ({
        id: 1,
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange,
        },
        columns: getTableColumns(),
        hover: true,
        striped: true,
    });

    const channelButtons: { key: ChannelFilter; label: string; icon: React.ReactNode }[] = [
        { key: "all",       label: "All",       icon: null },
        { key: "email",     label: "Email",     icon: <FiMail size={12} /> },
        { key: "sms",       label: "SMS",       icon: <FiMessageSquare size={12} /> },
        { key: "whatsapp",  label: "WhatsApp",  icon: <FiMessageCircle size={12} /> },
    ];

    const filterContent = (
        <div className="flex items-center gap-1.5 flex-wrap">
            {channelButtons.map(({ key, label, icon }) => {
                const active = channelFilter === key;
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setChannelFilter(key)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                        style={{
                            background: active
                                ? isDark ? colors.primary800 : colors.primary100
                                : isDark ? colors.neutral800 : colors.neutral100,
                            color: active ? colors.primary700 : colors.neutral500,
                            border: `1px solid ${active ? colors.primary300 : isDark ? colors.neutral700 : colors.neutral300}`,
                        }}
                    >
                        {icon}
                        {label}
                    </button>
                );
            })}
        </div>
    );

    const showEmpty = !loading && visibleTemplates.length === 0;

    return (
        <ListingShell
            title="Notification Templates"
            description="Email, SMS, and WhatsApp message templates"
            count={pagination.totalRecords}
            isAddButtonVisible={true}
            addButtonLabel="Add Template"
            addButtonOnClick={() => navigate(ADMIN_ROUTES.TEMPLATES_ADD)}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            filterContent={filterContent}
            stats={stats}
        >
            {loading ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${isDark ? colors.neutral700 : colors.neutral200}` }}>
                            {["Sr No.", "Template", "Subject", "Channels", "Created", "Last Modified", "Action"].map((h) => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: colors.neutral400 }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            ) : showEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div
                        className="p-5 rounded-full"
                        style={{ background: isDark ? colors.neutral800 : colors.neutral100 }}
                    >
                        <FiInbox size={32} style={{ color: colors.neutral400 }} />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-base" style={{ color: colors.neutral700 }}>
                            {channelFilter !== "all"
                                ? `No ${channelFilter.charAt(0).toUpperCase() + channelFilter.slice(1)} templates on this page`
                                : filters.search
                                ? "No templates match your search"
                                : "No templates yet"}
                        </p>
                        <p className="text-sm mt-1" style={{ color: colors.neutral400 }}>
                            {channelFilter !== "all"
                                ? "Try switching to 'All' to see all templates"
                                : filters.search
                                ? "Try a different search term"
                                : "Create your first notification template to get started"}
                        </p>
                    </div>
                </div>
            ) : (
                <TableV1 schema={getSchema()} records={getRecords()} />
            )}
        </ListingShell>
    );
};

export default TemplateListTableTemplate;
