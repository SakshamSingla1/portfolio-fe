import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateUtils, makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import { FiEdit, FiEye } from "react-icons/fi";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { type Logo } from '../../../services/useLogoService';

interface LogoTableTemplateProps {
    logos: Logo[];
    pagination: IPagination;
    handlePaginationChange: (event: any, newPage: number) => void;
    handleRowsPerPageChange: (event: any) => void;
}

const LogoTableTemplate: React.FC<LogoTableTemplateProps> = ({ logos, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.LOGO_EDIT, { query, params: { id: id } }));
    }

    const handleView = (id: string) => {
        const query = {
            page: searchParams.get("page") || "",
            size: searchParams.get("size") || "",
            search: searchParams.get("search") || "",
        }
        navigate(makeRoute(ADMIN_ROUTES.LOGO_VIEW, { query, params: { id: id } }));
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

    const getRecords = () => logos?.map((logo: Logo, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        logo.name,
        logo.url,
        DateUtils.dateTimeSecondToDate(logo.createdAt ?? ""),
        DateUtils.dateTimeSecondToDate(logo.updatedAt ?? ""),
        Action(logo.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: 'low' as const, hideOnMobile: true },
        { label: "Name", key: "name", type: "text" as ColumnType, props: { className: '' }, priority: 'high' as const },
        { label: "URL", key: "url", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Created At", key: "createdAt", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Updated At", key: "updatedAt", type: "text" as ColumnType, props: { className: '' }, priority: 'medium' as const },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' }, priority: 'medium' as const },
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
export default LogoTableTemplate;