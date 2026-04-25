import React, { useState, useEffect } from "react";
import { type ColumnType } from "../../organisms/Table/TableV1";
import { type IPagination } from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import TableV1 from "../../organisms/Table/TableV1";
import { FiEdit, FiEye } from "react-icons/fi";
import { ADMIN_ROUTES, DEGREE_OPTIONS } from "../../../utils/constant";
import type { Education } from "../../../services/useEducationService";

interface IEducationsTableTemplateProps {
    educations: Education[];
    pagination: IPagination;
    handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EducationsTableTemplate: React.FC<IEducationsTableTemplateProps> = ({ educations, pagination, handlePaginationChange, handleRowsPerPageChange }) => {
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
            makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, {
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
            makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, {
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

    const getRecords = () => educations?.map((education: Education, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        education.institution,
        DEGREE_OPTIONS.find(opt => opt.value === education.degree)?.label ?? "",
        education.startYear ?? "",
        education.endYear ?? "",
        Action(education.id ?? "")
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' }, priority: "low" as const, hideOnMobile: true },
        { label: "Institution", key: "institution", type: "text" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Degree", key: "degree", type: "text" as ColumnType, props: { className: '' }, priority: "high" as const },
        { label: "Start Year", key: "startYear", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "End Year", key: "endYear", type: "date" as ColumnType, props: { className: '' }, priority: "medium" as const },
        { label: "Actions", key: "actions", type: "custom" as ColumnType, props: { className: '' }, priority: "low" as const },
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
export default EducationsTableTemplate;