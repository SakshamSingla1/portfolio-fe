import React, { useEffect, useState } from "react";
import { type ColumnType } from "../../organisms/Table/TableV2";
import { type IPagination } from "../../../utils/types";
import TableV2 from "../../organisms/Table/TableV2";
import { FiEye, FiEdit } from "react-icons/fi";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";
import { DateUtils, enumToNormalKey } from "../../../utils/helper";
import type { SocialLinkResponse } from "../../../services/useSocialLinkService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";

interface SocialLinksTableTemplateProps {
    socialLinks: SocialLinkResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocialLinksTableTemplate: React.FC<SocialLinksTableTemplateProps> = ({ socialLinks, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [localRecords, setLocalRecords] = useState<Record<string, unknown>[]>([]);
    const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
        if (socialLinks) {
            setLocalRecords(socialLinks.map((sl, index) => ({
                id: sl.id,
                serial: pagination.currentPage * pagination.pageSize + index + 1,
                platform: enumToNormalKey(sl.platform),
                status: sl.status,
                createdAt: DateUtils.dateTimeSecondToDate(sl.createdAt ?? ""),
                updatedAt: DateUtils.dateTimeSecondToDate(sl.updatedAt ?? ""),
            })));
        } else {
            setLocalRecords([]);
        }
    }, [socialLinks, pagination]);

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

    const getTableColumns = () => [
        { label: "Sr No.", key: "serial", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Platform", key: "platform", type: "string" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Created At", key: "createdAt", type: "string" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Updated At", key: "updatedAt", type: "string" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Action", key: "id", component: ({ value }: { value: string }) => Action(value), type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
    ];

    const getSchema = () => ({
        id: "social-links-table",
        rowKey: "id",
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
        <TableV2
            schema={getSchema()}
            records={localRecords}
            setRecords={setLocalRecords}
            showCheckboxes={true}
            selected={selectedRows}
            setSelected={setSelectedRows}
            isRounded={true}
        />
    )
}
export default SocialLinksTableTemplate;