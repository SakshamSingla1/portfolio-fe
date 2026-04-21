import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { StatusOptions, type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import { type NavlinkResponse } from "../../../services/useNavlinkService";
import { FiEdit, FiEye } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { enumToNormalKey } from "../../../utils/helper";
import ResourceStatus from "../../organisms/ResourceStatus/ResourceStatus";

interface INavlinkListTableTemplateProps {
    navlinks: NavlinkResponse[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
}

const NavlinkListTableTemplate: React.FC<INavlinkListTableTemplateProps> = ({ navlinks, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(
            makeRoute(ADMIN_ROUTES.NAVLINKS_EDIT, {
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
            makeRoute(ADMIN_ROUTES.NAVLINKS_VIEW, {
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

    const getRecords = () => navlinks?.map((navlink: NavlinkResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        `${enumToNormalKey(navlink.name)} (${navlink.index})`,
        DateUtils.dateTimeSecondToDate(navlink.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(navlink.updatedAt ?? ""),
        StatusOptions.find((status) => status.value === navlink.status)?.label,
        Action(navlink.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Created Date", key: "createdAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Last Modified", key: "updatedAt", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Status", key: "status", component: ({ value }: { value: string }) => <ResourceStatus status={value} />, type: "custom" as ColumnType, props: {}, priority: "medium" as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: "medium" as const },
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
        <TableV1 schema={getSchema()} records={getRecords()} />
    )
}
export default NavlinkListTableTemplate;
